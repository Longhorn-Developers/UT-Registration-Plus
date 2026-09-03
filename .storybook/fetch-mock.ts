// Must load before any module that calls fetch() (e.g. GitHubStatsService) evaluates.
// GitHubStatsService hits the real GitHub API on mount; in Chromatic's sandboxed
// browser that request hangs/fails with no network access, timing out story capture.
const realFetch = globalThis.fetch;

const MOCKED_HOSTS = ['github.cachedapi.com', 'api.github.com'];

function resolveUrl(input: RequestInfo | URL): string {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.href;
    return input.url;
}

globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = resolveUrl(input);

    if (MOCKED_HOSTS.some(host => url.includes(host))) {
        return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return realFetch(input, init);
};
