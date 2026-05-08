/**
 * Parse an Auriga exam code into its hierarchical components.
 *
 * Code anatomy:
 *   2526_I_INF_FISA_S07_CS_GR_WS_EX
 *   │    │ │   │    │   └── path segments ──┘ └─ evalType
 *   [0]  1 2   3    4       5...               last (if in EVAL_TYPES)
 *
 *   [0] year       — academic year (25/26)
 *   [1] constant   — always "I"
 *   [2] school     — school code (INF for EPITA informatique)
 *   [3] track      — FISA, FISE, GISTRE, ...
 *   [4] semester   — S07, S08, ...
 *   [5+] path      — module / subject / exam segments
 *   [last] evalType — EX, PRJ, etc. (stripped from path if recognized)
 */

// Recognized evaluation type suffixes.
const EVAL_TYPES = new Set(['EX', 'PRJ', 'EXF', 'EXO', 'FAF', 'PROJ']);

// Human-readable labels for eval type codes
const EVAL_LABELS = {
    EX: 'Examen', EXF: 'Examen final', EXO: 'Examen oral',
    PRJ: 'Projet', PROJ: 'Projet', FAF: 'Contrôle continu',
};


/**
 * @param {string} code - The full exam code
 * @param {string|null} [apiExamType] - Exam type from the API column (skips guessing when present)
 */
export function parseExamCode(code, apiExamType = null) {
    const parts = code.split('_');
    if (parts.length < 5) return null;

    const year = parts[0];
    const school = parts[2];
    const track = parts[3];
    const semester = parts[4];
    const rest = parts.slice(5);

    let evalType = apiExamType;
    let path = rest;

    if (!evalType && rest.length > 0 && EVAL_TYPES.has(rest[rest.length - 1])) {
        evalType = rest[rest.length - 1];
        path = rest.slice(0, -1);
    }

    return { year, school, track, semester, path, evalType, fullCode: code };
}

/**
 * Build a name lookup from parsed synthesis entries.
 */
export function buildNameLookup(entries) {
    const lookup = new Map();
    for (const entry of entries) {
        lookup.set(entry.examCode, {
            name: entry.name,
            avgPreRatt: entry.avgPreRatt,
            avgFinal: entry.avgFinal,
        });
    }
    return lookup;
}

/**
 * Detect transparent path prefixes — codes that are containers (semester wrappers,
 * phantom groupings like SAE) rather than real UEs.
 *
 * A prefix is transparent if:
 *   1. Pedagogical API marks it as "Semester" type, OR
 *   2. Its synthesis name contains "semestre", OR
 *   3. It has no synthesis name AND has multiple distinct children
 *      (phantom grouping — e.g. SAE groups DEVSEC + INT but isn't a real UE)
 *
 * Detection is applied recursively: if CS is transparent and SAE (under CS) is also
 * transparent, both are stripped. CS_SAE_INT_PEN → [INT, PEN].
 */
function detectTransparentPrefixes(grades, nameLookup, componentTypes) {
    // Count distinct children per path prefix
    const children = new Map(); // "CS" → Set{"CN","FR","GR",...}, "CS>SAE" → Set{"DEVSEC","INT"}
    for (const grade of grades) {
        const parsed = parseExamCode(grade.examCode, grade.examType);
        if (!parsed || parsed.path.length < 2) continue;
        const id0 = parsed.path[0];
        if (!children.has(id0)) children.set(id0, new Set());
        children.get(id0).add(parsed.path[1]);
        if (parsed.path.length >= 3) {
            const key = id0 + '>' + parsed.path[1];
            if (!children.has(key)) children.set(key, new Set());
            children.get(key).add(parsed.path[2]);
        }
    }

    const transparent = new Set();

    function isTransparent(pathId, fullCode, key) {
        // Check pedagogical API
        if (componentTypes) {
            const type = componentTypes.get(fullCode);
            if (type && /semester/i.test(type)) return true;
        }
        // Check synthesis name
        const info = resolveName(fullCode, '_' + pathId, nameLookup);
        if (info && /semestre/i.test(info.name)) return true;
        // No name + multiple children → phantom grouping
        if (!info && (children.get(key)?.size ?? 0) > 1) return true;
        return false;
    }

    // Check each unique path[0]
    const checked = new Set();
    for (const grade of grades) {
        const parsed = parseExamCode(grade.examCode, grade.examType);
        if (!parsed || parsed.path.length < 2) continue;

        const prefix = `${parsed.year}_I_${parsed.school}_${parsed.track}_${parsed.semester}`;
        const id0 = parsed.path[0];

        if (!checked.has(id0)) {
            checked.add(id0);
            if (isTransparent(id0, `${prefix}_${id0}`, id0)) {
                transparent.add(id0);
            }
        }

        // If path[0] is transparent, also check path[1]
        if (transparent.has(id0) && parsed.path.length >= 3) {
            const id1 = parsed.path[1];
            const key = id0 + '>' + id1;
            if (!checked.has(key)) {
                checked.add(key);
                if (isTransparent(id1, `${prefix}_${id0}_${id1}`, key)) {
                    transparent.add(key);
                }
            }
        }
    }

    return transparent;
}

/**
 * Get the effective path for a grade, skipping transparent prefixes.
 * CS_SAE_INT_PEN → [INT, PEN] (CS and SAE both skipped)
 * CS_CN_COCO     → [CN, COCO] (CS skipped)
 * CN_COLIN       → [CN, COLIN] (no skip)
 */
function effectivePath(path, transparentPrefixes) {
    let p = path;
    // Skip depth 0 if transparent
    if (p.length >= 2 && transparentPrefixes.has(p[0])) {
        const key = p[0] + '>' + p[1];
        // Skip depth 1 too if also transparent
        if (p.length >= 3 && transparentPrefixes.has(key)) {
            p = p.slice(2);
        } else {
            p = p.slice(1);
        }
    }
    return p;
}

/**
 * Pre-scan to detect which depth-2 path prefixes need depth-3 subject grouping.
 * Only promotes when depth-3 entries have children (path length >= 4),
 * meaning they're sub-subject groupings, not leaf exams.
 */
function detectSubjectDepths(grades, transparentPrefixes) {
    const info = new Map();
    for (const grade of grades) {
        const parsed = parseExamCode(grade.examCode, grade.examType);
        if (!parsed) continue;
        const path = effectivePath(parsed.path, transparentPrefixes);
        if (path.length < 3) continue;
        const key = path.slice(0, 2).join('_');
        if (!info.has(key)) info.set(key, { subGroups: new Set(), maxDepth: 0 });
        const entry = info.get(key);
        entry.subGroups.add(path[2]);
        entry.maxDepth = Math.max(entry.maxDepth, path.length);
    }
    const deep = new Set();
    for (const [key, { subGroups, maxDepth }] of info) {
        if (subGroups.size > 1 && maxDepth >= 4) deep.add(key);
    }
    return deep;
}

/**
 * Find the subject grouping level for a path.
 * Default depth 2, promoted to depth 3 when detected as deep.
 */
function findSubjectLevel(prefix, path, deepPrefixes) {
    if (path.length >= 3) {
        const d2 = path.slice(0, 2).join('_');
        if (deepPrefixes.has(d2)) {
            const id = path.slice(0, 3).join('_');
            return { id, code: `${prefix}_${id}` };
        }
    }
    if (path.length >= 2) {
        const id = path.slice(0, 2).join('_');
        return { id, code: `${prefix}_${id}` };
    }
    return { id: path[0] || 'TC', code: `${prefix}_${path[0] || 'TC'}` };
}

/**
 * Resolve a name from the lookup, falling back to cross-semester suffix matching.
 */
function resolveName(code, suffix, nameLookup) {
    const info = nameLookup.get(code);
    if (info) return info;

    for (const [key, val] of nameLookup) {
        if (key.endsWith(suffix)) return val;
    }
    return null;
}

/**
 * Build the grade tree from parsed grade entries.
 *
 * Hierarchy: Module (UE) → Subject (ECUE) → Mark (individual grade)
 *
 * Semester containers (e.g. CS) are detected and made transparent —
 * their children are promoted to top-level modules. This merges
 * entries like CS_CN_* and CN_* into the same module.
 */
export function buildGradeTree(grades, nameLookup, componentTypes = null) {
    const transparentPrefixes = detectTransparentPrefixes(grades, nameLookup, componentTypes);
    const deepPrefixes = detectSubjectDepths(grades, transparentPrefixes);
    const modules = new Map();

    for (const grade of grades) {
        const parsed = parseExamCode(grade.examCode, grade.examType);
        if (!parsed) continue;

        const { semester, school } = parsed;
        const prefix = `${parsed.year}_I_${school}_${parsed.track}_${semester}`;
        const path = effectivePath(parsed.path, transparentPrefixes);

        const moduleId = path[0] || 'TC';
        const moduleCode = `${prefix}_${moduleId}`;

        const subject = findSubjectLevel(prefix, path, deepPrefixes);

        if (!modules.has(moduleCode)) {
            const info = resolveName(moduleCode, '_' + moduleId, nameLookup);
            let name = moduleId;
            if (info) {
                name = info.name.length <= 40 ? info.name : moduleId;
            }
            const modPromo = info?.avgPreRatt ? parseFloat(info.avgPreRatt) : NaN;
            modules.set(moduleCode, {
                id: moduleId,
                _code: moduleCode,
                name,
                average: null,
                classAverage: isNaN(modPromo) ? null : modPromo,
                subjects: new Map(),
            });
        }

        const mod = modules.get(moduleCode);

        if (!mod.subjects.has(subject.code)) {
            const info = resolveName(subject.code, '_' + subject.id, nameLookup);
            const subPromo = info?.avgPreRatt ? parseFloat(info.avgPreRatt) : NaN;
            mod.subjects.set(subject.code, {
                id: subject.id,
                _code: subject.code,
                name: info ? info.name : subject.id.replace(/_/g, ' '),
                average: null,
                classAverage: isNaN(subPromo) ? null : subPromo,
                coefficient: 1,
                marks: [],
            });
        }

        const sub = mod.subjects.get(subject.code);

        if (sub.marks.some(m => m._code === grade.examCode)) continue;

        const examInfo = nameLookup.get(grade.examCode);
        const promoAvg = examInfo?.avgPreRatt ? parseFloat(examInfo.avgPreRatt) : null;
        sub.marks.push({
            id: sub.marks.length,
            _code: grade.examCode,
            name: examInfo ? examInfo.name : (parsed.evalType || 'Note'),
            value: grade.mark,
            classAverage: isNaN(promoAvg) ? null : promoAvg,
            coefficient: grade.coefficient,
        });
    }

    // Convert Maps to arrays. Group marks that share a common course name
    // under a section header (_group). The base name is derived by stripping
    // the last " - suffix" from each mark name — marks with the same base
    // are grouped together.
    const result = [];
    for (const [, mod] of modules) {
        mod.subjects = [...mod.subjects.values()];
        for (const sub of mod.subjects) {
            if (sub.marks.length < 2) continue;

            // Find base name for each mark (strip last " - ..." suffix)
            const baseName = name => {
                const i = name.lastIndexOf(' - ');
                return i > 0 ? name.slice(0, i) : name;
            };

            // Count how many marks share each base
            const baseCounts = new Map();
            for (const mark of sub.marks) {
                const base = baseName(mark.name);
                baseCounts.set(base, (baseCounts.get(base) || 0) + 1);
            }

            // Apply grouping to marks whose base has 2+ members
            for (const mark of sub.marks) {
                const base = baseName(mark.name);
                if (baseCounts.get(base) < 2) continue;

                mark._group = base;
                if (mark.name === base) {
                    // No suffix — use eval type as label
                    const parsed = parseExamCode(mark._code);
                    mark.name = parsed?.evalType
                        ? (EVAL_LABELS[parsed.evalType] || parsed.evalType)
                        : base;
                }
                // Marks with suffix get prefix stripped in rendering
            }
        }
        result.push(mod);
    }

    return result;
}
