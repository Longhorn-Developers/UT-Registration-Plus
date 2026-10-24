import type React from 'react';

/**
 * Lightweight skeleton placeholder for contributor cards while data loads
 */
export const ContributorCardSkeleton: React.FC = () => (
    <div className='animate-pulse border border-divider rounded bg-ut-gray/10 p-4'>
        <div className='mb-2 h-4 w-3/4 rounded bg-surface-raised' />
        <div className='mb-1 h-3 w-1/2 rounded bg-surface-raised' />
        <div className='h-3 w-1/4 rounded bg-surface-raised' />
    </div>
);

export default ContributorCardSkeleton;
