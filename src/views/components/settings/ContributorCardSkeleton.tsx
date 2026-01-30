import React from 'react';

/**
 * Lightweight skeleton placeholder for contributor cards while data loads
 */
export const ContributorCardSkeleton: React.FC = () => (
    <div className='animate-pulse border border-gray-300 rounded bg-ut-gray/10 p-4'>
        <div className='mb-2 h-4 w-3/4 rounded bg-gray-300' />
        <div className='mb-1 h-3 w-1/2 rounded bg-gray-300' />
        <div className='h-3 w-1/4 rounded bg-gray-300' />
    </div>
);

export default ContributorCardSkeleton;
