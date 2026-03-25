/**
 * Coefficient override system — flat weighted average.
 *
 * Auriga treats all exams as equally weighted (coefficient 100).
 * This module applies the real coefficients contributed by the community.
 *
 * The student average is a flat weighted average of all marks:
 *   Σ(mark × coef) / Σ(coef)
 *
 * Subject and module weights are derived from the sum of their children's
 * coefficients by default, but can be explicitly overridden if needed.
 *
 * Only entries whose coefficient is NOT 1 need to be listed.
 */

// Auto-discover all coefficient files at build time (Vite glob import)
const modules = import.meta.glob('./*.js', { import: 'default' });

/**
 * Load coefficient overrides for a semester/track combo.
 * Returns { overrides: Map, file: string } or null.
 */
export async function loadCoefficients(semesterKey, track) {
    const file = `${semesterKey}_${track}`.toLowerCase() + '.js';
    const loader = modules[`./${file}`];
    if (!loader) return null;
    const data = await loader();
    return { overrides: new Map(Object.entries(data)), file };
}

/**
 * Generate a pre-filled coefficient template from the current grade tree.
 * All marks are listed with coefficient 1, organized by module/subject with
 * human-readable comments — ready for a contributor to fill in real values.
 *
 * @param {Module[]} marks - grade tree (after buildGradeTree, before applyCoefficients)
 * @param {string} semesterKey - e.g. "S07_2526"
 * @param {string} track - e.g. "FISA"
 * @returns {{ filename: string, content: string }}
 */
export function generateTemplate(marks, semesterKey, track) {
    const [semester, year] = semesterKey.split('_');
    const filename = `${semesterKey}_${track}`.toLowerCase() + '.js';
    const yearLabel = `20${year.slice(0, 2)}/20${year.slice(2)}`;

    // Collect all mark entries with their module context
    const entries = [];
    for (const mod of marks) {
        const modEntries = [];
        for (const sub of mod.subjects) {
            for (const mark of sub.marks) {
                modEntries.push({ code: mark._code, name: mark.name });
            }
        }
        if (modEntries.length > 0) {
            entries.push({ module: mod.name, marks: modEntries });
        }
    }

    // Find max code length for aligned comments
    const maxLen = Math.max(...entries.flatMap(e => e.marks.map(m => m.code.length)));

    const lines = [
        `/**`,
        ` * Coefficients — ${semester} ${track} ${yearLabel}`,
        ` * Only list entries whose coefficient is NOT 1.`,
        ` */`,
        `export default {`,
    ];

    for (let i = 0; i < entries.length; i++) {
        const { module: modName, marks: modMarks } = entries[i];
        lines.push(`    // ── ${modName} ${'─'.repeat(Math.max(1, 50 - modName.length))}`);
        for (const { code, name } of modMarks) {
            const pad = ' '.repeat(Math.max(1, maxLen - code.length));
            lines.push(`    '${code}': 1,${pad} // ${name}`);
        }
        if (i < entries.length - 1) lines.push('');
    }

    lines.push(`};`, '');

    return { filename, content: lines.join('\n') };
}

/**
 * Apply coefficient overrides and compute all averages.
 *
 * @param {Module[]} marks - grade tree (mutated in place)
 * @param {Map|null} overrides - from loadCoefficients
 * @returns {{ average: number|null }}
 */
export function applyCoefficients(marks, overrides) {
    for (const mod of marks) {
        if (overrides?.has(mod._code)) {
            mod.coefficient = overrides.get(mod._code);
            mod._overridden = true;
        }
        if (!mod.coefficient || mod.coefficient === 100) mod.coefficient = 1;

        for (const sub of mod.subjects) {
            if (overrides?.has(sub._code)) {
                sub.coefficient = overrides.get(sub._code);
                sub._overridden = true;
            }
            if (sub.coefficient === 100) sub.coefficient = 1;

            for (const mark of sub.marks) {
                if (overrides?.has(mark._code)) {
                    mark.coefficient = overrides.get(mark._code);
                    mark._overridden = true;
                }
                if (mark.coefficient === 100) mark.coefficient = 1;
            }
        }
    }

    // Compute averages bottom-up; overall average is flat across all marks
    let totalSum = 0;
    let totalWeight = 0;

    for (const mod of marks) {
        for (const sub of mod.subjects) {
            let subTotal = 0;
            let subWeight = 0;

            for (const mark of sub.marks) {
                if (mark.value != null && mark.value !== 0.01) {
                    subTotal += mark.value * mark.coefficient;
                    subWeight += mark.coefficient;
                    totalSum += mark.value * mark.coefficient;
                    totalWeight += mark.coefficient;
                }
            }

            sub.average = subWeight > 0 ? subTotal / subWeight : null;
            if (!sub._overridden) sub.coefficient = subWeight || 1;

            if (subWeight > 0) {
                for (const mark of sub.marks) {
                    mark._rawCoefficient = mark.coefficient;
                    mark.coefficient = mark.coefficient / subWeight;
                }
            }
        }

        let modTotal = 0;
        let modWeight = 0;
        for (const sub of mod.subjects) {
            if (sub.average != null) {
                modTotal += sub.average * sub.coefficient;
                modWeight += sub.coefficient;
            }
        }
        mod.average = modWeight > 0 ? modTotal / modWeight : null;
        if (!mod._overridden) mod.coefficient = modWeight || 1;
    }

    return { average: totalWeight > 0 ? totalSum / totalWeight : null };
}
