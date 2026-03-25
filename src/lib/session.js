import { getName } from './auriga/auth.js';
import { getMarks, getMarksFilters } from './auriga/marks.js';
import { getUpdates } from './updates.js';
import { loadCoefficients, applyCoefficients, generateTemplate } from './coefficients/index.js';

/**
 * Load initial session: user name, available filters, last selection.
 */
export async function loadSession(status) {
    status?.step('Récupération du profil...');
    const name = await getName().catch(() => 'Etudiant');
    status?.step('Récupération des filtres...');
    const filters = await getMarksFilters();

    const saved = localStorage.getItem('auriga_filters');
    const filtersValues = saved
        ? JSON.parse(saved)
        : filters[0]?.values.length > 0
            ? { semester: filters[0].values[0].value }
            : {};

    return { name, filters, filtersValues };
}

/**
 * Fetch marks, apply coefficient overrides, compute updates.
 */
export async function fetchMarksAndUpdates(filtersValues, status) {
    status?.step('Récupération des notes...');
    const result = await getMarks(filtersValues);
    const marks = result.marks;

    // Detect track from grade codes (e.g. "FISA")
    const firstCode = marks.flatMap(m => m.subjects.flatMap(s => s.marks)).find(m => m._code)?._code;
    const track = firstCode?.split('_')[3] ?? null;

    // Load & apply coefficient overrides (falls back to API values)
    status?.step('Application des coefficients...');
    const coeffData = track ? await loadCoefficients(filtersValues.semester, track) : null;
    const { average } = applyCoefficients(marks, coeffData?.overrides ?? null);

    status?.step('Calcul des changements...');
    const updates = getUpdates(filtersValues, marks);

    // When no coefficient file exists, generate a pre-filled template for contributors
    const coeffTemplate = !coeffData && track
        ? generateTemplate(marks, filtersValues.semester, track)
        : null;

    return {
        marks,
        averages: { student: average, promo: result.classAverage },
        updates,
        coeffSource: coeffData?.file ?? null,
        coeffTemplate,
    };
}

/**
 * Try to load marks from localStorage cache (saved by the updates system).
 * Returns a render-ready data object, or null if no cache exists.
 */
export function loadCachedMarks(filtersValues) {
    const save = JSON.parse(localStorage.getItem('auriga_marks_save') || '{}');
    const key = JSON.stringify(filtersValues);
    const marks = save[key];
    if (!marks || marks.length === 0) return null;

    // Recompute student average from cached marks
    // _rawCoefficient holds the pre-normalization value set by applyCoefficients
    let totalSum = 0;
    let totalWeight = 0;
    for (const mod of marks) {
        for (const sub of mod.subjects) {
            for (const mark of sub.marks) {
                if (mark.value != null && mark.value !== 0.01) {
                    const coef = mark._rawCoefficient ?? mark.coefficient;
                    totalSum += mark.value * coef;
                    totalWeight += coef;
                }
            }
        }
    }

    const updates = JSON.parse(localStorage.getItem('auriga_updates') || '{}');

    return {
        marks,
        averages: { student: totalWeight > 0 ? totalSum / totalWeight : null, promo: null },
        updates: updates[key] || [],
        coeffSource: null,
        coeffTemplate: null,
    };
}

/**
 * Persist semester selection.
 */
export function saveSemesterFilter(value) {
    const filtersValues = { semester: value };
    localStorage.setItem('auriga_filters', JSON.stringify(filtersValues));
    return filtersValues;
}
