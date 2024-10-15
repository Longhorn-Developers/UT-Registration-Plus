import { Octokit } from '@octokit/rest';

// Types
type TeamMember = {
    name: string;
    role: string;
    githubUsername: string;
};

type GitHubStats = {
    commits: number;
    linesAdded: number;
    linesDeleted: number;
    mergedPRs?: number;
};

type ContributorStats = {
    total: number;
    weeks: { w: number; a: number; d: number; c: number }[];
    author: { login: string };
};

type CachedData<T> = {
    data: T;
    dataFetched: Date;
};

type FetchResult<T> = {
    data: T;
    dataFetched: Date;
    lastUpdated: Date;
    isCached: boolean;
};

// Constants
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const REPO_OWNER = 'Longhorn-Developers';
const REPO_NAME = 'UT-Registration-Plus';

export const LONGHORN_DEVELOPERS_ADMINS = [
    { name: 'Sriram Hariharan', role: 'Founder', githubUsername: 'sghsri' },
    { name: 'Elie Soloveichik', role: 'Staff Engineer', githubUsername: 'Razboy20' },
    { name: 'Diego Perez', role: 'Staff Engineer', githubUsername: 'doprz' },
    { name: 'Lukas Zenick', role: 'Senior Software Engineer', githubUsername: 'Lukas-Zenick' },
    { name: 'Isaiah Rodriguez', role: 'Chief Operations and Design Officer', githubUsername: 'IsaDavRod' },
] as const satisfies TeamMember[];

export const LONGHORN_DEVELOPERS_SWE = [
    { name: 'Samuel Gunter', role: 'Software Engineer', githubUsername: 'Samathingamajig' },
    { name: 'Derek Chen', role: 'Software Engineer', githubUsername: 'DereC4' },
    { name: 'Casey Charleston', role: 'Software Engineer', githubUsername: 'caseycharleston' },
    { name: 'Vinson', role: 'Software Engineer', githubUsername: 'vinsonzheng499' },
    { name: 'Vivek', role: 'Software Engineer', githubUsername: 'vivek12311' },
] as const satisfies TeamMember[];

/**
 * Represents the GitHub usernames of the SWEs in the LONGHORN_DEVELOPERS_SWE array.
 */
export type LD_SWE_GITHUB_USERNAMES = (typeof LONGHORN_DEVELOPERS_SWE)[number]['githubUsername'];

/**
 * Represents the GitHub usernames of the admins in the LONGHORN_DEVELOPERS_ADMINS array.
 */
export type LD_ADMIN_GITHUB_USERNAMES = (typeof LONGHORN_DEVELOPERS_ADMINS)[number]['githubUsername'];

/**
 * Service for fetching GitHub statistics.
 */
export class GitHubStatsService {
    private octokit: Octokit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cache: Map<string, CachedData<any>>;

    constructor(githubToken?: string) {
        this.octokit = githubToken ? new Octokit({ auth: githubToken }) : new Octokit();
        this.cache = new Map();
    }

    private getCachedData<T>(key: string): CachedData<T> | null {
        const cachedItem = this.cache.get(key);
        if (cachedItem && Date.now() - cachedItem.dataFetched.getTime() < CACHE_TTL) {
            return cachedItem;
        }
        return null;
    }

    private setCachedData<T>(key: string, data: T): void {
        this.cache.set(key, { data, dataFetched: new Date() });
    }

    private async fetchWithRetry<T>(fetchFn: () => Promise<T>, retries: number = 3, delay: number = 5000): Promise<T> {
        try {
            return await fetchFn();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            if (retries > 0 && error.status === 202) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithRetry(fetchFn, retries - 1, delay);
            }
            throw error;
        }
    }

    private async fetchContributorStats(): Promise<FetchResult<ContributorStats[]>> {
        const cacheKey = `contributor_stats_${REPO_OWNER}_${REPO_NAME}`;
        const cachedStats = this.getCachedData<ContributorStats[]>(cacheKey);

        if (cachedStats) {
            return {
                data: cachedStats.data,
                dataFetched: cachedStats.dataFetched,
                lastUpdated: new Date(),
                isCached: true,
            };
        }

        const { data } = await this.fetchWithRetry(() =>
            this.octokit.repos.getContributorsStats({
                owner: REPO_OWNER,
                repo: REPO_NAME,
            })
        );

        if (Array.isArray(data)) {
            const fetchResult: FetchResult<ContributorStats[]> = {
                data: data as ContributorStats[],
                dataFetched: new Date(),
                lastUpdated: new Date(),
                isCached: false,
            };
            this.setCachedData(cacheKey, fetchResult.data);
            return fetchResult;
        }

        throw new Error('Invalid response format');
    }

    private async fetchMergedPRsCount(username: string): Promise<FetchResult<number>> {
        const cacheKey = `merged_prs_${username}`;
        const cachedCount = this.getCachedData<number>(cacheKey);

        if (cachedCount !== null) {
            return {
                data: cachedCount.data,
                dataFetched: cachedCount.dataFetched,
                lastUpdated: new Date(),
                isCached: true,
            };
        }

        const { data } = await this.octokit.search.issuesAndPullRequests({
            q: `org:${REPO_OWNER} author:${username} type:pr is:merged`,
        });

        const fetchResult: FetchResult<number> = {
            data: data.total_count,
            dataFetched: new Date(),
            lastUpdated: new Date(),
            isCached: false,
        };
        this.setCachedData(cacheKey, fetchResult.data);
        return fetchResult;
    }

    private processContributorStats(stats: ContributorStats): GitHubStats {
        return {
            commits: stats.total,
            linesAdded: stats.weeks.reduce((total, week) => total + week.a, 0),
            linesDeleted: stats.weeks.reduce((total, week) => total + week.d, 0),
        };
    }

    public async fetchGitHubStats(options: { includeMergedPRs?: boolean } = {}): Promise<{
        adminGitHubStats: Record<string, GitHubStats>;
        userGitHubStats: Record<string, GitHubStats>;
        contributors: string[];
        dataFetched: Date;
        lastUpdated: Date;
        isCached: boolean;
    }> {
        const { includeMergedPRs = false } = options;
        const adminGitHubStats: Record<string, GitHubStats> = {};
        const userGitHubStats: Record<string, GitHubStats> = {};
        const contributors: string[] = [];
        let oldestDataFetch = new Date();
        let newestDataFetch = new Date(0);
        let allCached = true;

        try {
            const contributorStatsResult = await this.fetchContributorStats();
            oldestDataFetch = contributorStatsResult.dataFetched;
            newestDataFetch = contributorStatsResult.dataFetched;
            allCached = contributorStatsResult.isCached;

            await Promise.all(
                contributorStatsResult.data.map(async stat => {
                    const { login } = stat.author;
                    contributors.push(login);

                    const isAdmin = LONGHORN_DEVELOPERS_ADMINS.some(admin => admin.githubUsername === login);
                    const statsObject = isAdmin ? adminGitHubStats : userGitHubStats;

                    statsObject[login] = this.processContributorStats(stat);

                    if (includeMergedPRs) {
                        try {
                            const mergedPRsResult = await this.fetchMergedPRsCount(login);
                            statsObject[login].mergedPRs = mergedPRsResult.data;

                            if (mergedPRsResult.dataFetched < oldestDataFetch) {
                                oldestDataFetch = mergedPRsResult.dataFetched;
                            }
                            if (mergedPRsResult.dataFetched > newestDataFetch) {
                                newestDataFetch = mergedPRsResult.dataFetched;
                            }
                            allCached = allCached && mergedPRsResult.isCached;
                        } catch (error) {
                            console.error(`Error fetching merged PRs for ${login}:`, error);
                            statsObject[login].mergedPRs = 0;
                        }
                    }
                })
            );

            return {
                adminGitHubStats,
                userGitHubStats,
                contributors,
                dataFetched: oldestDataFetch,
                lastUpdated: new Date(),
                isCached: allCached,
            };
        } catch (error) {
            console.error('Error fetching GitHub stats:', error);
            throw error;
        }
    }
}

// /**
//  * Runs an example that fetches GitHub stats using the GitHubStatsService.
//  *
//  * @returns A promise that resolves when the example is finished running.
//  * @throws If there is an error fetching the GitHub stats.
//  */
// async function runExample() {
//     // Token is now optional
//     // const githubToken = process.env.GITHUB_TOKEN;
//     const gitHubStatsService = new GitHubStatsService();

//     try {
//         console.log('Fetching stats without merged PRs...');
//         const statsWithoutPRs = await gitHubStatsService.fetchGitHubStats();
//         console.log('Data fetched:', statsWithoutPRs.dataFetched.toLocaleString());
//         console.log('Last updated:', statsWithoutPRs.lastUpdated.toLocaleString());
//         console.log('Is cached:', statsWithoutPRs.isCached);

//         console.log(statsWithoutPRs);

//         // console.log('\nFetching stats with merged PRs...');
//         // const statsWithPRs = await gitHubStatsService.fetchGitHubStats({ includeMergedPRs: true });
//         // console.log('Data fetched:', statsWithPRs.dataFetched.toLocaleString());
//         // console.log('Last updated:', statsWithPRs.lastUpdated.toLocaleString());
//         // console.log('Is cached:', statsWithPRs.isCached);

//         // wait 5 seconds
//         // await new Promise(resolve => setTimeout(resolve, 5000));

//         // console.log('\nFetching stats again (should be cached)...');
//         // const cachedStats = await gitHubStatsService.fetchGitHubStats();
//         // console.log('Data fetched:', cachedStats.dataFetched.toLocaleString());
//         // console.log('Last updated:', cachedStats.lastUpdated.toLocaleString());
//         // console.log('Is cached:', cachedStats.isCached);
//     } catch (error) {
//         console.error('Failed to fetch GitHub stats:', error);
//     }
// }

// runExample();
