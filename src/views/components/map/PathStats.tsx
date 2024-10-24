import React from 'react';

import type { Graph, NodeId } from './pathFinding';

// Average walking speed in feet per minute
const WALKING_SPEED = 272; // ~3.1 mph

type PathStatisticsProps = {
    path: NodeId[];
    graph: Graph;
};

const calculatePathStatistics = (path: NodeId[], graph: Graph) => {
    let totalDistance = 0;

    // Calculate total distance
    for (let i = 0; i < path.length - 1; i++) {
        const currentNode = graph[path[i]!];
        const nextNode = graph[path[i + 1]!];

        if (currentNode && nextNode) {
            const distance = Math.sqrt((nextNode.x - currentNode.x) ** 2 + (nextNode.y - currentNode.y) ** 2);
            totalDistance += distance;
        }
    }

    // Convert pixel distance to approximate feet (you may need to adjust this factor)
    const pixelsToFeet = 3; // Adjust based on your map scale
    const distanceInFeet = totalDistance * pixelsToFeet;

    // Calculate walking time in minutes
    const walkingTimeMinutes = distanceInFeet / WALKING_SPEED;

    return {
        distanceInFeet: Math.round(distanceInFeet),
        walkingTimeMinutes: Math.round(walkingTimeMinutes),
    };
};

export const PathStatistics = ({ path, graph }: PathStatisticsProps) => {
    const stats = calculatePathStatistics(path, graph);

    return (
        <div className='w-64'>
            <div>
                <p className='text-sm font-medium'>Path Statistics</p>
            </div>
            <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                    <span>Distance:</span>
                    <span className='font-medium'>{stats.distanceInFeet} ft</span>
                </div>
                <div className='flex justify-between text-sm'>
                    <span>Walking Time:</span>
                    <span className='font-medium'>{stats.walkingTimeMinutes} min</span>
                </div>
            </div>
        </div>
    );
};
