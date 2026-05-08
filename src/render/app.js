/**
 * Main app render — orchestrates all components into the full grade view.
 */

import { app } from '../app.js';
import { h, html, gradeColor, formatGrade, topTriangle, bottomTriangle, LogoSvg } from './dom.js';
import { copyCodeEl } from './tooltip.js';
import { renderComboBox, renderUpdate, renderSubject, renderFooter } from './components.js';
import { renderPrintView } from './print.js';
import { checkForUpdate } from '../version-check.js';
import { t, tFor, getLang, setLang, availableLangs } from '../i18n.js';

const ExportSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg>';
const UpdateSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>';

/**
 * Build the error panel shown in the #background sidebar when the API fails.
 * Adapts its message depending on whether cached grades are available.
 */
function createApiErrorPanel(error, hasCachedData) {
    const message = error?.message || String(error);

    let hint = '';
    if (message.includes('Menu entries not found') || message.includes('menu')) {
        hint = t('errors.menuChanged');
    } else if (message.includes('API error') || message.includes('fetch')) {
        hint = t('errors.apiDown');
    } else if (message.includes('access token') || message.includes('401')) {
        hint = t('errors.sessionExpired');
    } else if (message.includes('API format changed') || message.includes('parse')) {
        hint = t('errors.formatChanged');
    }

    const desc = hasCachedData
        ? hint + t('errors.cachedSuffix')
        : hint + t('errors.retrySuffix');

    const reportUrl = `${app.repository}/issues/new?title=${encodeURIComponent(t('errors.issueTitlePrefix') + message.substring(0, 80))}&body=${encodeURIComponent(t('errors.issueBodyError') + '\n```\n' + message + '\n```\n\n' + t('errors.issueBodyContext') + '\n- Version: ' + app.version + '\n- URL: ' + window.location.href + '\n- Date: ' + new Date().toISOString())}`;

    return h('div', { class: 'api-error-panel' },
        h('div', { class: 'api-error-title' }, t('errors.title')),
        h('div', { class: 'api-error-desc' }, desc),
        h('pre', { class: 'api-error-box' }, message),
        h('div', { class: 'api-error-actions' },
            h('button', {
                class: 'api-error-btn primary',
                onclick: () => window.location.reload(),
            }, t('errors.reload')),
            h('a', {
                href: reportUrl, target: '_blank', class: 'api-error-btn',
            }, t('errors.report')),
            h('button', {
                class: 'api-error-btn muted',
                onclick: () => { localStorage.clear(); window.location.reload(); },
            }, t('errors.resetCache')),
        )
    );
}

/**
 * Copy coefficient template to clipboard.
 */
function createCopyTemplateBtn({ content }) {
    const btn = h('a', {
        href: '#', class: 'link colored',
        onclick: (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(content).then(() => {
                btn.textContent = t('coeff.copied');
                btn.classList.add('coeff-copied');
            });
        }
    }, t('coeff.copyCodes'));
    return btn;
}

/**
 * Compact FR | EN segmented toggle. setLang triggers all subscribers,
 * which includes boot.js's re-render of the whole app.
 */
function renderLangToggle() {
    const current = getLang();
    return h('div', { class: 'lang-toggle', role: 'group', 'aria-label': 'Language' },
        ...availableLangs().map(code =>
            h('button', {
                class: 'lang-btn' + (code === current ? ' active' : ''),
                onclick: () => setLang(code),
                'aria-pressed': code === current ? 'true' : 'false',
            }, code.toUpperCase())
        )
    );
}

export function renderApp(container, { name, marks, averages, filters, filtersValues, updates, coeffSource, coeffMeta, coeffTemplate, apiError, onSemesterChange }) {
    container.replaceChildren();

    const hasCachedData = marks.length > 0;

    // Left side: error panel or decorative background
    container.appendChild(
        apiError
            ? h('div', { id: 'background' }, createApiErrorPanel(apiError, hasCachedData))
            : h('div', { id: 'background' },
                html('div', { id: 'top-triangle', class: 'triangle' }, topTriangle),
                html('div', { id: 'bottom-triangle', class: 'triangle' }, bottomTriangle)
            )
    );

    const visibleUpdates = updates.filter(u => u.type !== 'average-update');

    const avgEntries = [
        { label: t('loading.student'), value: averages.student, colored: true },
        { label: t('sidebar.promotion'), value: averages.promo, colored: false },
    ];

    const moduleEls = marks.flatMap(mod => {
        const modOverriddenEl = mod._overridden
            ? h('span', { class: 'coeff-badge ects' }, t('badges.ects', mod.coefficient))
            : null;
        const modName = getLang() === 'en' ? (mod.nameEn || mod.name) : mod.name;
        return [
        h('div', { class: 'header module' },
            h('div', { class: 'text' },
                h('div', { class: 'name' }, copyCodeEl(mod._code, modName)),
                h('div', { class: 'point' }),
                h('div', { class: 'bottom' },
                    h('span', { class: 'average', style: { color: gradeColor(mod.average) } }, formatGrade(mod.average)),
                    h('span', { class: 'max' }, ' / 20'),
                    ...(mod.classAverage != null ? [h('span', { class: 'class-average' }, `(${t('badges.promoMeta', formatGrade(mod.classAverage))})`)] : []),
                    ...(modOverriddenEl ? [modOverriddenEl] : [])
                )
            ),
            h('hr', { class: 'bottom-line' })
        ),
        ...mod.subjects.map(s => renderSubject(s, mod.id))
    ];});

    // Swap the rendered print view + filename for the requested language, then print.
    // Browsers use document.title as the default "Save as PDF" filename.
    const printAs = (lang) => {
        if (!hasCachedData) { window.print(); return; }
        const existing = document.getElementById('print-view');
        if (existing) existing.remove();
        container.appendChild(renderPrintView(marks, averages, coeffMeta, name, lang));
        const parts = [tFor(lang, 'print.filenameBase')];
        if (coeffMeta?.semester) parts.push(coeffMeta.semester);
        if (name) parts.push(name);
        document.title = parts.join(' — ');
        window.print();
    };

    // Right side: content panel
    container.appendChild(h('div', { id: 'content', class: 'variable wide' },
        h('div', { id: 'header' },
            html('div', { id: 'logo', class: 'variable' }, LogoSvg),
            ...(name ? [h('div', { class: 'header-actions' },
                renderLangToggle(),
                h('a', { id: 'update-btn', style: { display: 'none' } }),
                h('a', { id: 'export-btn', href: '#', onclick: (e) => { e.preventDefault(); printAs('fr'); } },
                    html('span', { class: 'export-icon' }, ExportSvg), t('header.exportFr')),
                h('a', { id: 'export-btn-en', href: '#', onclick: (e) => { e.preventDefault(); printAs('en'); } },
                    html('span', { class: 'export-icon' }, ExportSvg), t('header.exportEn')),
                h('a', { id: 'logout', href: '#', onclick: (e) => {
                    e.preventDefault();
                    window.location.href = 'https://ionisepita-auth.np-auriga.nfrance.net/auth/realms/npionisepita/protocol/openid-connect/logout?post_logout_redirect_uri=' + encodeURIComponent('https://auriga.epita.fr');
                } }, t('header.logout')),
            )] : [])
        ),
        h('div', { id: 'main' },
            h('div', { class: 'content' },
                // Sidebar content (filters, updates, averages) — hidden when error is shown in sidebar
                ...(!apiError ? [
                    h('div', { class: 'filters' },
                        ...filters.map(f => renderComboBox(f.name, f.values, filtersValues[f.id], (choice) => {
                            if (f.id === 'semester') onSemesterChange(choice.value);
                        }))
                    ),
                    h('div', { class: 'header' }, t('sidebar.changes'), h('hr')),
                    ...(visibleUpdates.length === 0
                        ? [h('div', { class: 'no-updates' }, t('sidebar.noChanges'))]
                        : []),
                    h('div', { class: 'updates' }, ...visibleUpdates.map(renderUpdate)),
                    h('div', { class: 'header' }, t('sidebar.averages'), h('hr')),
                    h('div', { class: 'big-list' }, ...avgEntries.map(e =>
                        h('div', { class: 'entry' },
                            h('div', { class: 'point' }),
                            h('div', { class: 'name' }, e.label),
                            h('div', { class: 'point small' }),
                            h('div', { class: 'mark' },
                                h('span', { class: 'value', style: { color: e.colored ? gradeColor(e.value) : 'auto' } }, formatGrade(e.value)),
                                ' / 20'
                            )
                        )
                    )),
                ] : []),
                // Grade content or empty state
                ...(!hasCachedData && apiError
                    ? [h('div', { class: 'empty-state' },
                        h('div', { class: 'empty-state-text' }, t('errors.noCachedTitle')),
                        h('div', { class: 'empty-state-hint' }, t('empty.hint'))
                    )]
                    : [
                        ...(coeffMeta ? [
                            h('div', { class: 'header' },
                                h('div', { class: 'track-info' },
                                    h('span', { class: 'track-info-name' }, coeffMeta.name || [coeffMeta.track, coeffMeta.major].filter(Boolean).join(' ')),
                                    h('span', { class: 'track-info-detail' }, `${coeffMeta.track} ${coeffMeta.semester} — 20${coeffMeta.year.slice(0, 2)}/20${coeffMeta.year.slice(2)}`),
                                ),
                                h('hr'),
                            ),
                        ] : []),
                        h('div', { class: 'coeff-info' },
                            h('div', { class: 'coeff-main' },
                                h('div', { class: 'point' }),
                                h('div', { class: 'coeff-content' },
                                    coeffSource
                                        ? h('span', {}, t('coeff.corrected'))
                                        : h('span', {}, t('coeff.uncorrected'), h('span', { class: 'coeff-muted' }, t('coeff.uncorrectedHint')))
                                )
                            ),
                            h('div', { class: 'coeff-links' },
                                ...(coeffSource
                                    ? [
                                        h('a', { href: import.meta.env.DEV
                                            ? `/coefficients/${coeffSource}`
                                            : `${app.repository}/blob/master/coefficients/${coeffSource}`,
                                            target: '_blank', class: 'link colored' }, t('coeff.viewSource')),
                                        ...(coeffTemplate ? [' · ', createCopyTemplateBtn(coeffTemplate)] : []),
                                    ]
                                    : [
                                        ...(coeffTemplate ? [createCopyTemplateBtn(coeffTemplate), ' · '] : []),
                                        h('a', { href: `${app.repository}/tree/master/coefficients`, target: '_blank', class: 'link colored' }, t('coeff2.contribute')),
                                    ]
                                )
                            )
                        ),
                        h('hr', { class: 'separator' }),
                        ...moduleEls,
                    ]
                )
            )
        ),
        renderFooter()
    ));

    // Dedicated print view — hidden on screen, shown only in @media print.
    // Rendered with the current global lang; printAs() re-renders it on demand.
    if (hasCachedData) {
        container.appendChild(renderPrintView(marks, averages, coeffMeta, name));
        const parts = [t('print.filenameBase')];
        if (coeffMeta?.semester) parts.push(coeffMeta.semester);
        if (name) parts.push(name);
        document.title = parts.join(' — ');
    }

    // Check for updates (non-blocking)
    checkForUpdate().then(({ available, version, url }) => {
        if (!available) return;
        const btn = document.getElementById('update-btn');
        if (!btn) return;
        btn.href = url;
        btn.target = '_blank';
        btn.append(html('span', { class: 'update-icon' }, UpdateSvg), 'v' + version);
        btn.style.display = '';
    });
}
