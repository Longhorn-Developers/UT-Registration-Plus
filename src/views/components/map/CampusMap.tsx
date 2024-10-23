import React, { useState } from 'react';

import { generateAllBuildingPaths, graphNodes, PathSegment } from './mapUtils';

const UTMapURL = new URL('/src/assets/UT-Map.png', import.meta.url).href;

/**
 * CampusMap component renders an interactive map of the UT campus.
 *
 * The map includes:
 * - An image of the campus map.
 * - An SVG overlay to draw paths and nodes.
 * - Building selection controls to highlight specific paths.
 */
export default function CampusMap() {
    const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

    return (
        <div className='relative h-full w-full'>
            {/* Map Image: 784x754 */}
            <img src={UTMapURL} alt='UT Campus Map' className='h-full w-full object-contain' />

            {/* SVG Overlay */}
            <svg className='absolute left-0 top-0 h-full w-full' viewBox='0 0 784 754' preserveAspectRatio='none'>
                {/* Draw all building-to-building paths */}
                {generateAllBuildingPaths().map(path => (
                    <g key={path.id}>
                        {path.points.slice(0, -1).map((startNode, index) => (
                            <PathSegment
                                key={`${startNode}-${path.points[index + 1]}`}
                                start={startNode}
                                end={path.points[index + 1] || ''}
                                isHighlighted={highlightedPath.includes(path.id)}
                            />
                        ))}
                    </g>
                ))}

                {/* Draw nodes */}
                {Object.entries(graphNodes).map(([id, node]) => (
                    <g key={id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.type === 'building' ? 6 : 4}
                            fill={node.type === 'building' ? '#BF5700' : '#666666'}
                            stroke='white'
                            strokeWidth='2'
                            className='opacity-90'
                        />

                        {/* Only label buildings */}
                        {node.type === 'building' && (
                            <text x={node.x + 12} y={node.y + 4} fill='#000000' fontSize='14' className='font-bold'>
                                {id}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* Building Selection Controls */}
            <div className='absolute right-8 top-8 h-full h-full rounded-md bg-white/90 p-3 shadow-sm space-y-4'>
                <div className='text-sm space-y-2'>
                    <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full bg-[#BF5700]' />
                        <span>Buildings</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='h-3 w-3 rounded-full bg-[#666666]' />
                        <span>Path Intersections</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='h-1 w-6 bg-[#BF5700]' />
                        <span>Walking Paths</span>
                    </div>
                </div>

                <div className='overflow-y-scroll space-y-2'>
                    <p className='text-sm font-medium'>Building Paths:</p>
                    {generateAllBuildingPaths().map(path => (
                        <button
                            key={path.id}
                            onClick={() => setHighlightedPath([path.id])}
                            className='block text-sm text-gray-600 hover:text-gray-900'
                        >
                            {path.points[0]} → {path.points[path.points.length - 1]}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
