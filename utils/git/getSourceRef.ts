import type { SimpleGit } from 'simple-git';
import { simpleGit } from 'simple-git';

/**
 * Determines the source reference based on the destination branch.
 * @param destinationBranch - The destination branch for the release.
 * @returns A Promise that resolves to the source reference.
 * @throws Error if an invalid destination branch is provided.
 */
export async function getSourceRef(destinationBranch: string): Promise<string> {
    const git: SimpleGit = simpleGit();

    switch (destinationBranch) {
        case 'preview':
            return 'develop';
        case 'production':
            // Get the latest tag from the repository
            const tags = await git.tags();
            const latestTag = tags.latest;
            if (!latestTag) {
                throw new Error('No tags found in the repository');
            }
            return latestTag;
        default:
            throw new Error(`Invalid destination branch: ${destinationBranch}`);
    }
}
