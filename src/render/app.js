/**
 * Main app render — orchestrates all components into the full grade view.
 */

import { app } from '../app.js';
import { h, html, gradeColor, formatGrade, gradeSpan, topTriangle, bottomTriangle, LogoSvg } from './dom.js';
import { copyCodeEl } from './tooltip.js';
import { renderComboBox, renderUpdate, renderSubject, renderFooter } from './components.js';

/**
 * Build a dismissable warning banner shown when the API failed but cached data is available.
 */
function createApiBanner(error, onRetry, filtersValues) {
    const banner = h('div', { class: 'api-banner' },
        h('div', { class: 'api-banner-text' },
            h('span', { class: 'api-banner-title' }, 'Hors-ligne'),
            h('span', { class: 'api-banner-detail' }, ' \u2014 impossible de contacter Auriga. Vos notes peuvent \u00eatre obsol\u00e8tes.')
        ),
        h('div', { class: 'api-banner-actions' },
            h('a', {
                href: '#', class: 'api-banner-btn',
                onclick: (e) => { e.preventDefault(); onRetry(filtersValues.semester); }
            }, 'R\u00e9essayer'),
            h('a', {
                href: '#', class: 'api-banner-dismiss',
                onclick: (e) => { e.preventDefault(); banner.remove(); }
            }, '\u2715')
        )
    );
    return banner;
}

/**
 * Build a one-click "contribute" link that opens GitHub's new-file page
 * with the filename and template content pre-filled.
 * Falls back to clipboard + redirect when the URL would be too long.
 */
function createContributeLink({ filename, content }) {
    const basePath = `${app.repository}/new/master/src/lib/coefficients`;
    const encoded = encodeURIComponent(content);
    const fullUrl = `${basePath}?filename=${encodeURIComponent(filename)}&value=${encoded}`;

    // GitHub URLs have practical limits (~8k). If the template fits, use a direct link.
    if (fullUrl.length <= 8000) {
        return h('a', { href: fullUrl, target: '_blank', class: 'link colored' },
            `Créer ${filename} sur GitHub`
        );
    }

    // For larger templates: copy to clipboard, then open the new-file page with just the filename
    const link = h('a', {
        href: '#',
        class: 'link colored',
        onclick: (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(content).then(() => {
                link.textContent = 'Copié ! Collez dans l\u2019éditeur GitHub\u2026';
                link.classList.add('coeff-copied');
                window.open(`${basePath}?filename=${encodeURIComponent(filename)}`, '_blank');
            });
        }
    }, `Créer ${filename} sur GitHub`);
    return link;
}

export function renderApp(container, { name, marks, averages, filters, filtersValues, updates, coeffSource, coeffTemplate, apiError, onSemesterChange }) {
    container.replaceChildren();

    // Background
    container.appendChild(h('div', { id: 'background' },
        html('div', { id: 'top-triangle', class: 'triangle' }, topTriangle),
        html('div', { id: 'bottom-triangle', class: 'triangle' }, bottomTriangle)
    ));

    const visibleUpdates = updates.filter(u => u.type !== 'average-update');

    const avgEntries = [
        { label: 'Etudiant', value: averages.student, colored: true },
        { label: 'Promotion', value: averages.promo, colored: false },
    ];

    const moduleEls = marks.flatMap(mod => {
        const modOverriddenEl = mod._overridden
            ? h('span', { class: 'coeff-override' }, `\u00d7${mod.coefficient}`)
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

    container.appendChild(h('div', { id: 'content', class: 'variable wide' },
        h('div', { id: 'header' },
            html('div', { id: 'logo', class: 'variable' }, LogoSvg),
            ...(name ? [h('a', { id: 'logout', href: '#', onclick: (e) => {
                e.preventDefault();
                // Redirect to Keycloak logout — ends the SSO session and redirects back to Auriga
                window.location.href = 'https://ionisepita-auth.np-auriga.nfrance.net/auth/realms/npionisepita/protocol/openid-connect/logout?post_logout_redirect_uri=' + encodeURIComponent('https://auriga.epita.fr');
            } }, 'Se deconnecter')] : [])
        ),
        h('div', { id: 'main' },
            h('div', { class: 'content' },
                ...(apiError ? [createApiBanner(apiError, onSemesterChange, filtersValues)] : []),
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
                                h('a', { href: `${app.repository}/blob/master/src/lib/coefficients/${coeffSource}`, target: '_blank', class: 'link colored' }, 'Voir la source'),
                                '\u00a0\u00b7\u00a0',
                                h('a', { href: `${app.repository}/tree/master/src/lib/coefficients`, target: '_blank', class: 'link colored' }, 'Modifier'),
                            ]
                            : coeffTemplate
                                ? [createContributeLink(coeffTemplate)]
                                : [
                                    h('a', { href: `${app.repository}/tree/master/src/lib/coefficients`, target: '_blank', class: 'link colored' }, 'Contribuer les vrais coefficients'),
                                ]
                        )
                    )
                ),
                h('hr', { class: 'separator' }),
                ...moduleEls
            )
        ),
        renderFooter()
    ));
}
