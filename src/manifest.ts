import { defineManifest } from '@crxjs/vite-plugin';
import type { Plugin, Rollup } from 'vite';
import packageJson from '../package.json';

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = packageJson.version
    // can only contain digits, dots, or dash
    .replace(/[^\d.-]+/g, '')
    // split into version parts
    .split(/[.-]/);

const isBeta = !!process.env.BETA;
const mode = isBeta ? 'beta' : process.env.NODE_ENV;
if (isBeta && process.env.NODE_ENV !== 'production') throw new Error('Cannot have beta non-production build');
const nameSuffix = isBeta ? ' (beta)' : mode === 'development' ? ' (dev)' : '';

export const HOST_PERMISSIONS: string[] = [
    '*://*.utdirect.utexas.edu/apps/registrar/course_schedule/*',
    '*://*.utdirect.utexas.edu/registration/classlist/*',
    '*://*.utexas.collegescheduler.com/*',
    '*://*.catalog.utexas.edu/ribbit/',
    '*://*.registrar.utexas.edu/schedules/*',
    '*://*.login.utexas.edu/login/*',
    'https://*.bluera.com/rpvlf.aspx*',
    '*://my.utexas.edu/student/*',
];

const iconPath = (name: string) => `icons/icon_${name}_`;
const getIconSet = (name: string) => ({
    '16': `${iconPath(name)}16.png`,
    '32': `${iconPath(name)}32.png`,
    '48': `${iconPath(name)}48.png`,
    '128': `${iconPath(name)}128.png`,
});

const commonManifest = {
    manifest_version: 3,
    description: packageJson.description,
    homepage_url: packageJson.homepage,
    permissions: ['storage', 'unlimitedStorage'],
    host_permissions: HOST_PERMISSIONS,
    options_page: 'options.html',
    content_security_policy: {
        extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
    },
} as const;

const manifest = defineManifest(async () => ({
    ...commonManifest,
    name: `${packageJson.displayName ?? packageJson.name}${nameSuffix}`,
    version: `${major}.${minor}.${patch}.${label}`,
    permissions: [...commonManifest.permissions, 'background', 'offscreen'],
    description: packageJson.description,
    host_permissions: process.env.MODE === 'development' ? [...HOST_PERMISSIONS, '<all_urls>'] : HOST_PERMISSIONS,
    action: {
        default_popup: 'src/pages/popup/index.html',
        default_icon: `icons/icon_${mode}_32.png`,
    },
    icons: getIconSet(mode),
    options_page: 'src/pages/options/index.html',
    background: { service_worker: 'src/pages/background/background.ts' },
    content_scripts: [
        {
            matches: HOST_PERMISSIONS,
            js: ['src/pages/content/index.tsx'],
        },
    ],
    web_accessible_resources: [
        {
            resources: ['assets/js/*.js', 'assets/css/*.css', 'assets/img/*'],
            matches: ['*://*/*'],
        },
    ],
}));

interface FirefoxManifestGeneratorOptions {
    cssFiles: string[];
    backgroundFile?: string;
    contentFile?: string;
}

interface FirefoxManifest {
    manifest_version: number;
    name: string;
    version: string;
    description: string;
    homepage_url: string;
    icons: Record<string, string>;
    permissions: string[];
    host_permissions: string[];
    action: {
        default_popup: string;
        default_icon: string;
    };
    options_page: string;
    web_accessible_resources: Array<{
        resources: string[];
        matches: string[];
    }>;
    content_security_policy: {
        extension_pages: string;
    };
    browser_specific_settings: {
        gecko: {
            id: string;
        };
    };
    background?: {
        scripts: string[];
    };
    content_scripts?: Array<{
        matches: string[];
        js: string[];
        css: string[];
    }>;
    // Internal fields used during build, deleted before emit
    _backgroundLoaderName?: string;
    _backgroundLoaderSource?: string;
    _contentLoaderName?: string;
    _contentLoaderSource?: string;
}

function buildFirefoxManifest(options: FirefoxManifestGeneratorOptions): FirefoxManifest {
    const { cssFiles, backgroundFile, contentFile } = options;

    const manifestForFirefox: FirefoxManifest = {
        manifest_version: 3,
        name: packageJson.displayName ?? packageJson.name,
        version: `${major}.${minor}.${patch}.${label}`,
        description: packageJson.description,
        homepage_url: packageJson.homepage,
        icons: getIconSet(mode),
        permissions: ['storage', 'unlimitedStorage', 'tabs'],
        host_permissions: HOST_PERMISSIONS,
        action: {
            default_popup: 'popup.html',
            default_icon: 'icons/icon_production_32.png',
        },
        options_page: 'options.html',
        web_accessible_resources: [
            {
                resources: ['assets/*.js', 'assets/*.css', 'assets/*'],
                matches: ['<all_urls>'],
            },
        ],
        content_security_policy: {
            extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
        },
        browser_specific_settings: {
            gecko: {
                id: 'ut-registration-plus@example.com',
            },
        },
    };

    if (backgroundFile) {
        const loaderName = 'background-loader.js';
        const loaderSource = `(async()=>{try{await import(chrome.runtime.getURL('${backgroundFile}'));}catch(e){console.error('Failed to load background module',e);}})();`;
        manifestForFirefox.background = { scripts: [loaderName] };
        manifestForFirefox._backgroundLoaderName = loaderName;
        manifestForFirefox._backgroundLoaderSource = loaderSource;
    } else {
        // best-effort fallback
        manifestForFirefox.background = { scripts: ['src/pages/background/background.js'] };
    }

    if (contentFile) {
        const contentLoaderName = 'content-loader.js';
        const contentLoaderSource = `(async()=>{try{await import(chrome.runtime.getURL('${contentFile}'));}catch(e){console.error('Failed to load content module',e);}})();`;
        manifestForFirefox.content_scripts = [
            {
                matches: HOST_PERMISSIONS,
                js: [contentLoaderName],
                css: cssFiles,
            },
        ];
        manifestForFirefox._contentLoaderName = contentLoaderName;
        manifestForFirefox._contentLoaderSource = contentLoaderSource;
    }

    return manifestForFirefox;
}

export function createFirefoxManifestPlugin(): Plugin {
    return {
        name: 'firefox-manifest-generator',
        apply: 'build',
        async generateBundle(_options, bundle) {
            let backgroundFile: string | undefined;
            let contentFile: string | undefined;
            const cssFiles: string[] = [];

            for (const [fileName, chunk] of Object.entries(bundle) as [
                string,
                Rollup.OutputChunk | Rollup.OutputAsset,
            ][]) {
                if (fileName.endsWith('.css')) {
                    cssFiles.push(fileName);
                }

                if (chunk.type === 'chunk') {
                    const facade = chunk.facadeModuleId ?? '';
                    if (facade.endsWith('src/pages/background/background.ts')) {
                        backgroundFile = fileName;
                    }
                    if (facade.endsWith('src/pages/content/index.tsx')) {
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

            const manifestForFirefox = buildFirefoxManifest({ cssFiles, backgroundFile, contentFile });

            // Emit loader files
            if (manifestForFirefox._backgroundLoaderName) {
                this.emitFile({
                    type: 'asset',
                    fileName: manifestForFirefox._backgroundLoaderName,
                    source: manifestForFirefox._backgroundLoaderSource,
                });
                delete manifestForFirefox._backgroundLoaderName;
                delete manifestForFirefox._backgroundLoaderSource;
            }

            if (manifestForFirefox._contentLoaderName) {
                this.emitFile({
                    type: 'asset',
                    fileName: manifestForFirefox._contentLoaderName,
                    source: manifestForFirefox._contentLoaderSource,
                });
                delete manifestForFirefox._contentLoaderName;
                delete manifestForFirefox._contentLoaderSource;
            }

            const out = JSON.stringify(manifestForFirefox, null, 2);
            this.emitFile({ type: 'asset', fileName: 'manifest.json', source: out });
        },
    };
}

export default manifest;
