/**
 * Reusable UI components: combo box, updates, subjects, footer.
 */

import { app } from '../app.js';
import { h, html, gradeColor, formatGrade, gradeSpan, signSvg, hasEqualCoefficients } from './dom.js';
import { ComboBoxArrowSvg, UpdateArrowSvg } from './dom.js';
import { copyCodeEl } from './tooltip.js';

// --- ComboBox (semester selector) -----------------------------------------------

export function renderComboBox(name, values, currentValue, onUpdate) {
    const wrapper = h('div', { class: 'combo-box' });
    const selected = (values.find(v => v.value === currentValue) || { name: '...' }).name;

    const box = h('div', { class: 'box clickable' });
    const setBoxContent = (text) => {
        box.textContent = '';
        box.append(text + ' ');
        const arrow = html('span', {}, ComboBoxArrowSvg);
        box.appendChild(arrow.firstElementChild || arrow);
    };
    setBoxContent(selected);

    let opened = false;
    let choicesEl = null;

    const close = () => {
        opened = false;
        box.classList.remove('opened');
        choicesEl?.remove();
        choicesEl = null;
    };

    box.addEventListener('click', () => {
        if (opened) return close();
        opened = true;
        box.classList.add('opened');
        choicesEl = h('div', { class: 'choices card' },
            ...values.map(choice =>
                h('div', {
                    class: 'choice clickable opaque',
                    onclick: () => { close(); setBoxContent(choice.name); onUpdate(choice); }
                }, choice.name)
            )
        );
        wrapper.appendChild(choicesEl);
    });

    document.addEventListener('click', (e) => {
        if (opened && !wrapper.contains(e.target)) close();
    });

    wrapper.append(h('span', { class: 'name' }, name), box);
    return wrapper;
}

// --- Update entry (grade change notification) -----------------------------------

export function renderUpdate(upd) {
    const hasValue = upd.value === 0 || upd.value;
    const hasOld = upd.old === 0 || upd.old;
    const displayValue = hasValue ? upd.value : upd.old;
    const targetLabel = upd.type.includes('average') ? 'moyenne' : 'note';
    const sign = signSvg(upd.type, upd.value, upd.old);

    return h('div', { class: 'update' },
        h('div', { class: 'point big' }),
        h('div', { class: 'top' },
            h('div', { class: 'id' }, upd.subject),
            h('div', { class: 'dash' }, '-'),
            h('div', { class: 'name' }, upd.name + '\u00a0', html('span', { class: 'target' }, `\u00b7\u00a0 ${targetLabel}`))
        ),
        h('div', { class: 'mark' },
            h('div', { class: 'point' }),
            ...(hasValue && hasOld ? [h('div', { class: 'from' }, formatGrade(upd.old)), html('div', { class: 'update-arrow' }, UpdateArrowSvg)] : []),
            h('div', { class: 'to' }, gradeSpan(displayValue), '\u00a0/ 20'),
            ...(sign ? [html('div', { class: 'type-sign' }, sign)] : [])
        )
    );
}

// --- Subject card (one subject with its marks) ----------------------------------

export function renderSubject(subject, moduleId) {
    // Left side: strip module prefix from code (e.g. "CN_PROD" under module "CN" → "PROD")
    const shortId = subject.id.startsWith(moduleId + '_') ? subject.id.slice(moduleId.length + 1) : subject.id;
    const rawCode = shortId.replace(/_/g, ' ');
    // Full resolved name
    const fullName = subject.name !== subject.id.replace(/_/g, ' ') ? subject.name : null;
    // For very short cryptic codes (2-3 letter abbreviations), prefer the full name — but only if it fits
    const useNameAsLabel = fullName && rawCode.length < 5 && fullName.length <= 16;
    const codeLabel = useNameAsLabel ? fullName : rawCode;

    const metaParts = [];
    if (subject.classAverage != null) metaParts.push(`promo: ${formatGrade(subject.classAverage)}`);
    if (!subject._overridden && subject.coefficient != null && subject.coefficient !== 1) metaParts.push(`coeff. ${formatGrade(subject.coefficient)}`);

    const bottomChildren = [h('div', { class: 'average' }, gradeSpan(subject.average), '\u00a0/ 20')];
    if (metaParts.length || subject._overridden) {
        const metaChildren = [];
        if (metaParts.length) metaChildren.push(`(${metaParts.join(', ')})`);
        if (subject._overridden) metaChildren.push(h('span', { class: 'coeff-badge coef' }, `coef. ${subject.coefficient}`));
        bottomChildren.push(h('div', { class: 'class-average' }, ...metaChildren));
    }

    const info = h('div', { class: 'info' },
        h('div', { class: 'top' }, h('div', { class: 'id' }, copyCodeEl(subject._code, codeLabel))),
        h('div', { class: 'bottom' }, ...bottomChildren),
        h('hr', { class: 'bottom-line' })
    );

    // Right side: marks panel, with group headers when marks share a course name
    function renderMark(mark) {
        const meta = [];
        if (mark.classAverage != null) meta.push(`moyenne: ${formatGrade(mark.classAverage)}`);
        if (!hasEqualCoefficients(subject) && !mark._overridden) meta.push(`${Math.round(mark.coefficient * 100)}%`);
        const hasOverride = mark._overridden && mark._rawCoefficient != null;

        // Strip subject/group name prefix from mark name to avoid redundancy
        let markName = mark.name;
        const prefix = mark._group || fullName;
        if (prefix) {
            if (markName.startsWith(prefix + ' - ')) markName = markName.slice(prefix.length + 3);
            else if (markName.startsWith(prefix + ' ')) markName = markName.slice(prefix.length + 1);
        }

        const markChildren = [
            h('div', { class: 'point' }),
            h('div', { class: 'line' },
                h('div', { class: 'name' }, copyCodeEl(mark._code, markName)),
                '\u00a0:\u00a0',
                h('div', { class: 'value' }, h('span', { class: 'itself', style: { color: gradeColor(mark.value) } }, formatGrade(mark.value)), '\u00a0/ 20')
            ),
        ];

        if (meta.length || hasOverride) {
            const metaChildren = [];
            if (meta.length) metaChildren.push(h('span', { class: 'parenthesis' }, '('), meta.join(', '), h('span', { class: 'parenthesis' }, ')'));
            if (hasOverride) metaChildren.push(h('span', { class: 'coeff-badge coef' }, `coef. ${mark._rawCoefficient}`));
            markChildren.push(h('div', { class: 'class-average' }, ...metaChildren));
        }

        return h('div', { class: 'mark' }, ...markChildren);
    }

    // Build marks list, inserting group headers when _group changes
    const marksContent = [];
    let lastGroup = null;
    for (const mark of subject.marks) {
        if (mark._group && mark._group !== lastGroup) {
            marksContent.push(h('div', { class: 'marks-title' }, mark._group));
            lastGroup = mark._group;
        }
        marksContent.push(renderMark(mark));
    }

    const marksEl = subject.marks.length === 0
        ? h('div', { class: 'no-marks' }, 'Aucune note')
        : h('div', { class: 'marks' },
            ...(fullName && !useNameAsLabel && !lastGroup ? [h('div', { class: 'marks-title' }, fullName)] : []),
            ...marksContent
        );

    return h('div', { class: 'subject card' }, info, marksEl);
}

// --- Footer ---------------------------------------------------------------------

export function renderFooter() {
    const resetLink = h('a', { href: '#', onclick: (e) => { e.preventDefault(); localStorage.clear(); window.location.reload(); } }, 'Reset');
    const exportBtn = h('a', { href: '#', onclick: (e) => { e.preventDefault(); window.print(); } }, 'Exporter PDF');
    return h('div', { id: 'footer' },
        h('div', { id: 'links' },
            exportBtn,
            '\u00a0\u00b7\u00a0',
            h('a', { href: `${app.repository}/tree/master/coefficients`, target: '_blank' }, 'Coefficients'),
            '\u00a0\u00b7\u00a0',
            h('a', { href: app.repository, target: '_blank' }, 'Sources'),
            '\u00a0\u00b7\u00a0',
            resetLink
        ),
        h('p', { class: 'subtext' },
            h('span', {}, `${app.name} v${app.version} \u00a9 ${new Date().getFullYear()} KazeTachinuu`),
            h('br'),
            h('span', {}, 'Licensed under '),
            h('a', { class: 'link colored', href: `${app.repository}/blob/master/LICENSE`, target: '_blank' }, 'MIT License')
        )
    );
}
