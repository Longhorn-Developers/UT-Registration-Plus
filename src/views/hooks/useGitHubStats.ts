import { useEffect, useState } from 'react';

type TeamMember = {
    name: string;
    role: string;
    githubUsername: string;
};

type GitHubStats = {
    commits: number;
    linesAdded: number;
    linesDeleted: number;
    mergedPRs: number;
};

type UserStat = {
    author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    };
    total: number;
    weeks: {
        w: number;
        a: number;
        d: number;
        c: number;
    }[];
};

export const LONGHORN_DEVELOPERS_ADMINS = [
    { name: 'Sriram Hariharan', role: 'Founder', githubUsername: 'sghsri' },
    { name: 'Elie Soloveichik', role: 'Senior Software Engineer', githubUsername: 'Razboy20' },
    { name: 'Diego Perez', role: 'Senior Software Engineer', githubUsername: 'doprz' },
    { name: 'Lukas Zenick', role: 'Senior Software Engineer', githubUsername: 'Lukas-Zenick' },
    { name: 'Isaiah Rodriguez', role: 'Chief Design Officer', githubUsername: 'IsaDavRod' },
] as const satisfies TeamMember[];

type LD_ADMIN_GITHUB_USERNAMES = (typeof LONGHORN_DEVELOPERS_ADMINS)[number]['githubUsername'];

/**
 * Custom hook that fetches GitHub user statistics for a given repository.
 *
 * @param showGitHubStats - A boolean indicating whether to fetch and display GitHub statistics.
 * @param longhornDevelopersAdmins - An array of TeamMember objects representing the admins of the Longhorn Developers team.
 * @returns An object containing the GitHub statistics for admins and users, as well as the list of contributors.
 */
export function useGitHubStats(showGitHubStats: boolean) {
    const [adminGitHubStats, setAdminGitHubStats] = useState<Record<string, GitHubStats>>({});
    const [userGitHubStats, setUserGitHubStats] = useState<Record<string, GitHubStats>>({});
    const [contributors, setContributors] = useState<string[]>([]);

    useEffect(() => {
        const fetchContributors = async () => {
            try {
                const response = await fetch(
                    'https://api.github.com/repos/Longhorn-Developers/UT-Registration-Plus/contributors'
                );
                const data = await response.json();
                const adminUsernames = LONGHORN_DEVELOPERS_ADMINS.map(admin => admin.githubUsername);
                const contributorNames = data
                    .map((contributor: { login: string }) => contributor.login)
                    .filter((name: string) => !adminUsernames.includes(name as LD_ADMIN_GITHUB_USERNAMES));
                setContributors(contributorNames);
            } catch (error) {
                console.error('Error fetching contributors:', error);
            }
        };

        fetchContributors();
    }, []);

    useEffect(() => {
        if (showGitHubStats) {
            const fetchStats = async () => {
                const adminStats: Record<string, GitHubStats> = {};
                const userStats: Record<string, GitHubStats> = {};

                try {
                    const response = await fetch(
                        `https://api.github.com/repos/Longhorn-Developers/UT-Registration-Plus/stats/contributors`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (!Array.isArray(data)) {
                        throw new Error('Unexpected response format');
                    }

                    for (const l_stat of data) {
                        // narrow type to UserStat
                        const stat = l_stat as UserStat;

                        const isAdmin = LONGHORN_DEVELOPERS_ADMINS.some(
                            admin => admin.githubUsername === stat.author.login
                        );
                        const statsObject = isAdmin ? adminStats : userStats;

                        const totalLinesAdded = stat.weeks.reduce(
                            (total: number, week: { a: number }) => total + week.a,
                            0
                        );
                        const totalLinesDeleted = stat.weeks.reduce(
                            (total: number, week: { d: number }) => total + week.d,
                            0
                        );

                        // eslint-disable-next-line no-await-in-loop
                        const prResponse = await fetch(
                            `https://api.github.com/search/issues?q=org:Longhorn-Developers%20author:${stat.author.login}%20type:pr%20is:merged`
                        );
                        if (!prResponse.ok) {
                            console.error(`Error fetching PRs for GitHub user: ${stat.author.login}:`, prResponse);
                            throw new Error(`HTTP error! status: ${prResponse.status}`);
                        }
                        // eslint-disable-next-line no-await-in-loop
                        const prData = await prResponse.json();

                        statsObject[stat.author.login] = {
                            commits: stat.total,
                            linesAdded: totalLinesAdded,
                            linesDeleted: totalLinesDeleted,
                            mergedPRs: prData.total_count || 0,
                        };
                    }
                } catch (error) {
                    console.error('Error fetching stats:', error);
                }

                setAdminGitHubStats(adminStats);
                setUserGitHubStats(userStats);
            };

            fetchStats();
        }
    }, [showGitHubStats]);

    return { adminGitHubStats, userGitHubStats, contributors };
}
