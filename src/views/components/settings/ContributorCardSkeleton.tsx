import React from 'react';

/**
 * Lightweight skeleton placeholder for contributor cards while data loads
 */
export const ContributorCardSkeleton: React.FC = () => (
    <div className='border border-gray-300 rounded bg-ut-gray/10 p-4 animate-pulse'>
        <div className='h-4 w-3/4 bg-gray-300 rounded mb-2' />
        <div className='h-3 w-1/2 bg-gray-300 rounded mb-1' />
        <div className='h-3 w-1/4 bg-gray-300 rounded' />
    </div>
);

export default ContributorCardSkeleton;
