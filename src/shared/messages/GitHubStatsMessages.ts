import type { GitHubStatsResult } from "@shared/types/GitHubStats";

/* eslint-disable jsdoc/require-jsdoc */

export default interface GitHubStatsMessages {
    fetchGitHubStats: () => GitHubStatsResult;
}
