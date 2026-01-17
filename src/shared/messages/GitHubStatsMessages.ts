import type { GitHubStatsResult } from '@shared/types/GitHubStats';

/* eslint-disable jsdoc/require-jsdoc */

export default interface GitHubStatsMessages {
    /**
     * Fetch GitHub statistics for all contributors
     * @param includeMergedPRs - Whether to include merged PR counts (optional, default: false)
     * @returns GitHub stats including commits, lines added/deleted, and optionally merged PRs
     */
    fetchGitHubStats: (includeMergedPRs?: boolean) => GitHubStatsResult;
}
