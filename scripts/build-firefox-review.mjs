import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const requiredNode = readFileSync('.nvmrc', 'utf8').trim();
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const requiredPnpm = packageJson.packageManager.replace('pnpm@', '');
if (process.version !== requiredNode) {
    throw new Error(`Use Node ${requiredNode}; found ${process.version}. See README.firefox-review.md.`);
}
const pnpmVersion = execFileSync('pnpm', ['--version'], { encoding: 'utf8' }).trim();
if (pnpmVersion !== requiredPnpm) throw new Error(`Use pnpm ${requiredPnpm}; found ${pnpmVersion}.`);

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const metadata = existsSync('firefox-review-build.json')
    ? JSON.parse(readFileSync('firefox-review-build.json', 'utf8'))
    : { commit: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current') };
if (!/^[a-f0-9]{40}$/.test(metadata.commit) || !metadata.branch) {
    throw new Error('Build metadata must contain a full Git commit and a nonempty branch.');
}

// Do not inherit local build flags, VITE_* overrides, beta flags, or Sentry credentials.
const env = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    ...(process.env.TMPDIR ? { TMPDIR: process.env.TMPDIR } : {}),
    CI: 'true',
    HUSKY: '0',
    BROWSER_TARGET: 'firefox',
    VITE_GIT_COMMIT: metadata.commit,
    VITE_GIT_BRANCH: metadata.branch,
};
const run = args => execFileSync('pnpm', args, { env, stdio: 'inherit' });
run(['install', '--frozen-lockfile']);
run(['run', 'build:firefox']);
// Vite asset placeholders in source maps vary by extraction directory.
// Readable original sources are supplied in the separate source archive.
function removeSourceMaps(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) removeSourceMaps(path);
        else if (entry.name.endsWith('.map')) rmSync(path);
    }
}
removeSourceMaps('dist/firefox');
run(['run', 'lint:firefox']);
run([
    'exec',
    'web-ext',
    'build',
    '--source-dir',
    'dist/firefox',
    '--artifacts-dir',
    'package/firefox-review',
    '--filename',
    'addon.zip',
    '--overwrite-dest',
]);
console.log('Reviewer build: dist/firefox/; upload package: package/firefox-review/addon.zip');
