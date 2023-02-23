import prompts from 'prompts';
import { simpleGit } from 'simple-git';
import { error } from '../chalk';

const git = simpleGit();

export async function getSourceRef(destinationBranch: 'preview' | 'production'): Promise<string> {
    if (destinationBranch === 'preview') {
        return 'main';
    }

    const tags = await git.tags(['--sort=-committerdate']);
    const alphaTags = tags.all.filter((tag: string) => tag.includes('alpha'));

    if (!alphaTags.length) {
        console.log(error('No preview builds found, please create one before releasing a production build.'));
        process.exit(1);
    }

    const { sourceTag } = await prompts({
        message: 'Which preview tag do you want to create a production build from?',
        type: 'select',
        name: 'sourceTag',
        choices: alphaTags.map(tag => ({ title: tag, value: tag })),
    });

    return sourceTag;
}
