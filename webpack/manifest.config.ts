const NAME = 'UT Registration Plus';
const SHORT_NAME = 'ut-registration-plus';
const DESCRIPTION = 'Improves the course registration process at the University of Texas at Austin!';

const HOST_PERMISSIONS: string[] = [
    '*://*.utdirect.utexas.edu/apps/registrar/course_schedule/*',
    '*://*.utexas.collegescheduler.com/*',
    '*://*.catalog.utexas.edu/ribbit/',
    '*://*.registrar.utexas.edu/schedules/*',
    '*://*.login.utexas.edu/login/*',
];

/**
 * Creates a chrome extension manifest from the given version, mode, and
 * @param mode the build mode (development or production)
 * @param version a chrome extension version (not a semantic version)
 * @returns a chrome extension manifest
 */
export function getManifest(mode: Environment, version: string): chrome.runtime.ManifestV3 {
    let name = mode === 'development' ? `${NAME} (dev)` : NAME;

    if (mode === 'development') {
        HOST_PERMISSIONS.push('http://localhost:9090/*');
    }

    const manifest = {
        name,
        short_name: SHORT_NAME,
        description: DESCRIPTION,
        version,
        manifest_version: 3,
        // hardcode the key for development builds
        key: process.env.MANIFEST_KEY,
        host_permissions: HOST_PERMISSIONS,
        permissions: ['storage', 'unlimitedStorage', 'background'],
        background: {
            service_worker: 'static/js/background.js',
        },
        content_scripts: [
            {
                matches: HOST_PERMISSIONS,
                css: ['/static/css/content.css'],
                js: ['/static/js/content.js'],
            },
        ],
        web_accessible_resources: [
            {
                resources: ['static/media/*', '*'],
                matches: ['<all_urls>'],
            },
        ],
        icons: {
            16: `icons/icon_${mode}_16.png`,
            48: `icons/icon_${mode}_48.png`,
            128: `icons/icon_${mode}_128.png`,
        },
        action: {
            default_popup: 'popup.html',
        },
    } satisfies chrome.runtime.ManifestV3;
    return manifest;
}
