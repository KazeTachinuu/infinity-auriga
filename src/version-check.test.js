import { describe, it, expect, vi } from 'vitest';
import { version as localVersion } from '../package.json';

function bumpMinor(version) {
    const [major, minor] = version.split('.').map(Number);
    return `${major}.${minor + 1}.0`;
}

function previousPatch(version) {
    const [major, minor, patch] = version.split('.').map(Number);
    if (patch > 0) return `${major}.${minor}.${patch - 1}`;
    if (minor > 0) return `${major}.${minor - 1}.0`;
    return '0.0.0';
}

// Test the isNewer logic directly by importing the module and mocking fetch
describe('version check', () => {
    it('detects newer major version', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true, json: () => Promise.resolve({ version: '2.0.0' }),
        })));

        const { checkForUpdate } = await import('./version-check.js');
        const result = await checkForUpdate();
        expect(result.available).toBe(true);
        expect(result.version).toBe('2.0.0');

        vi.unstubAllGlobals();
    });

    it('detects newer minor version', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true, json: () => Promise.resolve({ version: bumpMinor(localVersion) }),
        })));

        const { checkForUpdate } = await import('./version-check.js');
        const result = await checkForUpdate();
        expect(result.available).toBe(true);

        vi.unstubAllGlobals();
    });

    it('returns false when same version', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true, json: () => Promise.resolve({ version: localVersion }),
        })));

        const { checkForUpdate } = await import('./version-check.js');
        const result = await checkForUpdate();
        expect(result.available).toBe(false);

        vi.unstubAllGlobals();
    });

    it('returns false when older version', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
            ok: true, json: () => Promise.resolve({ version: previousPatch(localVersion) }),
        })));

        const { checkForUpdate } = await import('./version-check.js');
        const result = await checkForUpdate();
        expect(result.available).toBe(false);

        vi.unstubAllGlobals();
    });

    it('returns false on fetch failure', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('offline'))));

        const { checkForUpdate } = await import('./version-check.js');
        const result = await checkForUpdate();
        expect(result.available).toBe(false);

        vi.unstubAllGlobals();
    });
});
