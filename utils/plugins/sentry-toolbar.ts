import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

const TOOLBAR_CDN_URL = 'https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js';
const CACHE_DIR = resolve(__dirname, '../../node_modules/.cache/sentry-toolbar');
const CACHE_FILE = resolve(CACHE_DIR, 'toolbar.min.js');
const OUTPUT_NAME = 'sentry-toolbar.js';

async function fetchToolbar(): Promise<string> {
    if (existsSync(CACHE_FILE)) {
        return readFileSync(CACHE_FILE, 'utf-8');
    }

    console.log('[sentry-toolbar] Downloading toolbar from CDN...');
    const res = await fetch(TOOLBAR_CDN_URL);
    if (!res.ok) throw new Error(`Failed to download Sentry toolbar: ${res.status}`);

    const text = await res.text();
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(CACHE_FILE, text);
    return text;
}

/**
 * Patches the toolbar source to work around Sentry backend not supporting chrome-extension:// origins.
 *
 * @param source - The raw toolbar source code
 * @returns The patched source code with localhost domain
 */
function patchToolbarSource(source: string): string {
    return source.replace(/domain:window\.location\.host/g, 'domain:"localhost"');
}

/**
 * Downloads the Sentry toolbar script from CDN, caches it in node_modules/.cache,
 * patches it for Chrome extension compatibility, and emits it into the build output.
 * In dev server mode, serves it via middleware.
 */
export default function sentryToolbarPlugin(): Plugin {
    let isDev = false;
    let toolbarSource: string | undefined;

    return {
        name: 'sentry-toolbar',

        configResolved(config) {
            isDev = config.mode === 'development';
        },

        async buildStart() {
            if (!isDev) return;
            toolbarSource = patchToolbarSource(await fetchToolbar());
        },

        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.startsWith(`/${OUTPUT_NAME}`) && toolbarSource) {
                    res.setHeader('Content-Type', 'application/javascript');
                    res.end(toolbarSource);
                    return;
                }
                next();
            });
        },

        async generateBundle() {
            if (!toolbarSource) return;

            this.emitFile({
                type: 'asset',
                fileName: OUTPUT_NAME,
                source: toolbarSource,
            });
        },
    };
}
