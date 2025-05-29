import chalk from 'chalk';
import fs from 'fs';
import { dest, series, src } from 'gulp';
import { exec } from 'gulp-execa';
import zip from 'gulp-zip';
import path from 'path';

const DIST_DIR = 'dist';
const PACKAGE_DIR = 'package';
const DATABASE_DIR = path.join(DIST_DIR, 'database');

// Custom log functions
const log = message => console.log(chalk.blue(`[${new Date().toTimeString().split(' ')[0]}]`), chalk.white(message));
const logWarn = message =>
    console.warn(
        chalk.blue(`[${new Date().toTimeString().split(' ')[0]}]`),
        chalk.yellow(' [WARN]'),
        chalk.white(message)
    );
const logError = message =>
    console.error(
        chalk.blue(`[${new Date().toTimeString().split(' ')[0]}]`),
        chalk.red(' [ERROR]'),
        chalk.white(message)
    );

// Remove extra database folder
function removeExtraDatabaseDir(cb) {
    fs.rmSync(DATABASE_DIR, { recursive: true, force: true });
    log('Extra database directory removed.');

    cb();
}

// Instrument with Sentry
// Make sure sentry is configured https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/typescript/#2-configure-sentry-cli
async function instrumentWithSentry(cb) {
    if (process.env.SENTRY_ENV && process.env.SENTRY_ENV !== 'development') {
        await exec(`sentry-cli sourcemaps inject ${DIST_DIR}`);
        await exec(`sentry-cli sourcemaps upload ${DIST_DIR}`);
        log('Sentry instrumentation completed.');
    } else {
        logWarn('Skipping uploading/creating Sentry source maps. (development build)');
    }

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
        .on('end', () => log(`Zip file created: ${path.join(PACKAGE_DIR, zipFileName)}`));
}

// Temp fix for CSP on Chrome 130
// Manually remove them because there is no option to disable use_dynamic_url on @crxjs/vite-plugin
// Force disable use_dynamic_url in manifest.json
function forceDisableUseDynamicUrl(cb) {
    const manifestPath = path.join(DIST_DIR, 'manifest.json');

    if (!fs.existsSync(manifestPath)) {
        logWarn('manifest.json not found. Skipping modification.');
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
        log('use_dynamic_url removed from manifest.json');
    } else {
        log('No use_dynamic_url found in manifest.json. No changes made.');
    }

    cb();
}

// Main build task
const zipProdBuild = series(removeExtraDatabaseDir, instrumentWithSentry, zipDist);

export { forceDisableUseDynamicUrl, zipProdBuild };
