import React from 'react';

import { PathFinder } from './PathFinder';
import { type Graph, isValidNode, type NodeId } from './types';

// React component for rendering paths
type PathProps = {
    startId: NodeId;
    endId: NodeId;
    graph: Graph;
    color: string;
    className?: string;
};

export const Path = ({ startId, endId, graph, color, className = '' }: PathProps): JSX.Element | null => {
    try {
        const pathFinder = new PathFinder(graph);
        const path = pathFinder.findPath(startId, endId);

        return (
            <>
                {path.slice(0, -1).map((nodeId, index) => {
                    const nextNodeId = path[index + 1];
                    if (!nextNodeId) return null;

                    const start = graph[nodeId];
                    const end = graph[nextNodeId];

                    if (!isValidNode(start) || !isValidNode(end)) return null;

                    return (
                        <line
                            key={`${nodeId}-${nextNodeId}`}
                            x1={start.x}
                            y1={start.y}
                            x2={end.x}
                            y2={end.y}
                            strokeLinecap='round'
                            stroke={color}
                            // TODO: use clsx
                            className={`stroke-8 ${className} opacity-50`}
                        />
                    );
                })}
            </>
        );
    } catch (error) {
        console.error('Error rendering path:', error instanceof Error ? error.message : 'Unknown error');
        return null;
    }
};
