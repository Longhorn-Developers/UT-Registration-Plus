/// <reference types="vitest" />
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { execSync } from 'child_process';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import type { Plugin, ResolvedConfig, Rollup, ViteDevServer } from 'vite';
import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';

import packageJson from './package.json';
import manifest from './src/manifest';
import vitePluginRunCommandOnDemand from './utils/plugins/run-command-on-demand';
import { buildLogger } from './utils/plugins/vite-build-logger';

const BROWSER_TARGET = process.env.BROWSER_TARGET || 'chrome';

// Set browser target environment variable default
process.env.BROWSER_TARGET = BROWSER_TARGET;

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const publicDir = resolve(__dirname, 'public');

// Set default environment variables
process.env.PROD = process.env.NODE_ENV === 'production' ? 'true' : 'false';

const isBeta = !!process.env.BETA;
if (isBeta) {
    process.env.VITE_BETA_BUILD = 'true';
}
process.env.VITE_PACKAGE_VERSION = packageJson.version;
// TODO: Debug this. If PROD is false, VITE_SENTRY_ENVIRONMENT is in production mode
if (process.env.PROD) {
    process.env.VITE_SENTRY_ENVIRONMENT = 'production';
} else if (isBeta) {
    process.env.VITE_SENTRY_ENVIRONMENT = 'beta';
} else {
    process.env.VITE_SENTRY_ENVIRONMENT = 'development';
}

export const preambleCode = `
import RefreshRuntime from "__BASE__@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;

const isOutputChunk = (input: Rollup.OutputAsset | Rollup.OutputChunk): input is Rollup.OutputChunk => 'code' in input;

const renameFile = (source: string, destination: string): Plugin => {
    if (typeof source !== 'string' || typeof destination !== 'string') {
        throw new Error('Invalid arguments for renameFile');
    }

    return {
        name: 'crx:rename-file',
        apply: 'build',
        enforce: 'post',
        generateBundle(options, bundle) {
            const file = bundle[source];
            if (!file) return;
            file.fileName = destination;
        },
    };
};

const fixManifestOptionsPage = (): Plugin => ({
    name: 'fix-manifest-options-page',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
        for (const fileName of Object.keys(bundle)) {
            if (fileName.startsWith('assets/crx-manifest')) {
                const chunk = bundle[fileName];
                if (!chunk) continue;

                if (isOutputChunk(chunk)) {
                    chunk.code = chunk.code.replace(
                        /"options_page":"src\/pages\/options\/index.html"/,
                        `"options_page":"options.html"`
                    );
                    return;
                }
            }
        }
    },
});

let config: ResolvedConfig;
let server: ViteDevServer;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        UnoCSS(),
        Icons({ compiler: 'jsx', jsx: 'react' }),
        crx({ manifest }),
        fixManifestOptionsPage(),
        inspect(),
        {
            name: 'public-transform',
            apply: 'serve',
            transform(code, id) {
                if (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('?url')) {
                    return {
                        code: code.replace(
                            /(['"])(\/public\/.*?)(['"])/g,
                            (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
                        ),
                        map: null,
                    };
                }
            },
        },
        {
            name: 'public-transform',
            apply: 'build',
            transform(code, id) {
                if (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('?url')) {
                    return {
                        code: code.replace(
                            /(['"])(__VITE_ASSET__.*?__)(['"])/g,
                            (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
                        ),
                        map: null,
                    };
                }
            },
        },
        {
            name: 'public-css-dev-transform',
            apply: 'serve',
            enforce: 'post',
            transform(code, id) {
                if (process.env.NODE_ENV === 'development' && (id.endsWith('.css') || id.endsWith('.scss'))) {
                    return {
                        code: code.replace(
                            /url\((.*?)\)/g,
                            (_, path) =>
                                `url(\\"" + chrome.runtime.getURL(${path
                                    .replaceAll(`\\"`, `"`)
                                    .replace(/public\//, '')}) + "\\")`
                        ),
                        map: null,
                    };
                }
            },
        },
        {
            name: 'public-transform2',
            // enforce: 'post',
            transform(code, id) {
                if (id.replace(/\?used$/, '').endsWith('.scss')) {
                    const transformedCode = code.replace(
                        /(__VITE_ASSET__.*?__)/g,
                        (_, path) => `chrome-extension://__MSG_@@extension_id__${path}`
                    );
                    return { code: transformedCode, map: null };
                }
            },
        },
        renameFile('src/pages/debug/index.html', 'debug.html'),
        renameFile('src/pages/options/index.html', 'options.html'),
        renameFile('src/pages/calendar/index.html', 'calendar.html'),
        renameFile('src/pages/report/index.html', 'report.html'),
        renameFile('src/pages/map/index.html', 'map.html'),
        renameFile('src/pages/404/index.html', '404.html'),
        vitePluginRunCommandOnDemand({
            // afterServerStart: 'pnpm gulp forceDisableUseDynamicUrl',
            closeBundle: 'pnpm gulp forceDisableUseDynamicUrl',
        }),
        buildLogger({
            includeEnvVars: [
                'VITE_PACKAGE_VERSION',
                'NODE_ENV',
                'BROWSER_TARGET',
                'PROD',
                'VITE_SENTRY_ENVIRONMENT',
                'VITE_BETA_BUILD',
            ],
            includeTimestamp: true,
            includeBuildTime: true,
            customMetadata: {
                gitBranch: () => execSync('git rev-parse --abbrev-ref HEAD').toString().trim(),
                gitCommit: () => execSync('git rev-parse --short HEAD').toString().trim(),
                nodeVersion: () => process.version,
            },
        }),
    ],
    resolve: {
        alias: {
            src: root,
            '@assets': assetsDir,
            '@pages': pagesDir,
            '@public': publicDir,
            '@shared': resolve(root, 'shared'),
            '@background': resolve(pagesDir, 'background'),
            '@views': resolve(root, 'views'),
        },
    },
    server: {
        strictPort: true,
        port: 5173,
        hmr: {
            clientPort: 5173,
        },
        proxy: {
            '/debug.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('debug', 'src/pages/debug/index'),
            },
            '/calendar.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('calendar', 'src/pages/calendar/index'),
            },
            '/options.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('options', 'src/pages/options/index'),
            },
            '/report.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('report', 'src/pages/report/index'),
            },
            '/map.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('map', 'src/pages/map/index'),
            },
            '/404.html': {
                target: 'http://localhost:5173',
                rewrite: path => path.replace('404', 'src/pages/404/index'),
            },
        },
    },
    build: {
        target: ['chrome120', 'edge120', 'firefox120'],
        // NOTE: Eventually we will add this back once we support multiple browsers
        // outDir: `dist/${process.env.BROWSER_TARGET || 'chrome'}`,
        emptyOutDir: true,
        reportCompressedSize: false,
        sourcemap: true,
        rollupOptions: {
            input: {
                debug: 'src/pages/debug/index.html',
                calendar: 'src/pages/calendar/index.html',
                options: 'src/pages/options/index.html',
                report: 'src/pages/report/index.html',
                map: 'src/pages/map/index.html',
                404: 'src/pages/404/index.html',
            },
            output: {
                chunkFileNames: `assets/[name]-[hash].js`,
                assetFileNames: `assets/[name]-[hash][extname]`,
            },
        },
    },
    test: {
        coverage: {
            provider: 'v8',
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
});
