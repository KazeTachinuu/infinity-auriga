/**
 * Auriga API response schema — column mappings and line parsers.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  THIS IS THE SINGLE FILE TO UPDATE IF AURIGA CHANGES FORMAT.   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Auriga search endpoints return { content: { columns: [...], lines: [...] } }.
 * Each line is an array of values whose positions are defined below.
 *
 * GRADES endpoint (APP_040_010_MES_NOTES, e.g. menuEntry 1036):
 *   [0] internalId   [1] mark (string)  [2] coefficient  [3] examCode  [4] examType
 *
 * SYNTHESIS endpoint (APP_040_010_MES_NOTES_SYNT, e.g. menuEntry 1144):
 *   [0] personId     [1] avgPreRatt     [2] examCode      [3] caption {fr,en}  [4] avgFinal
 *
 * PEDAGOGICAL REGISTRATION endpoint (APP_000_014_INSC_PEDA, e.g. menuEntry 1034):
 *   [0] internalId   [1] examCode       [2] obligationType {en,fr}   [3] registrationStatus {en,fr}
 *   Component types (en): "Semester", "EU Resource", "EU Authentic Assessment Situation",
 *                         "Educational unit (ECUE)"
 *
 * Last verified: 2026-03-26 against capture auriga-capture-1774299604740.json
 */

// --- Menu entry codes (how Auriga identifies its grade views) -------------------

export const MENU_CODES = {
    grades:    'APP_040_010_MES_NOTES',
    synthesis: 'APP_040_010_MES_NOTES_SYNT',
    pedagogical: 'APP_000_014_INSC_PEDA',
};

// --- Column indices -------------------------------------------------------------

const GRADES = { internalId: 0, mark: 1, coefficient: 2, examCode: 3, examType: 4 };
const SYNTHESIS = { personId: 0, avgPreRatt: 1, examCode: 2, caption: 3, avgFinal: 4 };
const PEDAGOGICAL = { internalId: 0, examCode: 1, obligationType: 2, registrationStatus: 3 };

// --- Validation -----------------------------------------------------------------

/**
 * Check parsed results for signs that the API format has changed.
 * Call after parsing a batch of lines — throws if most lines failed to parse.
 *
 * @param {string} endpoint - Human-readable name ("grades" or "synthesis")
 * @param {Array} rawLines - Original raw lines from the API
 * @param {Array} parsed - Successfully parsed entries (nulls filtered out)
 */
export function validateParseResults(endpoint, rawLines, parsed) {
    if (rawLines.length === 0) return; // No data is not an error (empty semester)

    const failRate = 1 - (parsed.length / rawLines.length);
    if (failRate > 0.5) {
        throw new Error(
            `API format changed: ${Math.round(failRate * 100)}% of ${endpoint} lines failed to parse `
            + `(${parsed.length}/${rawLines.length} succeeded). `
            + `Check schema.js column indices against a fresh capture.`
        );
    }
}

// --- Line parsers ---------------------------------------------------------------

/**
 * Parse a raw grade line into a named object.
 *
 * @param {Array} line - Raw array from Auriga searchResult
 * @returns {{ mark: number, coefficient: number, examCode: string, examType: string|null } | null}
 */
export function parseGradeLine(line) {
    const examCode = line[GRADES.examCode];
    if (!examCode || typeof examCode !== 'string') {
        console.warn('[Infinity] Unexpected grade line — examCode missing at index', GRADES.examCode, line);
        return null;
    }

    const mark = parseFloat(line[GRADES.mark]);
    if (isNaN(mark)) return null;

    return {
        mark,
        coefficient: line[GRADES.coefficient] || 100,
        examCode,
        examType: line[GRADES.examType] || null,
    };
}

/**
 * Parse a raw synthesis line into a named object.
 *
 * @param {Array} line - Raw array from Auriga searchResult
 * @returns {{ examCode: string, name: string, avgPreRatt: *, avgFinal: * } | null}
 */
export function parseSynthesisLine(line) {
    const examCode = line[SYNTHESIS.examCode];
    if (!examCode || typeof examCode !== 'string') {
        console.warn('[Infinity] Unexpected synthesis line — examCode missing at index', SYNTHESIS.examCode, line);
        return null;
    }

    const caption = line[SYNTHESIS.caption] || {};
    return {
        examCode,
        name: caption.fr || caption.en || examCode,
        avgPreRatt: line[SYNTHESIS.avgPreRatt],
        avgFinal: line[SYNTHESIS.avgFinal],
    };
}

/**
 * Parse a pedagogical registration line into a named object.
 * Returns the component type (en) which tells us the hierarchy level.
 *
 * @param {Array} line - Raw array from Auriga searchResult
 * @returns {{ examCode: string, componentType: string } | null}
 */
export function parsePedagogicalLine(line) {
    const examCode = line[PEDAGOGICAL.examCode];
    if (!examCode || typeof examCode !== 'string') return null;

    const typeCaption = line[PEDAGOGICAL.obligationType] || {};
    return {
        examCode,
        componentType: typeCaption.en || typeCaption.fr || '',
    };
}
