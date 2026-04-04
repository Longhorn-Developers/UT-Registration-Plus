/* eslint-disable jsdoc/require-jsdoc */
export type TeamMember = {
    name: string;
    role: string[];
    githubUsername: string;
    personalWebsite?: string;
};

export type GitHubStats = {
    commits: number;
    linesAdded: number;
    linesDeleted: number;
    mergedPRs?: number;
};

export type GitHubStatsResult = {
    adminGitHubStats: Record<string, GitHubStats>;
    userGitHubStats: Record<string, GitHubStats>;
    names: Record<string, string>;
};

export type ContributorStats = {
    total: number;
    weeks: { w: number; a: number; d: number; c: number }[];
    author: { login: string };
};

export type ContributorUser = {
    name: string | undefined;
};
