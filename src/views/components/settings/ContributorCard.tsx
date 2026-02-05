import Text from '@views/components/common/Text/Text';
import React from 'react';

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
}) => (
    <div className='border border-gray-300 rounded bg-ut-gray/10 p-4'>
        <Text
            variant='p'
            className='text-ut-burntorange font-semibold hover:cursor-pointer'
            onClick={() => window.open(`https://github.com/${githubUsername}`, '_blank')}
        >
            {name}
        </Text>
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
