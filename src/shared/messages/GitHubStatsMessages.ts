import type { GitHubStatsService } from '@views/lib/getGitHubStats';

/* eslint-disable jsdoc/require-jsdoc */

export type GitHubStatsResult = Awaited<ReturnType<GitHubStatsService['fetchGitHubStats']>>;

export default interface GitHubStatsMessages {
    /**
     * Fetch GitHub statistics for all contributors
     * @param includeMergedPRs - Whether to include merged PR counts (optional, default: false)
     * @returns GitHub stats including commits, lines added/deleted, and optionally merged PRs
     */
    fetchGitHubStats: (includeMergedPRs?: boolean) => GitHubStatsResult;
}
