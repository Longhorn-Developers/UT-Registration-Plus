import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { arch, platform, release, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
if (git('status', '--porcelain')) {
    throw new Error('Commit the finalized source first. Source packages must come from a clean checkout.');
}
const commit = git('rev-parse', 'HEAD');
const branch = git('branch', '--show-current');
if (!branch) throw new Error('Use a named branch so the embedded build metadata is explicit.');
const metadata = {
    commit,
    branch,
    node: readFileSync('.nvmrc', 'utf8').trim(),
    packageManager: JSON.parse(readFileSync('package.json', 'utf8')).packageManager,
    packagingHost: { platform: platform(), arch: arch(), release: release() },
};
const outputDir = resolve('package/firefox-review');
mkdirSync(outputDir, { recursive: true });
const output = join(outputDir, `source-${commit.slice(0, 12)}.zip`);
const temporary = mkdtempSync(join(tmpdir(), 'utrp-firefox-source-'));
try {
    const source = join(temporary, 'source');
    mkdirSync(source);
    const archive = join(temporary, 'source.tar');
    execFileSync('git', ['archive', '--format=tar', `--output=${archive}`, commit]);
    execFileSync('tar', ['-xf', archive, '-C', source]);
    writeFileSync(join(source, 'firefox-review-build.json'), `${JSON.stringify(metadata, null, 4)}\n`);
    // Start a fresh archive rather than retaining entries from an earlier run.
    rmSync(output, { force: true });
    execFileSync('zip', ['-q', '-r', output, '.'], { cwd: source, stdio: 'inherit' });
    if (statSync(output).size >= 200_000_000) {
        rmSync(output);
        throw new Error('Source ZIP exceeds the 200 MB submission limit.');
    }
    console.log(`Source package: ${output}`);
    console.log('Extract this archive and run its reviewer build script to create the matching add-on.');
} finally {
    rmSync(temporary, { recursive: true, force: true });
}
