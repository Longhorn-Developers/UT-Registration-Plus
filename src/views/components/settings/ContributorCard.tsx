import Text from '@views/components/common/Text/Text';
import type React from 'react';

interface ContributorCardProps {
    name: string;
    githubUsername: string;
    roles: string[];
    stats?: {
        commits: number;
        linesAdded: number;
        linesDeleted: number;
        mergedPRs?: number;
    };
    showStats: boolean;
    includeMergedPRs: boolean;
    personalWebsite?: string;
}

/**
 * GitHub contributor card component
 */
export const ContributorCard: React.FC<ContributorCardProps> = ({
    name,
    githubUsername,
    roles,
    stats,
    showStats,
    includeMergedPRs,
    personalWebsite,
}) => {
    const openLink = () => {
        const website = personalWebsite?.trim();
        const url = website
            ? website.match(/^https?:\/\//i)
                ? website
                : `https://${website}`
            : `https://github.com/${githubUsername}`;
        window.open(url, '_blank');
    };

    return (
        <div className='border border-gray-300 rounded bg-ut-gray/10 p-4'>
            <button type='button' onClick={openLink} className='cursor-pointer bg-transparent p-0'>
                <Text variant='p' className='text-ut-burntorange font-semibold'>
                    {name}
                </Text>
            </button>
            {roles.map(role => (
                <p key={`${githubUsername}-${role}`} className='text-sm text-gray-600'>
                    {role}
                </p>
            ))}
            {showStats && stats && (
                <div className='mt-2'>
                    <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                    {includeMergedPRs && stats.mergedPRs !== undefined && (
                        <p className='text-xs'>Merged PRs: {stats.mergedPRs}</p>
                    )}
                    <p className='text-xs'>Commits: {stats.commits}</p>
                    <p className='text-xs text-ut-green'>{stats.linesAdded}++</p>
                    <p className='text-xs text-theme-red'>{stats.linesDeleted}--</p>
                </div>
            )}
        </div>
    );
};
