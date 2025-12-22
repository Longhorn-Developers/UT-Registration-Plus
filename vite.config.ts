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

const HOST_PERMISSIONS: string[] = [
    '*://*.utdirect.utexas.edu/apps/registrar/course_schedule/*',
    '*://*.utdirect.utexas.edu/registration/classlist/*',
    '*://*.utexas.collegescheduler.com/*',
    '*://*.catalog.utexas.edu/ribbit/',
    '*://*.registrar.utexas.edu/schedules/*',
    '*://*.login.utexas.edu/login/*',
    'https://utexas.bluera.com/*',
    '*://my.utexas.edu/student/student/*',
];

const isBeta = !!process.env.BETA;
if (isBeta) {
    process.env.VITE_BETA_BUILD = 'true';
}
process.env.VITE_PACKAGE_VERSION = packageJson.version;

// special condition for production sentry instrumentation, as many of our devs like to use `pnpm build` directly. Production instrumentation is added and uploaded during `pnpm zip:to-publish`.
if (process.env.SENTRY_ENV === 'production') {
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
        // Only use CRX plugin for Chromium targets. For Firefox we generate a
        // Firefox-compatible manifest post-build because @crxjs/vite-plugin
        // does not support Manifest V2.
        ...(BROWSER_TARGET === 'firefox' ? [] : [crx({ manifest })]),
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
        renameFile('src/pages/popup/index.html', 'popup.html'),
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
        // Firefox manifest generator: writes a Manifest V2 file into the
        // build output using the bundle filenames produced by Vite/Rollup.
        ...(BROWSER_TARGET === 'firefox'
            ? [
                  (function firefoxManifestGenerator(): Plugin {
                      return {
                          name: 'firefox-manifest-generator',
                          apply: 'build',
                          async generateBundle(_options, bundle) {
                              // find built chunks for background and content scripts
                              let backgroundFile: string | undefined;
                              let contentFile: string | undefined;
                              for (const [fileName, chunk] of Object.entries(bundle)) {
                                  // only care about chunks
                                  // @ts-ignore - rollup types at runtime
                                  if (chunk && (chunk as any).type === 'chunk') {
                                      const facade = (chunk as any).facadeModuleId || '';
                                      if (facade && facade.endsWith('src/pages/background/background.ts')) {
                                          backgroundFile = fileName;
                                      }
                                      if (facade && facade.endsWith('src/pages/content/index.tsx')) {
                                          contentFile = fileName;
                                      }
                                  }
                              }

                              // fallback heuristics
                              if (!backgroundFile) {
                                  for (const fileName of Object.keys(bundle)) {
                                      if (fileName.includes('background')) {
                                          backgroundFile = fileName;
                                          break;
                                      }
                                  }
                              }
                              if (!contentFile) {
                                  for (const fileName of Object.keys(bundle)) {
                                      if (fileName.includes('content')) {
                                          contentFile = fileName;
                                          break;
                                      }
                                  }
                              }

                              const manifestForFirefox: any = {
                                  manifest_version: 2,
                                  name: `${packageJson.displayName ?? packageJson.name}`,
                                  version: packageJson.version,
                                  description: packageJson.description,
                                  homepage_url: packageJson.homepage,
                                  icons: {
                                      '16': `icons/icon_production_16.png`,
                                      '32': `icons/icon_production_32.png`,
                                      '48': `icons/icon_production_48.png`,
                                      '128': `icons/icon_production_128.png`,
                                  },
                                  permissions: ['storage', 'unlimitedStorage', 'tabs', ...HOST_PERMISSIONS],
                                  browser_action: {
                                      default_popup: 'popup.html',
                                      default_icon: `icons/icon_production_32.png`,
                                  },
                                  options_page: 'options.html',
                                  web_accessible_resources: ['assets/*.js', 'assets/*.css', 'assets/*'],
                                  content_security_policy: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
                              };

                              // For Firefox MV2 background/content scripts must be classic
                              // scripts (no top-level `import` declarations). The Vite build
                              // emits ESM chunks which can contain `import` statements, so
                              // create small loader scripts that dynamically import the
                              // ESM chunk via `chrome.runtime.getURL(...)` and reference
                              // the loader in the manifest instead.
                              if (backgroundFile) {
                                  const loaderName = 'background-loader.js';
                                  const loaderSource = `(async()=>{try{await import(chrome.runtime.getURL('${backgroundFile}'));}catch(e){console.error('Failed to load background module',e);}})();`;
                                  this.emitFile({ type: 'asset', fileName: loaderName, source: loaderSource });
                                  manifestForFirefox.background = { scripts: [loaderName] };
                              } else {
                                  // best-effort fallback
                                  manifestForFirefox.background = { scripts: ['src/pages/background/background.js'] };
                              }

                              if (contentFile) {
                                  const contentLoaderName = 'content-loader.js';
                                  const contentLoaderSource = `(async()=>{try{await import(chrome.runtime.getURL('${contentFile}'));}catch(e){console.error('Failed to load content module',e);}})();`;
                                  this.emitFile({
                                      type: 'asset',
                                      fileName: contentLoaderName,
                                      source: contentLoaderSource,
                                  });
                                  manifestForFirefox.content_scripts = [
                                      {
                                          matches: HOST_PERMISSIONS,
                                          js: [contentLoaderName],
                                      },
                                  ];
                              }

                              const out = JSON.stringify(manifestForFirefox, null, 2);
                              this.emitFile({ type: 'asset', fileName: 'manifest.json', source: out });
                          },
                      };
                  })(),
              ]
            : []),
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
                popup: 'src/pages/popup/index.html',
                calendar: 'src/pages/calendar/index.html',
                options: 'src/pages/options/index.html',
                report: 'src/pages/report/index.html',
                map: 'src/pages/map/index.html',
                404: 'src/pages/404/index.html',
                // ensure background and content are emitted as separate chunks
                background: 'src/pages/background/background.ts',
                content: 'src/pages/content/index.tsx',
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
