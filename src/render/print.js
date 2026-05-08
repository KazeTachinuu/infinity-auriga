/**
 * Print view — generates a clean bulletin-style table for PDF export.
 * Hidden on screen, shown only in @media print.
 *
 * Pass lang='en' (or any registered i18n lang) to render that language's variant.
 * Course names come from Auriga's caption.{fr,en} via mod.name / mod.nameEn.
 */

import { h } from './dom.js';
import { app } from '../app.js';
import { tFor, getLang } from '../i18n.js';

function fmt(v) {
    if (v === 0.01) return 'Abs.';
    if (v !== 0 && !v) return '';
    return v.toFixed(2).replace('.', ',');
}

export function renderPrintView(marks, averages, coeffMeta, name, lang = getLang()) {
    // The print view honors a lang override (button click) without flipping global state,
    // so we resolve every string against the explicit lang via tFor.
    const tr = (key, ...args) => tFor(lang, key, ...args);
    const pickName = (mod) => (lang === 'en' ? (mod.nameEn || mod.name) : mod.name);

    const rows = [];
    for (const mod of marks) {
        rows.push(h('tr', { class: 'p-ue' },
            h('td', { class: 'p-left' }, pickName(mod)),
            h('td', {}, mod._overridden ? String(mod.coefficient) : ''),
            h('td', {}, fmt(mod.classAverage)),
            h('td', {}, fmt(mod.average)),
        ));
        for (const sub of mod.subjects) {
            const subDisplayName = pickName(sub);
            const hasRealName = subDisplayName !== sub.id.replace(/_/g, ' ');
            const shortId = sub.id.startsWith(mod.id + '_') ? sub.id.slice(mod.id.length + 1) : sub.id;
            const subName = hasRealName ? subDisplayName : shortId.replace(/_/g, ' ');
            const coefTag = sub._overridden ? h('span', { class: 'p-coef' }, tr('badges.coef', sub.coefficient)) : null;
            rows.push(h('tr', { class: 'p-sub' },
                h('td', { class: 'p-left' }, subName, ...(coefTag ? [coefTag] : [])),
                h('td', {}),
                h('td', {}, fmt(sub.classAverage)),
                h('td', {}, fmt(sub.average)),
            ));
        }
    }
    rows.push(h('tr', { class: 'p-total' },
        h('td', { class: 'p-left', colspan: '2' }, tr('print.overallAvg')),
        h('td', {}, fmt(averages.promo)),
        h('td', {}, fmt(averages.student)),
    ));

    const year = coeffMeta ? `20${coeffMeta.year.slice(0, 2)}/20${coeffMeta.year.slice(2)}` : '';
    const sem = coeffMeta?.semester || '';
    const semNum = sem.replace(/\D/g, '');
    const trackLabel = coeffMeta ? (coeffMeta.name || `${coeffMeta.track} ${coeffMeta.major || ''}`.trim()) : '';
    const trackCode = coeffMeta ? `${coeffMeta.track}${coeffMeta.major ? ' ' + coeffMeta.major : ''}` : '';

    return h('div', { id: 'print-view' },
        h('div', { class: 'p-header' },
            h('div', { class: 'p-header-left' },
                ...(trackCode && year ? [h('div', { class: 'p-info' }, tr('print.cycleYear', trackCode, year))] : []),
                ...(semNum ? [h('div', { class: 'p-info' }, tr('print.bulletin', semNum))] : []),
                ...(name ? [h('div', { class: 'p-student' }, name)] : []),
            ),
            ...(trackLabel ? [h('div', { class: 'p-header-right' }, trackLabel)] : []),
        ),
        h('table', { class: 'p-table' },
            h('thead', {},
                h('tr', {},
                    h('th', { class: 'p-left p-col-name' }, tr('print.colSemester', semNum)),
                    h('th', { class: 'p-col-ects' }, tr('print.colEcts')),
                    h('th', { class: 'p-col-avg' }, tr('print.colAvgPromoL1'), h('br'), tr('print.colAvgPromoL2')),
                    h('th', { class: 'p-col-avg' }, tr('print.colAvgStudentL1'), h('br'), tr('print.colAvgStudentL2')),
                ),
            ),
            h('tbody', {}, ...rows),
        ),
        h('div', { class: 'p-footer' }, tr('print.footer', app.version)),
    );
}
