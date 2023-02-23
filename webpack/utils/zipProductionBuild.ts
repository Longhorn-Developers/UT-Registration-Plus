import fs, { mkdirSync } from 'fs';
import archiver from 'archiver';
import chalk from 'chalk';
import path from 'path';

/**
 * Creates a zip file from the given source directory
 * @param fileName the name of the zip file to create
 * @param outDir the directory to zip up
 * @param globOptions the glob options to use when finding files to zip
 * @returns
 */
export async function zipProductionBuild(fileName: string) {
    const outDirectory = path.resolve('build');
    const artifactsDir = path.join(outDirectory, 'artifacts');

    mkdirSync(artifactsDir, { recursive: true });

    const output = fs.createWriteStream(`${artifactsDir}/${fileName}.zip`);
    const archive = archiver('zip', {
        zlib: { level: 9 },
    });
    archive.pipe(output);

    const promise = new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('warning', warn => console.log(chalk.red(warn)));
        archive.on('error', err => reject(err));
    });

    archive.glob('**/*', { cwd: outDirectory, ignore: ['*.zip', 'artifacts'] });
    // eslint-disable-next-line no-void
    void archive.finalize(); // The promise returned is what's `await-ed`, not the call to `finalize()`
    return promise;
}
