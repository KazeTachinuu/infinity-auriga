/**
 * Print view — generates a clean bulletin-style table for PDF export.
 * Hidden on screen, shown only in @media print.
 */

import { h } from './dom.js';
import { app } from '../app.js';

function fmt(v) {
    if (v === 0.01) return 'Abs.';
    if (v !== 0 && !v) return '';
    return v.toFixed(2).replace('.', ',');
}

export function renderPrintView(marks, averages, coeffMeta, name) {
    const rows = [];
    for (const mod of marks) {
        rows.push(h('tr', { class: 'p-ue' },
            h('td', { class: 'p-left' }, mod.name),
            h('td', {}, mod._overridden ? String(mod.coefficient) : ''),
            h('td', {}, fmt(mod.classAverage)),
            h('td', {}, fmt(mod.average)),
        ));
        for (const sub of mod.subjects) {
            // Use real name if available, otherwise strip module prefix from ID for a cleaner fallback
            const hasRealName = sub.name !== sub.id.replace(/_/g, ' ');
            const shortId = sub.id.startsWith(mod.id + '_') ? sub.id.slice(mod.id.length + 1) : sub.id;
            const subName = hasRealName ? sub.name : shortId.replace(/_/g, ' ');
            const coefTag = sub._overridden ? h('span', { class: 'p-coef' }, `coef. ${sub.coefficient}`) : null;
            rows.push(h('tr', { class: 'p-sub' },
                h('td', { class: 'p-left' }, subName, ...(coefTag ? [coefTag] : [])),
                h('td', {}),
                h('td', {}, fmt(sub.classAverage)),
                h('td', {}, fmt(sub.average)),
            ));
        }
    }
    rows.push(h('tr', { class: 'p-total' },
        h('td', { class: 'p-left', colspan: '2' }, 'MOYENNE GÉNÉRALE'),
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
                ...(trackCode && year ? [h('div', { class: 'p-info' }, `Cycle ${trackCode} — Année universitaire : ${year}`)] : []),
                ...(semNum ? [h('div', { class: 'p-info' }, `Bulletin du Semestre ${semNum}`)] : []),
                ...(name ? [h('div', { class: 'p-student' }, name)] : []),
            ),
            ...(trackLabel ? [h('div', { class: 'p-header-right' }, trackLabel)] : []),
        ),
        h('table', { class: 'p-table' },
            h('thead', {},
                h('tr', {},
                    h('th', { class: 'p-left p-col-name' }, `Semestre ${semNum}`),
                    h('th', { class: 'p-col-ects' }, 'ECTS ACQUIS'),
                    h('th', { class: 'p-col-avg' }, 'Moyenne', h('br'), 'Promotion'),
                    h('th', { class: 'p-col-avg' }, 'Moyenne', h('br'), 'Étudiant'),
                ),
            ),
            h('tbody', {}, ...rows),
        ),
        h('div', { class: 'p-footer' },
            `Exporté depuis Infinity Auriga v${app.version} — ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        ),
    );
}
