const AURIGA_API = '/api';

let _accessToken = null;
let _onApiRequest = null;

export function setApiRequestHook(fn) {
    _onApiRequest = fn;
}

export function setAccessToken(token) {
    _accessToken = token;
}

export function getAccessToken() {
    return _accessToken;
}

export async function apiFetch(path, options = {}, _retried = false) {
    if (!_accessToken) {
        throw new Error('No access token available');
    }

    const url = path.startsWith('http') ? path : `${AURIGA_API}${path}`;
    _onApiRequest?.(url);
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${_accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const TOKEN_REFRESH_DELAY_MS = 2000;
    if (response.status === 401 && !_retried) {
        // Token expired - wait for Angular to refresh it, then retry once
        await new Promise(r => setTimeout(r, TOKEN_REFRESH_DELAY_MS));
        return apiFetch(path, options, true);
    }

    if (!response.ok) {
        throw new Error(`Auriga API error: ${response.status} ${response.statusText} (${url})`);
    }

    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        throw new Error(`Auriga API returned invalid JSON for ${url} (got ${text.substring(0, 100)}...)`);
    }
}

/** Fetch all pages of a search result endpoint, returning all lines across pages. */
export async function fetchAllSearchResults(menuEntryId, queryId) {
    const queryDef = await apiFetch(`/menuEntries/${menuEntryId}/query/${queryId}`);
    const body = queryDef.queryDefinition;

    let allLines = [];
    let page = 1;
    let totalPages = 1;

    do {
        const result = await apiFetch(
            `/menuEntries/${menuEntryId}/searchResult?size=100&page=${page}&sort=id&disableWarnings=true`,
            { method: 'POST', body: JSON.stringify(body) }
        );
        allLines = allLines.concat(result.content.lines);
        totalPages = result.totalPages;
        page++;
    } while (page <= totalPages);

    return allLines;
}
