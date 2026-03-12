import type { MessageHandler } from "@chrome-extension-toolkit";
import type GitHubStatsMessages from "@shared/messages/GitHubStatsMessages";
import { GitHubStatsService } from "@views/lib/getGitHubStats";

const gitHubStatsService = new GitHubStatsService();

/**
 * Handler for GitHub stats related messages
 */
const gitHubStatsHandler: MessageHandler<GitHubStatsMessages> = {
    async fetchGitHubStats({ sendResponse }) {
        try {
            sendResponse(await gitHubStatsService.fetchGitHubStats());
        } catch (error) {
            console.error("Error fetching GitHub stats in background:", error);
            sendResponse({
                adminGitHubStats: {},
                userGitHubStats: {},
                names: {},
            });
        }
    },
};

export default gitHubStatsHandler;
