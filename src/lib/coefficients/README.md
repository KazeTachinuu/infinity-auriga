# Coefficients

Auriga treats all exams as equally weighted. This directory contains the **real** coefficients, contributed by the community.

The student average is a **flat weighted average** of all marks: `Σ(mark × coef) / Σ(coef)`. Subject and module weights are derived from the sum of their children's coefficients automatically.

## How to add coefficients for your semester

### Quick way (recommended)

If your semester has no coefficients yet, Infinity Auriga shows a **"Créer {filename} sur GitHub"** link in the coefficient section. Click it — GitHub opens with the filename and a pre-filled template containing all your exam codes, organized by module with readable names:

```js
export default {
    // ── Cybersécurité ──────────────────────────────────────
    '2526_I_INF_FISA_S07_CS_FR_MSE_EX': 1,   // Forensique MSE
    '2526_I_INF_FISA_S07_CS_GR_WS_EX': 1,    // Windows sécurité
    // ...
};
```

Replace the `1`s with the real coefficients, delete lines where the coefficient is 1, commit, and open a PR. That's it.

### Manual way

#### 1. Find your codes

**Hover** any mark name in Infinity Auriga — a tooltip shows its full code. **Click** to copy it to your clipboard.

Every copyable name has a <u>dashed underline</u> to indicate it's clickable.

![Hover a name to see its code, click to copy](../../../docs/img/copy-code.png)

#### Code anatomy

```
2526_I_INF_FISA_S07_CS_GR_WS_EX
│    │ │   │    │   │  │  │  └─ eval type (EX, PRJ, EXF, ...)
│    │ │   │    │   │  │  └──── exam
│    │ │   │    │   │  └─────── subject
│    │ │   │    │   └────────── module
│    │ │   │    └────────────── semester
│    │ │   └─────────────────── track (FISA, FISE, GISTRE, ...)
│    │ └─────────────────────── school
│    └───────────────────────── always I
└────────────────────────────── academic year (25/26)
```

#### 2. Create a file

Filename: `s{semester}_{year}_{track}.js` (all lowercase)

| Semester | Year | Track | Filename |
|----------|------|-------|----------|
| S07 | 2025/2026 | FISA | `s07_2526_fisa.js` |
| S08 | 2025/2026 | FISE | `s08_2526_fise.js` |
| S09 | 2026/2027 | GISTRE | `s09_2627_gistre.js` |

#### 3. Fill in your coefficients

Use the full exam code for each mark. Only list entries whose coefficient is NOT 1:

```js
/**
 * Coefficients — S07 FISA 2025/2026
 * Only list entries whose coefficient is NOT 1.
 */
export default {
    '2526_I_INF_FISA_S07_AEE_EAE3_EX': 8,          // REX — Alternance
    '2526_I_INF_FISA_S07_CS_GR_WS_EX': 2,           // Windows sécurité
};
```

See [`s07_2526_fisa.js`](s07_2526_fisa.js) for a real example.

#### 4. Open a pull request

That's it. No other file to edit — coefficient files are auto-discovered at build time.

## How it works

1. Files matching `s*_*_*.js` in this directory are discovered via Vite's `import.meta.glob` at build time
2. `loadCoefficients(semesterKey, track)` constructs the filename and loads the matching module
3. `applyCoefficients(marks, overrides)` walks the grade tree and applies overrides at mark, subject, or module level
4. Averages are recomputed bottom-up as `Σ(mark × coef) / Σ(coef)`

## Testing locally

```bash
npm install
npm run dev    # Opens localhost:5173 with mock API data
```

The dev server uses captured API responses (see `tools/README.md`). To test your coefficient file, add it to this directory and reload — it's picked up automatically.
