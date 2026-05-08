/**
 * Lightweight i18n — single source of truth for all translatable strings.
 *
 * Usage:
 *   import { t, setLang, onLangChange } from './i18n.js';
 *   t('header.logout')                  → 'Se deconnecter' / 'Log out'
 *   t('badges.coef', 2)                 → 'coef. 2' / 'coef. 2'
 *   t('print.cycleYear', 'FISA CS', '2025/2026')
 *
 * Course / module names come from Auriga's own caption.{fr,en}, surfaced as
 * `mod.name` and `mod.nameEn` by schema.js — pick the right one based on `getLang()`.
 */

const dict = {
    fr: {
        header: {
            logout: 'Se deconnecter',
            exportPdf: 'Exporter PDF',
        },
        sidebar: {
            changes: 'Derniers changements',
            noChanges: 'Aucun changement depuis votre derniere visite.',
            averages: 'Moyennes',
            promotion: 'Promotion',
        },
        filters: {
            semester: 'Semestre',
            semesterValue: (n, y1, y2) => `Semestre ${n} - ${y1}/${y2}`,
        },
        badges: {
            coef: n => `coef. ${n}`,
            ects: n => `${n} ECTS`,
            promoMeta: g => `promo: ${g}`,
            coeffMeta: g => `coeff. ${g}`,
            avgMeta: g => `moyenne: ${g}`,
        },
        update: {
            average: 'moyenne',
            mark: 'note',
        },
        marks: {
            none: 'Aucune note',
        },
        coeff: {
            corrected: 'Coefficients corrigés par la communauté',
            uncorrected: 'Coefficients non corrigés ',
            uncorrectedHint: '(Auriga les considère tous égaux)',
            viewSource: 'Voir la source',
            copyCodes: 'Copier les codes',
            copied: 'Copié !',
        },
        empty: {
            hint: 'Les notes seront disponibles ici une fois la connexion rétablie.',
        },
        errors: {
            title: 'Oups, quelque chose a cassé',
            menuChanged: 'Le format du menu Auriga a peut-être changé. ',
            apiDown:    'Le serveur Auriga ne répond pas correctement. ',
            sessionExpired: 'Votre session a expiré. ',
            formatChanged: 'Le format des données Auriga a changé. ',
            cachedSuffix: 'Vos notes en cache sont affichées à droite, mais elles peuvent être obsolètes.',
            retrySuffix:  'Essayez de recharger la page. Si le problème persiste, signalez-le.',
            reload: 'Recharger',
            report: 'Signaler',
            resetCache: 'Reset cache',
            noCachedTitle: 'Aucune note en cache',
            issueTitlePrefix: 'Erreur: ',
            issueBodyError: '## Erreur',
            issueBodyContext: '## Contexte',
        },
        coeff2: { contribute: 'Contribuer' },
        footer: {
            exportPdf: 'Exporter PDF',
            coefficients: 'Coefficients',
            sources: 'Sources',
            reset: 'Reset',
            licensed: 'Licensed under ',
        },
        loading: {
            initial: 'Chargement...',
            student: 'Etudiant',
            profile: 'Récupération du profil...',
            filters: 'Récupération des filtres...',
            grades: 'Récupération des notes...',
            coefficients: 'Application des coefficients...',
            changes: 'Calcul des changements...',
            quotes: [
                'Auriga va moins vite que votre grand-mère...',
                'On négocie avec le serveur...',
                'Pendant ce temps, les profs corrigent vos copies...',
                'Chargement plus rapide qu\'un rendu de projet EPITA...',
                'Patience, même Auriga a besoin de café le matin...',
                'Calcul de votre moyenne... priez.',
                'On hack le système pour vous (légalement)...',
                'Les notes arrivent... comme les bus, par paquets.',
                'Optimisation en cours... contrairement à votre code.',
                'Bientôt prêt, promis (pas comme vos deadlines).',
            ],
        },
        print: {
            cycleYear: (track, year) => `Cycle ${track} — Année universitaire : ${year}`,
            bulletin: semNum => `Bulletin du Semestre ${semNum}`,
            colSemester: semNum => `Semestre ${semNum}`,
            colEcts: 'ECTS ACQUIS',
            colAvgPromoL1: 'Moyenne',
            colAvgPromoL2: 'Promotion',
            colAvgStudentL1: 'Moyenne',
            colAvgStudentL2: 'Étudiant',
            overallAvg: 'MOYENNE GÉNÉRALE',
            footer: version => `Exporté depuis Infinity Auriga v${version} — ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
            filenameBase: 'Bulletin',
        },
    },
    en: {
        header: {
            logout: 'Log out',
            exportPdf: 'Export PDF',
        },
        sidebar: {
            changes: 'Recent changes',
            noChanges: 'No changes since your last visit.',
            averages: 'Averages',
            promotion: 'Class',
        },
        filters: {
            semester: 'Semester',
            semesterValue: (n, y1, y2) => `Semester ${n} - ${y1}/${y2}`,
        },
        badges: {
            coef: n => `coef. ${n}`,
            ects: n => `${n} ECTS`,
            promoMeta: g => `class: ${g}`,
            coeffMeta: g => `coeff. ${g}`,
            avgMeta: g => `avg: ${g}`,
        },
        update: {
            average: 'average',
            mark: 'mark',
        },
        marks: {
            none: 'No marks yet',
        },
        coeff: {
            corrected: 'Coefficients fixed by the community',
            uncorrected: 'Uncorrected coefficients ',
            uncorrectedHint: '(Auriga treats them all as equal)',
            viewSource: 'View source',
            copyCodes: 'Copy codes',
            copied: 'Copied!',
        },
        empty: {
            hint: 'Grades will appear here once the connection is restored.',
        },
        errors: {
            title: 'Oops, something broke',
            menuChanged: 'Auriga\'s menu format may have changed. ',
            apiDown:    'The Auriga server is not responding correctly. ',
            sessionExpired: 'Your session has expired. ',
            formatChanged: 'Auriga\'s data format has changed. ',
            cachedSuffix: 'Your cached grades are shown on the right, but they may be out of date.',
            retrySuffix:  'Try reloading the page. If the issue persists, please report it.',
            reload: 'Reload',
            report: 'Report',
            resetCache: 'Reset cache',
            noCachedTitle: 'No cached grades',
            issueTitlePrefix: 'Error: ',
            issueBodyError: '## Error',
            issueBodyContext: '## Context',
        },
        coeff2: { contribute: 'Contribute' },
        footer: {
            exportPdf: 'Export PDF',
            coefficients: 'Coefficients',
            sources: 'Sources',
            reset: 'Reset',
            licensed: 'Licensed under ',
        },
        loading: {
            initial: 'Loading...',
            student: 'Student',
            profile: 'Fetching profile...',
            filters: 'Fetching filters...',
            grades: 'Fetching grades...',
            coefficients: 'Applying coefficients...',
            changes: 'Computing changes...',
            quotes: [
                'Auriga\'s slower than your grandma...',
                'Negotiating with the server...',
                'Meanwhile, profs are grading your papers...',
                'Loading faster than an EPITA project submission...',
                'Patience, even Auriga needs morning coffee...',
                'Computing your average... pray.',
                'Hacking the system for you (legally)...',
                'Grades arrive... like buses, in batches.',
                'Optimization in progress... unlike your code.',
                'Almost ready, promise (not like your deadlines).',
            ],
        },
        print: {
            cycleYear: (track, year) => `Cycle ${track} — Academic Year: ${year}`,
            bulletin: semNum => `Semester ${semNum} Report Card`,
            colSemester: semNum => `Semester ${semNum}`,
            colEcts: 'ECTS CREDITS EARNED',
            colAvgPromoL1: 'Average',
            colAvgPromoL2: 'Promotion',
            colAvgStudentL1: 'Student',
            colAvgStudentL2: 'Average',
            overallAvg: 'OVERALL AVERAGE',
            footer: version => `Exported from Infinity Auriga v${version} — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`,
            filenameBase: 'Report Card',
        },
    },
};

const STORAGE_KEY = 'auriga-lang';

// Guard browser-only globals so this module can be imported under Node (vitest, SSR).
const hasLocalStorage = typeof localStorage !== 'undefined';
const hasNavigator = typeof navigator !== 'undefined';
const hasDocument = typeof document !== 'undefined';

const DEFAULT_LANG = (() => {
    if (hasLocalStorage) {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored && dict[stored]) return stored;
        } catch {}
    }
    if (hasNavigator && navigator.language?.toLowerCase().startsWith('fr')) return 'fr';
    return 'en';
})();

let currentLang = DEFAULT_LANG;
const subscribers = new Set();

/** Resolve a dotted key against an explicit language; falls back to the key on miss. */
export function tFor(lang, key, ...args) {
    const root = dict[lang] || dict[currentLang];
    const node = key.split('.').reduce((o, k) => (o == null ? o : o[k]), root);
    if (node == null) return key;
    return typeof node === 'function' ? node(...args) : node;
}

/** Resolve a dotted key against the current language; falls back to the key on miss. */
export function t(key, ...args) {
    return tFor(currentLang, key, ...args);
}

/** Same as t, but returns the raw value (for arrays like loading.quotes). */
export function tRaw(key) {
    return key.split('.').reduce((o, k) => (o == null ? o : o[k]), dict[currentLang]);
}

export const getLang = () => currentLang;
export const availableLangs = () => Object.keys(dict);

export function setLang(lang) {
    if (!dict[lang] || lang === currentLang) return;
    currentLang = lang;
    if (hasLocalStorage) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    }
    if (hasDocument) {
        try { document.documentElement.setAttribute('lang', lang); } catch {}
    }
    subscribers.forEach(fn => { try { fn(lang); } catch (e) { console.error('[i18n] subscriber error:', e); } });
}

/** Subscribe to language changes. Returns an unsubscribe function. */
export function onLangChange(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
}

// Reflect initial language on the root element so CSS/screen readers can react.
if (hasDocument) {
    try { document.documentElement.setAttribute('lang', currentLang); } catch {}
}
