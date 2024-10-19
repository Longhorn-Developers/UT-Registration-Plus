import { deleteSync } from 'del';
import fs from 'fs';
import { dest, series, src } from 'gulp';
import { exec } from 'gulp-execa';
import zip from 'gulp-zip';
import path from 'path';

const DIST_DIR = 'dist';
const PACKAGE_DIR = 'package';
const DATABASE_DIR = path.join(DIST_DIR, 'database');

// Remove extra database folder
function removeExtraDatabaseDir(cb) {
    const deletedDirectoryPaths = deleteSync([DATABASE_DIR]);
    console.log('Deleted directories:', deletedDirectoryPaths);

    cb();
}

// Instrument with Sentry
// Make sure sentry is configured https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/typescript/#2-configure-sentry-cli
async function instrumentWithSentry(cb) {
    await exec(`sentry-cli sourcemaps inject ${DIST_DIR}`);
    await exec(`sentry-cli sourcemaps upload ${DIST_DIR}`);
    console.log('Sentry instrumentation completed.');

    cb();
}

// Zip the dist folder
function zipDist() {
    const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const zipFileName = `${packageInfo.name.replace(/ /g, '-')}-${packageInfo.version}.zip`;

    return src(`${DIST_DIR}/**`, {
        base: DIST_DIR,
        encoding: false, // Disable encoding to handle binary files correctly
    })
        .pipe(zip(zipFileName))
        .pipe(dest(PACKAGE_DIR))
        .on('end', () => console.log(`Zip file created: ${zipFileName}`));
}

// Temp fix for CSP on Chrome 130
// Manually remove them because there is no option to disable use_dynamic_url on @crxjs/vite-plugin
// Force disable use_dynamic_url in manifest.json
function forceDisableUseDynamicUrl(cb) {
    const manifestPath = path.join(DIST_DIR, 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
        console.log('manifest.json not found. Skipping modification.');
        return cb();
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    let modified = false;

    manifest.web_accessible_resources.forEach(resource => {
        if (resource.use_dynamic_url) {
            delete resource.use_dynamic_url;
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('use_dynamic_url removed from manifest.json');
    } else {
        console.log('No use_dynamic_url found in manifest.json. No changes made.');
    }

    cb();
}

// Main build task
const zipProdBuild = series(removeExtraDatabaseDir, instrumentWithSentry, zipDist);

export { forceDisableUseDynamicUrl, zipProdBuild };
