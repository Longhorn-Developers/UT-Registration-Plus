// (Thanks go to https://github.com/pnd280/complexity/blob/alpha/gulpfile.js)

import cp from 'child_process';
import fs from 'fs';
import gulp from 'gulp';
import gulpZip from 'gulp-zip';
import { createRequire } from 'module';

// Make sure sentry is configured https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/typescript/#2-configure-sentry-cli
function instrumentWithSentry() {
    return cp.exec('sentry-cli sourcemaps inject dist/ && sentry-cli sourcemaps upload dist/');
}

function zipDist() {
    const require = createRequire(import.meta.url);
    const manifest = require('./package.json');
    const zipFileName = `${manifest.name.replaceAll(' ', '-')}-${manifest.version}.zip`;

    return gulp
        .src('dist/**', {
            encoding: false,
        })
        .pipe(gulpZip(zipFileName))
        .pipe(gulp.dest('package'));
}

const zip = gulp.series(instrumentWithSentry, zipDist);

// Temp fix for CSP on Chrome 130
// Manually remove them because there is no option to disable use_dynamic_url on @crxjs/vite-plugin
function forceDisableUseDynamicUrl(done) {
    const require = createRequire(import.meta.url);
    const manifest = require('./dist/manifest.json');

    manifest.web_accessible_resources.forEach(resource => {
        delete resource.use_dynamic_url;
    });

    if (!fs.existsSync('./dist/manifest.json')) {
        return done();
    }

    fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 2));

    done();
}

export { forceDisableUseDynamicUrl, zip };
