import { CacheStore } from '@shared/storage/CacheStore';
import type {
    ContributorStats,
    ContributorUser,
    GitHubStats,
    GitHubStatsResult,
    TeamMember,
} from '@shared/types/GitHubStats';

// Constants
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const REPO_OWNER = 'Longhorn-Developers';
const REPO_NAME = 'UT-Registration-Plus';
const CONTRIBUTORS_API_ROUTE = `/repos/${REPO_OWNER}/${REPO_NAME}/stats/contributors`;

export const LONGHORN_DEVELOPERS_ADMINS = [
    {
        name: 'Elie Soloveichik',
        role: ['LHD President', 'LHD Co-Founder'],
        githubUsername: 'Razboy20',
    },
    {
        name: 'Brendan Early',
        role: ['LHD Software Engineering Director'],
        githubUsername: 'mymindstorm',
    },
    {
        name: 'Denise Xu',
        role: ['LHD Product Director'],
        githubUsername: 'denise308',
    },
    {
        name: 'Carla Garcia Leija',
        role: ['LHD UX Design Director'],
        githubUsername: 'carlagarcialeija',
    },
    {
        name: 'Kabir Ramzan',
        role: ['LHD Events Director'],
        githubUsername: 'CMEONE',
    },
    {
        name: 'Derek Chen',
        role: ['LHD Advisor', 'UTRP Tech Lead'],
        githubUsername: 'DereC4',
    },
] as const satisfies TeamMember[];

export const LONGHORN_DEVELOPERS_SWE = [
    {
        name: 'Diego Perez',
        role: ['LHD Co-Founder', 'LHD Advisor', 'UTRP Senior SWE'],
        githubUsername: 'doprz',
    },
    {
        name: 'Samuel Gunter',
        role: ['LHD Advisor', 'UTRP Senior SWE'],
        githubUsername: 'Samathingamajig',
    },
    {
        name: 'Isaiah Rodriguez',
        role: ['LHD Co-Founder', 'LHD Advisor'],
        githubUsername: 'IsaDavRod',
    },
    {
        name: 'Sriram Hariharan',
        role: ['UTRP Founder', 'LHD Alumni'],
        githubUsername: 'sghsri',
    },
    {
        name: 'Preston Cook',
        role: ['LHD Alumni'],
        githubUsername: 'Preston-Cook',
    },
    {
        name: 'Casey Charleston',
        role: ['LHD Alumni'],
        githubUsername: 'caseycharleston',
    },
    {
        name: 'Lukas Zenick',
        role: ['LHD Alumni'],
        githubUsername: 'Lukas-Zenick',
    },
    { name: 'Vinson', role: ['LHD Alumni'], githubUsername: 'vinsonzheng499' },
    { name: 'Vivek', role: ['LHD Alumni'], githubUsername: 'vivek12311' },
    { name: 'Ethan Lanting', role: ['LHD Alumni'], githubUsername: 'EthanL06' },
] as const satisfies TeamMember[];

/**
 * Represents the GitHub usernames of the SWEs in the LONGHORN_DEVELOPERS_SWE array.
 */
export type LD_SWE_GITHUB_USERNAMES = (typeof LONGHORN_DEVELOPERS_SWE)[number]['githubUsername'];

/**
 * Represents the GitHub usernames of the admins in the LONGHORN_DEVELOPERS_ADMINS array.
 */
export type LD_ADMIN_GITHUB_USERNAMES = (typeof LONGHORN_DEVELOPERS_ADMINS)[number]['githubUsername'];

export const UTRP_LEADS = [
    {
        name: 'Margaret Cartee',
        role: ['UTRP Product Lead'],
        githubUsername: 'margaret-ca',
    },
    {
        name: 'Hannah Ha',
        role: ['UTRP Product Lead'],
        githubUsername: 'songhannahha-hub',
    },
    {
        name: 'Leslie Looi',
        role: ['UTRP UX Design Lead'],
        githubUsername: 'lesliewlooi',
    },
] as const satisfies TeamMember[];

export type UTRP_LEAD_GITHUB_USERNAMES = (typeof UTRP_LEADS)[number]['githubUsername'];

    export const UTRP_ALUMNI = [
        {
            name: 'Jessica Zhu',
            role: ['LHD Alumni'],
            githubUsername: 'zhuujessica',
        },
        {
            name: 'Vivek Malle',
            role: ['LHD Alumni'],
            githubUsername: 'vivek12311',
        },
    ] as const satisfies TeamMember[];

    export type UTRP_ALUMNI_GITHUB_USERNAMES = (typeof UTRP_ALUMNI)[number]['githubUsername'];

/**
 * Service for fetching GitHub statistics.
 */
export class GitHubStatsService {
    private async fetchWithRetry<T>(fetchFn: () => Promise<T>, retries = 3, delay = 5000): Promise<T> {
        try {
            return await fetchFn();
            // biome-ignore lint/suspicious/noExplicitAny: TODO: type the error properly
        } catch (error: any) {
            if (retries > 0 && error.status === 202) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.fetchWithRetry(fetchFn, retries - 1, delay);
            }
            throw error;
        }
    }

    private async fetchGitHub(route: string): Promise<unknown> {
        try {
            const url = new URL(route, 'https://github.cachedapi.com');
            const response = await fetch(url);
            return await response.json();
        } catch {
            const url = new URL(route, 'https://api.github.com');
            const response = await fetch(url);
            return await response.json();
        }
    }

    private async fetchContributorStats(): Promise<Record<string, GitHubStats>> {
        const cached = await CacheStore.get('githubStats');
        if (cached && Date.now() - cached.dataFetched < CACHE_TTL) {
            return cached.data;
        }

        const data = await this.fetchWithRetry(() => this.fetchGitHub(CONTRIBUTORS_API_ROUTE));
        if (!Array.isArray(data)) throw new Error('Invalid response format');

        const stats: Record<string, GitHubStats> = {};
        for (const stat of data as ContributorStats[]) {
            stats[stat.author.login] = {
                commits: stat.total,
                linesAdded: stat.weeks.reduce((sum, w) => sum + w.a, 0),
                linesDeleted: stat.weeks.reduce((sum, w) => sum + w.d, 0),
            };
        }

        await CacheStore.set('githubStats', {
            data: stats,
            dataFetched: Date.now(),
        });
        return stats;
    }

    private async fetchContributorNames(usernames: string[]): Promise<Record<string, string>> {
        const cached = await CacheStore.get('githubNames');
        if (cached && Date.now() - cached.dataFetched < CACHE_TTL) {
            return cached.data;
        }

        const names: Record<string, string> = {};
        await Promise.all(
            usernames.map(async username => {
                try {
                    const data = (await this.fetchWithRetry(() =>
                        this.fetchGitHub(`/users/${username}`)
                    )) as ContributorUser;
                    names[username] = data.name || `@${username}`;
                } catch {
                    names[username] = `@${username}`;
                }
            })
        );

        await CacheStore.set('githubNames', {
            data: names,
            dataFetched: Date.now(),
        });
        return names;
    }

    public async fetchGitHubStats(): Promise<GitHubStatsResult> {
        const allStats = await this.fetchContributorStats();

        const adminGitHubStats: Record<string, GitHubStats> = {};
        const userGitHubStats: Record<string, GitHubStats> = {};
        for (const [login, stats] of Object.entries(allStats)) {
            if (LONGHORN_DEVELOPERS_ADMINS.some(admin => admin.githubUsername === login)) {
                adminGitHubStats[login] = stats;
            } else {
                userGitHubStats[login] = stats;
            }
        }

        const names = await this.fetchContributorNames(Object.keys(allStats));
        return { adminGitHubStats, userGitHubStats, names };
    }
}
