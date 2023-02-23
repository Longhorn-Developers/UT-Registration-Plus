import { simpleGit } from 'simple-git';
import prompts from 'prompts';
import { error, info } from './utils/chalk';
import { getSourceRef } from './utils/git/getSourceRef';

const git = simpleGit();
const status = await git.status();

if (status.files.length) {
    console.log(error('Working directory is not clean, please commit or stash changes before releasing.'));
    process.exit(1);
}

const { destinationBranch } = await prompts({
    type: 'select',
    name: 'destinationBranch',
    message: 'What kind of release do you want to create?',
    choices: ['preview', 'production'].map(releaseType => ({
        title: releaseType,
        value: releaseType,
    })),
});
const sourceRef = await getSourceRef(destinationBranch);

const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Are you sure you want to create a ${destinationBranch} release from ${sourceRef}?`,
});

if (!confirm) {
    console.log(error('Aborting release.'));
    process.exit(1);
}

// we fetch the latest changes from the remote
await git.fetch();

// we checkout the source ref, pull the latest changes and then checkout the destination branch
console.info(`Checking out and updating ${sourceRef}...`);
await git.checkout(sourceRef);
await git.pull('origin', sourceRef);
console.info(`Checking out and updating ${destinationBranch}...`);
await git.checkout(destinationBranch);
await git.pull('origin', destinationBranch);

// we trigger the release github action by merging the source ref into the destination branch
console.info(`Merging ${sourceRef} into ${destinationBranch}...`);
await git.merge([sourceRef, '--ff-only']);
await git.push('origin', destinationBranch);

console.info(info(`Release to ${destinationBranch} created! Check github for status`));
