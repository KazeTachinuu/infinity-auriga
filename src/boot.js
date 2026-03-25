import { setApiRequestHook } from './lib/auriga/api.js';
import { loadSession, fetchMarksAndUpdates, saveSemesterFilter, loadCachedMarks } from './lib/session.js';
import { setupToggle } from './lib/toggle.js';
import { app } from './app.js';

/**
 * Shared boot sequence for both dev (main.js) and prod (userscript-entry.js).
 *
 * Both entry points handle their own environment setup (mock tokens, DOM takeover,
 * token interception, etc.) then call this function with a ready container.
 *
 * Flow: setupToggle → loadSession → refresh loop (fetch marks → render)
 *
 * @param {HTMLElement} container - The #app element, already in the DOM
 */
export async function boot(container) {
    setupToggle('infinity');

    const { renderLoadingScreen, renderApp } = await import('./render/index.js');

    try {
        const status = renderLoadingScreen(container, 'Chargement...');
        setApiRequestHook((url) => status.request(url));

        const session = await loadSession(status);
        let { filtersValues } = session;
        const { name, filters } = session;

        async function refresh() {
            const onSemesterChange = (value) => {
                filtersValues = saveSemesterFilter(value);
                refresh();
            };
            try {
                const s = renderLoadingScreen(container);
                setApiRequestHook((url) => s.request(url));
                const data = await fetchMarksAndUpdates(filtersValues, s);
                renderApp(container, {
                    name, filters, filtersValues, ...data, onSemesterChange,
                });
            } catch (err) {
                console.error('[Infinity Auriga]', err);
                // Show cached data with a warning instead of blocking the user
                const cached = loadCachedMarks(filtersValues);
                if (cached) {
                    renderApp(container, {
                        name, filters, filtersValues, ...cached,
                        apiError: err, onSemesterChange,
                    });
                } else {
                    renderError(container, err);
                }
            }
        }

        await refresh();
    } catch (err) {
        console.error('[Infinity Auriga]', err);

        // If the initial load fails but we have cached data, show it with a warning
        const savedFilter = localStorage.getItem('auriga_filters');
        if (savedFilter) {
            const filtersValues = JSON.parse(savedFilter);
            const cached = loadCachedMarks(filtersValues);
            if (cached) {
                renderApp(container, {
                    name: 'Etudiant', filters: [], filtersValues, ...cached,
                    apiError: err,
                    onSemesterChange(value) {
                        localStorage.setItem('auriga_filters', JSON.stringify({ semester: value }));
                        window.location.reload();
                    },
                });
                return;
            }
        }

        renderError(container, err);
    }
}

/**
 * Show a user-facing error screen with context about what went wrong.
 * Provides actionable next steps instead of a blank page.
 */
function renderError(container, err) {
    const message = err?.message || String(err);

    // Detect common failure modes and give specific guidance
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

    container.replaceChildren();
    const panel = document.createElement('div');
    panel.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100dvh;font-family:system-ui;background:#151925;color:#fff;padding:20px;text-align:center;';

    const title = document.createElement('div');
    title.style.cssText = 'font-size:24px;font-weight:700;margin-bottom:16px;color:#e34e4e;';
    title.textContent = 'Oups, quelque chose a cassé';

    const desc = document.createElement('div');
    desc.style.cssText = 'font-size:15px;color:#aaa;max-width:500px;line-height:1.6;margin-bottom:24px;';
    desc.textContent = hint + 'Essayez de recharger la page. Si le problème persiste, signalez-le.';

    const errorBox = document.createElement('pre');
    errorBox.style.cssText = 'background:#1e2233;color:#ff6b6b;padding:16px 24px;border-radius:10px;font-size:12px;max-width:600px;overflow-x:auto;margin-bottom:24px;text-align:left;white-space:pre-wrap;word-break:break-word;';
    errorBox.textContent = message;

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:12px;';

    const reload = document.createElement('button');
    reload.style.cssText = 'padding:10px 24px;border:none;border-radius:10px;background:#fff;color:#151925;font-weight:600;font-size:14px;cursor:pointer;';
    reload.textContent = 'Recharger';
    reload.addEventListener('click', () => window.location.reload());

    const report = document.createElement('a');
    report.href = `${app.repository}/issues/new?title=${encodeURIComponent('Erreur: ' + message.substring(0, 80))}&body=${encodeURIComponent('## Erreur\n```\n' + message + '\n```\n\n## Contexte\n- Version: ' + app.version + '\n- Navigateur: ' + navigator.userAgent + '\n- URL: ' + window.location.href + '\n- Date: ' + new Date().toISOString())}`;
    report.target = '_blank';
    report.style.cssText = 'padding:10px 24px;border:1px solid #444;border-radius:10px;color:#aaa;font-weight:600;font-size:14px;text-decoration:none;cursor:pointer;';
    report.textContent = 'Signaler';

    const resetBtn = document.createElement('button');
    resetBtn.style.cssText = 'padding:10px 24px;border:1px solid #444;border-radius:10px;background:none;color:#888;font-size:14px;cursor:pointer;';
    resetBtn.textContent = 'Reset cache';
    resetBtn.addEventListener('click', () => { localStorage.clear(); window.location.reload(); });

    actions.append(reload, report, resetBtn);
    panel.append(title, desc, errorBox, actions);
    container.appendChild(panel);
}
