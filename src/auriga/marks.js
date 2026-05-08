import { apiFetch, fetchAllSearchResults } from './api.js';
import { buildNameLookup, buildGradeTree, parseExamCode } from './hierarchy.js';
import { parseGradeLine, parseSynthesisLine, parsePedagogicalLine, validateParseResults, MENU_CODES } from './schema.js';

let _menuConfig = null;

async function getMenuConfig() {
    if (_menuConfig) return _menuConfig;

    const menus = await apiFetch('/menus');
    const entries = {};

    for (const menu of menus.menus) {
        for (const obj of menu.objects || []) {
            entries[obj.menuEntryCode] = {
                menuEntryId: obj.menuEntryId,
                queryId: obj.queryId,
                formId: obj.formId,
            };
        }
    }

    _menuConfig = {
        grades:      entries[MENU_CODES.grades],
        synthesis:   entries[MENU_CODES.synthesis],
        pedagogical: entries[MENU_CODES.pedagogical],
    };

    if (!_menuConfig.grades) {
        throw new Error(`Menu entries not found: grades (${MENU_CODES.grades}). `
            + `Available: ${Object.keys(entries).join(', ')}. `
            + `Auriga may have renamed its menu structure.`);
    }
    if (!_menuConfig.synthesis) {
        throw new Error(`Menu entries not found: synthesis (${MENU_CODES.synthesis}). `
            + `Available: ${Object.keys(entries).join(', ')}. `
            + `Auriga may have renamed its menu structure.`);
    }
    // Pedagogical endpoint is optional — used for hierarchy detection
    // Falls back to name-based heuristic if unavailable

    return _menuConfig;
}

let _cachedSynthesisEntries = null;
let _componentTypesPromise;

/** Fetch component type map from the pedagogical endpoint, or null if unavailable. */
function getComponentTypes() {
    if (_componentTypesPromise) return _componentTypesPromise;

    _componentTypesPromise = (async () => {
        const config = await getMenuConfig();
        if (!config.pedagogical) return null;

        try {
            const raw = await fetchAllSearchResults(config.pedagogical.menuEntryId, config.pedagogical.queryId);
            const entries = raw.map(parsePedagogicalLine).filter(Boolean);
            const types = new Map();
            for (const { examCode, componentType } of entries) {
                types.set(examCode, componentType);
            }
            return types;
        } catch (err) {
            console.warn('[Infinity Auriga] Failed to fetch pedagogical data, using fallback:', err.message);
            return null;
        }
    })();

    return _componentTypesPromise;
}

export async function getMarksFilters() {
    const config = await getMenuConfig();
    const synth = config.synthesis;
    const rawLines = await fetchAllSearchResults(synth.menuEntryId, synth.queryId);

    const entries = rawLines.map(parseSynthesisLine).filter(Boolean);
    validateParseResults('synthesis', rawLines, entries);
    _cachedSynthesisEntries = entries;

    const semesters = new Map();
    for (const entry of entries) {
        const parsed = parseExamCode(entry.examCode);
        if (!parsed) continue;

        const key = `${parsed.semester}_${parsed.year}`;
        if (!semesters.has(key)) {
            const semNum = parsed.semester.replace('S', '');
            const yearStart = '20' + parsed.year.substring(0, 2);
            const yearEnd = '20' + parsed.year.substring(2, 4);
            semesters.set(key, {
                name: `Semestre ${semNum} - ${yearStart}/${yearEnd}`,
                value: key,
            });
        }
    }

    return [{
        id: 'semester',
        name: 'Semestre',
        values: Array.from(semesters.values()).sort((a, b) => b.value.localeCompare(a.value)),
    }];
}

export async function getMarks(filters) {
    const semFilter = filters.semester;
    if (!semFilter) throw new Error('No semester selected');

    const [semester, year] = semFilter.split('_');

    const config = await getMenuConfig();

    const [rawGrades, synthesisEntries, componentTypes] = await Promise.all([
        fetchAllSearchResults(config.grades.menuEntryId, config.grades.queryId)
            .then(raw => {
                const entries = raw.map(parseGradeLine).filter(Boolean);
                validateParseResults('grades', raw, entries);
                return entries;
            }),
        _cachedSynthesisEntries
            ? Promise.resolve(_cachedSynthesisEntries)
            : fetchAllSearchResults(config.synthesis.menuEntryId, config.synthesis.queryId)
                .then(raw => {
                    const entries = raw.map(parseSynthesisLine).filter(Boolean);
                    validateParseResults('synthesis', raw, entries);
                    return entries;
                }),
        getComponentTypes(),
    ]);

    const filteredGrades = rawGrades.filter(g => {
        const parsed = parseExamCode(g.examCode);
        return parsed && parsed.year === year && parsed.semester === semester;
    });

    const filteredSynthesis = synthesisEntries.filter(e => {
        const parsed = parseExamCode(e.examCode);
        return parsed && parsed.year === year && parsed.semester === semester;
    });

    const nameLookup = buildNameLookup(synthesisEntries);

    // When no grades exist, build skeleton from synthesis leaf entries
    let gradesToBuild = filteredGrades;
    if (filteredGrades.length === 0) {
        const parents = new Set();
        const candidates = filteredSynthesis.filter(e => {
            const p = parseExamCode(e.examCode);
            return p && p.path.length >= 2;
        });
        for (const e of candidates) {
            const parts = e.examCode.split('_');
            for (let i = 1; i < parts.length; i++) {
                parents.add(parts.slice(0, i).join('_'));
            }
        }
        gradesToBuild = candidates
            .filter(e => !parents.has(e.examCode))
            .map(e => ({ examCode: e.examCode, mark: null, coefficient: 100, examType: null }));
    }

    const marks = buildGradeTree(gradesToBuild, nameLookup, componentTypes);

    // Extract promo average from synthesis data
    let classAverage = null;
    const promoValues = filteredSynthesis
        .filter(e => e.avgPreRatt != null)
        .map(e => parseFloat(e.avgPreRatt))
        .filter(v => !isNaN(v) && v > 0);
    if (promoValues.length > 0) {
        classAverage = promoValues.reduce((s, v) => s + v, 0) / promoValues.length;
    }

    return { classAverage, marks };
}
