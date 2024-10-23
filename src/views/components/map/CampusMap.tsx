import React, { useCallback, useMemo, useState } from 'react';

import { connectionConfig, findShortestPath, generateConnections, PathSegment, rawGraphNodes } from './mapUtils';

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
    const [selectedPath, setSelectedPath] = useState<string[]>([]);
    const [startBuilding, setStartBuilding] = useState<string>('');
    const [endBuilding, setEndBuilding] = useState<string>('');
    const [allowThroughBuildings, setAllowThroughBuildings] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>('');

    // Generate graph with connections once using useMemo
    const graphNodes = useMemo(() => generateConnections(rawGraphNodes, connectionConfig), []);

    // Function to draw path between buildings
    const drawPathBetweenBuildings = useCallback(
        (start: string, end: string) => {
            if (!start || !end || start === end) {
                setSelectedPath([]);
                setDebugInfo('No path to draw - invalid start/end');
                return;
            }

            try {
                const result = findShortestPath(start, end, graphNodes, allowThroughBuildings);
                setDebugInfo(`Found path: ${result.path.join(' → ')} (distance: ${result.distance.toFixed(2)})`);
                setSelectedPath(result.path);
            } catch (error) {
                setDebugInfo(`Error finding path: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setSelectedPath([]);
            }
        },
        [allowThroughBuildings, graphNodes]
    );

    // Update path when selections change
    React.useEffect(() => {
        drawPathBetweenBuildings(startBuilding, endBuilding);
    }, [startBuilding, endBuilding, allowThroughBuildings, drawPathBetweenBuildings]);

    return (
        <div className='relative h-full w-full'>
            {/* Map Image: 784x754 */}
            <img src={UTMapURL} alt='UT Campus Map' className='h-full w-full object-contain' />

            {/* SVG Overlay */}
            <svg className='absolute left-0 top-0 h-full w-full' viewBox='0 0 784 754' preserveAspectRatio='none'>
                {/* Debug visualization of all connections */}
                {Object.entries(graphNodes).map(([nodeId, node]) =>
                    node.connections.map(connectionId => (
                        <line
                            key={`${nodeId}-${connectionId}`}
                            x1={node.x}
                            y1={node.y}
                            x2={graphNodes[connectionId]?.x || 0}
                            y2={graphNodes[connectionId]?.y || 0}
                            stroke='#dddddd'
                            strokeWidth='1'
                            strokeDasharray='4,4'
                            className='opacity-30'
                        />
                    ))
                )}

                {/* Draw selected path */}
                {selectedPath.length > 1 &&
                    selectedPath
                        .slice(0, -1)
                        .map((nodeId, index) => (
                            <PathSegment
                                key={`path-${nodeId}-${selectedPath[index + 1]}`}
                                start={nodeId}
                                end={selectedPath[index + 1] || ''}
                            />
                        ))}

                {/* Draw nodes */}
                {Object.entries(graphNodes).map(([id, node]) => (
                    <g key={id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.type === 'building' ? 6 : 4}
                            fill={
                                // eslint-disable-next-line no-nested-ternary
                                selectedPath.includes(id) ? '#FF8C00' : node.type === 'building' ? '#BF5700' : '#666666'
                            }
                            stroke='white'
                            strokeWidth='2'
                            className='opacity-90'
                        />

                        {node.type === 'building' && (
                            <text x={node.x + 12} y={node.y + 4} fill='#000000' fontSize='14' className='font-bold'>
                                {id}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* Controls */}
            <div className='absolute right-4 top-4 max-w-xs rounded-md bg-white/90 p-4 shadow-sm space-y-4'>
                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <label className='block text-sm font-medium'>Start Building:</label>
                        <select
                            value={startBuilding}
                            onChange={e => setStartBuilding(e.target.value)}
                            className='w-full border border-gray-300 rounded-md p-1'
                        >
                            <option value=''>Select Building</option>
                            {Object.entries(graphNodes)
                                .filter(([_, node]) => node.type === 'building')
                                .map(([id]) => (
                                    <option key={id} value={id}>
                                        {id}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-sm font-medium'>End Building:</label>
                        <select
                            value={endBuilding}
                            onChange={e => setEndBuilding(e.target.value)}
                            className='w-full border border-gray-300 rounded-md p-1'
                        >
                            <option value=''>Select Building</option>
                            {Object.entries(graphNodes)
                                .filter(([_, node]) => node.type === 'building')
                                .map(([id]) => (
                                    <option key={id} value={id}>
                                        {id}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            id='allowBuildings'
                            checked={allowThroughBuildings}
                            onChange={e => setAllowThroughBuildings(e.target.checked)}
                            className='rounded'
                        />
                        <label htmlFor='allowBuildings' className='text-sm'>
                            Allow paths through buildings
                        </label>
                    </div>

                    {/* Debug info */}
                    {debugInfo && (
                        <div className='rounded bg-gray-100 p-2 text-xs'>
                            <pre className='whitespace-pre-wrap'>{debugInfo}</pre>
                        </div>
                    )}

                    {selectedPath.length > 0 && <div className='text-sm'>Path: {selectedPath.join(' → ')}</div>}
                </div>
            </div>
        </div>
    );
}
