import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = packageJson.version.replace(/[^\d.-]+/g, '').split(/[.-]/);

const isBeta = !!process.env.BETA;
const isFirefox = process.env.BROWSER_TARGET === 'firefox';
if (isBeta && process.env.NODE_ENV !== 'production') throw new Error('Cannot have beta non-production build');

const HOST_PERMISSIONS: string[] = [
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

const manifest = defineManifest(async env => {
    const isDev = env.mode === 'development';
    const mode = isBeta ? 'beta' : isDev ? 'development' : 'production';
    const nameSuffix = isBeta ? ' (beta)' : isDev ? ' (dev)' : '';

    return {
        manifest_version: 3,
        name: `${packageJson.displayName ?? packageJson.name}${nameSuffix}`,
        version: `${major}.${minor}.${patch}.${label}`,
        description: packageJson.description,
        options_page: 'src/pages/options/index.html',
        background: isFirefox
            ? { scripts: ['src/pages/background/background.ts'] }
            : { service_worker: 'src/pages/background/background.ts' },
        ...(isFirefox
            ? {
                  browser_specific_settings: {
                      gecko: {
                          id: 'ut-registration-plus@example.com',
                          strict_min_version: '140.0',
                          data_collection_permissions: { required: ['none'] },
                      },
                  },
              }
            : {}),
        permissions: [
            'storage',
            'unlimitedStorage',
            ...(isFirefox ? [] : (['background'] as const)),
            'scripting',
            ...(isDev ? (['declarativeNetRequest', 'declarativeNetRequestWithHostAccess'] as const) : []),
        ],
        host_permissions: isDev ? [...HOST_PERMISSIONS, '<all_urls>'] : HOST_PERMISSIONS,
        action: {
            default_popup: 'src/pages/popup/index.html',
            default_icon: `icons/icon_${mode}_32.png`,
        },
        icons: getIconSet(mode),
        content_scripts: [
            {
                matches: HOST_PERMISSIONS,
                js: ['src/pages/content/index.tsx'],
            },
        ],
        web_accessible_resources: [
            {
                resources: ['assets/js/*.js', 'assets/css/*.css', 'assets/img/*', 'assets/*.wasm', 'database/*'],
                matches: ['*://*/*'],
            },
        ],
        content_security_policy: {
            extension_pages: isDev
                ? "script-src 'self' 'wasm-unsafe-eval' http://localhost:*; object-src 'self'; frame-src https://*.sentry.io"
                : "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
        },
    };
});

export default manifest;
