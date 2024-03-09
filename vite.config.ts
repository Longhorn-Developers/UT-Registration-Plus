/// <reference types="vitest" />
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import UnoCSS from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';

import manifest from './src/manifest';

const root = resolve(__dirname, 'src');
const pagesDir = resolve(root, 'pages');
const assetsDir = resolve(root, 'assets');
const outDir = resolve(__dirname, 'dist');
const publicDir = resolve(__dirname, 'public');

const isDev = process.env.NODE_ENV === 'development';

export const preambleCode = `
import RefreshRuntime from "__BASE__@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;

const renameFile = (source: string, destination: string): Plugin => {
    if (typeof source !== 'string' || typeof destination !== 'string') {
        return;
    }

    return {
        name: 'crx:rename-file',
        apply: 'build',
        enforce: 'post',
        generateBundle(options, bundle) {
            if (!bundle[source]) return;
            bundle[source].fileName = destination;
        },
    };
};

const fixManifestOptionsPage = () => ({
    name: 'fix-manifest-options-page',
    apply: 'build' as const,
    enforce: 'post' as const,
    generateBundle(_, bundle) {
        for (const fileName of Object.keys(bundle)) {
            if (fileName.startsWith('assets/crx-manifest')) {
                const chunk = bundle[fileName];
                chunk.code = chunk.code.replace(
                    /"options_page":"src\/pages\/options\/index.html"/,
                    `"options_page":"options.html"`
                );
                break;
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
                    return code.replace(
                        /(['"])(\/public\/.*?)(['"])/g,
                        (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
                    );
                }
            },
        },
        {
            name: 'public-transform',
            apply: 'build',
            transform(code, id) {
                if (id.endsWith('.tsx') || id.endsWith('.ts') || id.endsWith('?url')) {
                    return code.replace(
                        /(['"])(__VITE_ASSET__.*?__)(['"])/g,
                        (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
                    );
                }
            },
        },
        {
            name: 'public-css-dev-transform',
            apply: 'serve',
            enforce: 'post',
            transform(code, id) {
                if (process.env.NODE_ENV === 'development' && (id.endsWith('.css') || id.endsWith('.scss'))) {
                    return code.replace(
                        /url\((.*?)\)/g,
                        (_, path) =>
                            `url(\\"" + chrome.runtime.getURL(${path
                                .replaceAll(`\\"`, `"`)
                                .replace(/public\//, '')}) + "\\")`
                    );
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
                    return transformedCode;
                }
                return code;
            },
        },
        renameFile('src/pages/options/index.html', 'options.html'),
        renameFile('src/pages/calendar/index.html', 'calendar.html'),
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
        },
    },
    build: {
        rollupOptions: {
            input: {
                debug: 'src/pages/debug/index.html',
                calendar: 'src/pages/calendar/index.html',
                options: 'src/pages/options/index.html',
            },
            // output: {
            //     entryFileNames: `[name].js`, // otherwise it will add the hash
            //     chunkFileNames: `[name].js`,
            // },
            // external: ['/@react-refresh'],
        },
    },
    test: {
        coverage: {
            provider: 'v8',
        },
    },
});
