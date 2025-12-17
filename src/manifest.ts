import { defineManifest } from '@crxjs/vite-plugin';

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
// eslint-disable-next-line no-nested-ternary
const nameSuffix = isBeta ? ' (beta)' : mode === 'development' ? ' (dev)' : '';

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

const manifest = defineManifest(async () => ({
    manifest_version: 3,
    name: `${packageJson.displayName ?? packageJson.name}${nameSuffix}`,
    version: `${major}.${minor}.${patch}.${label}`,
    description: packageJson.description,
    options_page: 'src/pages/options/index.html',
    background: { service_worker: 'src/pages/background/background.ts' },
    permissions: ['storage', 'unlimitedStorage', 'background', 'scripting'],
    host_permissions: process.env.MODE === 'development' ? [...HOST_PERMISSIONS, '<all_urls>'] : HOST_PERMISSIONS,
    action: {
        default_popup: 'src/pages/popup/index.html',
        default_icon: `icons/icon_${mode}_32.png`,
    },
    icons: {
        '16': `icons/icon_${mode}_16.png`,
        '32': `icons/icon_${mode}_32.png`,
        '48': `icons/icon_${mode}_48.png`,
        '128': `icons/icon_${mode}_128.png`,
    },
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
    content_security_policy: {
        extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'",
    },
}));

export default manifest;
