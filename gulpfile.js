// (Thanks go to https://github.com/pnd280/complexity/blob/alpha/gulpfile.js)

import fs from 'fs';
import gulp from 'gulp';
import gulpZip from 'gulp-zip';
import { createRequire } from 'module';

function zip() {
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
