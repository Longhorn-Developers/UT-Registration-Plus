import React from 'react';

import { graphNodes } from './graphNodes';
import { isValidNode, PIXELS_TO_FEET, WALKING_SPEED } from './types';

type PathStatsProps = {
    startId: string;
    endId: string;
};

/**
 * Calculates the direct path statistics between two nodes.
 *
 * @param startId - The ID of the starting node.
 * @param endId - The ID of the ending node.
 *
 * @returns The distance in feet and walking time in minutes between the two nodes.
 */
export const calcDirectPathStats = ({ startId, endId }: PathStatsProps) => {
    const startNode = graphNodes[startId];
    const endNode = graphNodes[endId];

    if (!isValidNode(startNode) || !isValidNode(endNode)) {
        return null;
    }

    // Calculate distance in pixels
    const distanceInPixels = Math.sqrt((endNode.x - startNode.x) ** 2 + (endNode.y - startNode.y) ** 2);

    // Convert to feet and calculate time
    const distanceInFeet = Math.round(distanceInPixels * PIXELS_TO_FEET);
    const walkingTimeMinutes = Math.ceil(distanceInFeet / WALKING_SPEED);

    return {
        distanceInFeet,
        walkingTimeMinutes,
    };
};

/**
 * Component to display statistics about a path between two nodes on a map.
 *
 * @param startId - The ID of the starting node.
 * @param endId - The ID of the ending node.
 *
 * @returns A JSX element displaying the path statistics, or null if the nodes are invalid.
 */
export const PathStats = ({ startId, endId }: PathStatsProps): JSX.Element | null => {
    const startNode = graphNodes[startId];
    const endNode = graphNodes[endId];

    if (!isValidNode(startNode) || !isValidNode(endNode)) {
        return null;
    }

    // Calculate distance in pixels
    const distanceInPixels = Math.sqrt((endNode.x - startNode.x) ** 2 + (endNode.y - startNode.y) ** 2);

    // Convert to feet and calculate time
    const distanceInFeet = Math.round(distanceInPixels * PIXELS_TO_FEET);
    const walkingTimeMinutes = Math.ceil(distanceInFeet / WALKING_SPEED);

    return (
        <div className='rounded-md bg-white/90 p-3 shadow-sm space-y-2'>
            <h3 className='text-sm font-medium'>Path Statistics</h3>
            <div className='space-y-1'>
                <div className='flex justify-between text-xs'>
                    <span>Distance:</span>
                    <span className='font-medium'>{distanceInFeet} ft</span>
                </div>
                <div className='flex justify-between text-xs'>
                    <span>Walking Time:</span>
                    <span className='font-medium'>{walkingTimeMinutes} min</span>
                </div>
                <div className='flex justify-between text-xs'>
                    <span>From:</span>
                    <span className='font-medium'>{startId}</span>
                </div>
                <div className='flex justify-between text-xs'>
                    <span>To:</span>
                    <span className='font-medium'>{endId}</span>
                </div>
            </div>
        </div>
    );
};
