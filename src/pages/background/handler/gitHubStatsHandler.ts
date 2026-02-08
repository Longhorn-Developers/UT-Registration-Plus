import type { MessageHandler } from '@chrome-extension-toolkit';
import type GitHubStatsMessages from '@shared/messages/GitHubStatsMessages';
import { GitHubStatsService } from '@views/lib/getGitHubStats';

const gitHubStatsService = new GitHubStatsService();

/**
 * Handler for GitHub stats related messages
 */
const gitHubStatsHandler: MessageHandler<GitHubStatsMessages> = {
    async fetchGitHubStats({ data, sendResponse }) {
        try {
            const includeMergedPRs = data ?? false;
            const stats = await gitHubStatsService.fetchGitHubStats({ includeMergedPRs });
            sendResponse(stats);
        } catch (error) {
            console.error('Error fetching GitHub stats in background:', error);
            sendResponse({
                adminGitHubStats: {},
                userGitHubStats: {},
                contributors: [],
                names: {},
                dataFetched: new Date(),
                lastUpdated: new Date(),
                isCached: false,
            });
        }
    },
};

export default gitHubStatsHandler;
