/**
 * Main app render — orchestrates all components into the full grade view.
 */

import { app } from '../app.js';
import { h, html, gradeColor, formatGrade, topTriangle, bottomTriangle, LogoSvg } from './dom.js';
import { copyCodeEl } from './tooltip.js';
import { renderComboBox, renderUpdate, renderSubject, renderFooter } from './components.js';
import { renderPrintView } from './print.js';
import { checkForUpdate } from '../version-check.js';

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
        hint = 'Le format du menu Auriga a peut-être changé. ';
    } else if (message.includes('API error') || message.includes('fetch')) {
        hint = 'Le serveur Auriga ne répond pas correctement. ';
    } else if (message.includes('access token') || message.includes('401')) {
        hint = 'Votre session a expiré. ';
    } else if (message.includes('API format changed') || message.includes('parse')) {
        hint = 'Le format des données Auriga a changé. ';
    }

    const desc = hasCachedData
        ? hint + 'Vos notes en cache sont affichées à droite, mais elles peuvent être obsolètes.'
        : hint + 'Essayez de recharger la page. Si le problème persiste, signalez-le.';

    const reportUrl = `${app.repository}/issues/new?title=${encodeURIComponent('Erreur: ' + message.substring(0, 80))}&body=${encodeURIComponent('## Erreur\n```\n' + message + '\n```\n\n## Contexte\n- Version: ' + app.version + '\n- URL: ' + window.location.href + '\n- Date: ' + new Date().toISOString())}`;

    return h('div', { class: 'api-error-panel' },
        h('div', { class: 'api-error-title' }, 'Oups, quelque chose a cassé'),
        h('div', { class: 'api-error-desc' }, desc),
        h('pre', { class: 'api-error-box' }, message),
        h('div', { class: 'api-error-actions' },
            h('button', {
                class: 'api-error-btn primary',
                onclick: () => window.location.reload(),
            }, 'Recharger'),
            h('a', {
                href: reportUrl, target: '_blank', class: 'api-error-btn',
            }, 'Signaler'),
            h('button', {
                class: 'api-error-btn muted',
                onclick: () => { localStorage.clear(); window.location.reload(); },
            }, 'Reset cache'),
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
                btn.textContent = 'Copié !';
                btn.classList.add('coeff-copied');
            });
        }
    }, 'Copier les codes');
    return btn;
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
        { label: 'Etudiant', value: averages.student, colored: true },
        { label: 'Promotion', value: averages.promo, colored: false },
    ];

    const moduleEls = marks.flatMap(mod => {
        const modOverriddenEl = mod._overridden
            ? h('span', { class: 'coeff-badge ects' }, `${mod.coefficient} ECTS`)
            : null;
        return [
        h('div', { class: 'header module' },
            h('div', { class: 'text' },
                h('div', { class: 'name' }, copyCodeEl(mod._code, mod.name)),
                h('div', { class: 'point' }),
                h('div', { class: 'bottom' },
                    h('span', { class: 'average', style: { color: gradeColor(mod.average) } }, formatGrade(mod.average)),
                    h('span', { class: 'max' }, '\u00a0/ 20'),
                    ...(mod.classAverage != null ? [h('span', { class: 'class-average' }, `(promo: ${formatGrade(mod.classAverage)})`)] : []),
                    ...(modOverriddenEl ? [modOverriddenEl] : [])
                )
            ),
            h('hr', { class: 'bottom-line' })
        ),
        ...mod.subjects.map(s => renderSubject(s, mod.id))
    ];});

    // Right side: content panel
    container.appendChild(h('div', { id: 'content', class: 'variable wide' },
        h('div', { id: 'header' },
            html('div', { id: 'logo', class: 'variable' }, LogoSvg),
            ...(name ? [h('div', { class: 'header-actions' },
                h('a', { id: 'update-btn', style: { display: 'none' } }),
                h('a', { id: 'export-btn', href: '#', onclick: (e) => { e.preventDefault(); window.print(); } },
                    html('span', { class: 'export-icon' }, ExportSvg), 'PDF'),
                h('a', { id: 'logout', href: '#', onclick: (e) => {
                    e.preventDefault();
                    window.location.href = 'https://ionisepita-auth.np-auriga.nfrance.net/auth/realms/npionisepita/protocol/openid-connect/logout?post_logout_redirect_uri=' + encodeURIComponent('https://auriga.epita.fr');
                } }, 'Se deconnecter'),
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
                    h('div', { class: 'header' }, 'Derniers changements', h('hr')),
                    ...(visibleUpdates.length === 0
                        ? [h('div', { class: 'no-updates' }, 'Aucun changement depuis votre derniere visite.')]
                        : []),
                    h('div', { class: 'updates' }, ...visibleUpdates.map(renderUpdate)),
                    h('div', { class: 'header' }, 'Moyennes', h('hr')),
                    h('div', { class: 'big-list' }, ...avgEntries.map(e =>
                        h('div', { class: 'entry' },
                            h('div', { class: 'point' }),
                            h('div', { class: 'name' }, e.label),
                            h('div', { class: 'point small' }),
                            h('div', { class: 'mark' },
                                h('span', { class: 'value', style: { color: e.colored ? gradeColor(e.value) : 'auto' } }, formatGrade(e.value)),
                                '\u00a0/ 20'
                            )
                        )
                    )),
                ] : []),
                // Grade content or empty state
                ...(!hasCachedData && apiError
                    ? [h('div', { class: 'empty-state' },
                        h('div', { class: 'empty-state-text' }, 'Aucune note en cache'),
                        h('div', { class: 'empty-state-hint' }, 'Les notes seront disponibles ici une fois la connexion rétablie.')
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
                                        ? h('span', {}, 'Coefficients corrigés par la communauté')
                                        : h('span', {}, 'Coefficients non corrigés ', h('span', { class: 'coeff-muted' }, '(Auriga les considère tous égaux)'))
                                )
                            ),
                            h('div', { class: 'coeff-links' },
                                ...(coeffSource
                                    ? [
                                        h('a', { href: import.meta.env.DEV
                                            ? `/coefficients/${coeffSource}`
                                            : `${app.repository}/blob/master/coefficients/${coeffSource}`,
                                            target: '_blank', class: 'link colored' }, 'Voir la source'),
                                        ...(coeffTemplate ? ['\u00a0\u00b7\u00a0', createCopyTemplateBtn(coeffTemplate)] : []),
                                    ]
                                    : [
                                        ...(coeffTemplate ? [createCopyTemplateBtn(coeffTemplate), '\u00a0\u00b7\u00a0'] : []),
                                        h('a', { href: `${app.repository}/tree/master/coefficients`, target: '_blank', class: 'link colored' }, 'Contribuer'),
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

    // Dedicated print view — hidden on screen, shown only in @media print
    if (hasCachedData) {
        container.appendChild(renderPrintView(marks, averages, coeffMeta, name));
        // Set page title for PDF filename (browsers use document.title as default save name)
        const parts = ['Bulletin'];
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
