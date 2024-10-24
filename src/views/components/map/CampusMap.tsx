/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import Divider from '../common/Divider';
import { getAllBuildings, graphNodes, isBuilding } from './mapUtils';
import { type NodeId, Path } from './pathFinding';

// Image: 784x754
const UTMapURL = new URL('/src/assets/UT-Map.png', import.meta.url).href;

type SelectedBuildings = {
    start: NodeId | null;
    end: NodeId | null;
};

export default function CampusMap() {
    const [selected, setSelected] = useState<SelectedBuildings>({
        start: null,
        end: null,
    });

    // const buildings = Object.entries(graphNodes)
    //     .filter(([_, node]) => node.type === 'building')
    //     .map(([id]) => id);

    // const handleBuildingSelect = (buildingId: NodeId) => {
    //     setSelected(prev => {
    //         if (!prev.start) return { ...prev, start: buildingId };
    //         if (!prev.end) return { ...prev, end: buildingId };
    //         return { start: buildingId, end: null };
    //     });
    // };

    // Type-safe way to get all buildings
    const buildings = getAllBuildings(graphNodes);

    const handleBuildingSelect = (buildingId: NodeId) => {
        // Type-safe validation
        if (!isBuilding(buildingId, graphNodes)) {
            console.error('Invalid building selected:', buildingId);
            return;
        }

        setSelected(prev => {
            if (!prev.start) return { ...prev, start: buildingId };
            if (!prev.end) return { ...prev, end: buildingId };
            return { start: buildingId, end: null };
        });
    };

    return (
        <div className='relative h-full w-full'>
            <img src={UTMapURL} alt='UT Campus Map' className='h-full w-full object-contain' />

            <svg className='absolute left-0 top-0 h-full w-full' viewBox='0 0 784 754' preserveAspectRatio='none'>
                {/* Render path if both buildings are selected */}
                {selected.start && selected.end && (
                    <Path
                        startId={selected.start}
                        endId={selected.end}
                        graph={graphNodes}
                        className='opacity-75 transition-opacity duration-300 hover:opacity-100'
                    />
                )}

                {/* Render nodes */}
                {Object.entries(graphNodes).map(([id, node]) => (
                    <g key={id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.type === 'building' ? 6 : 4}
                            fill={
                                id === selected.start
                                    ? '#00FF00'
                                    : id === selected.end
                                      ? '#FF0000'
                                      : node.type === 'building'
                                        ? '#BF5700'
                                        : '#666666'
                            }
                            stroke='white'
                            strokeWidth='2'
                            className='opacity-90'
                            onClick={() => {
                                if (node.type === 'building') {
                                    handleBuildingSelect(id);
                                }
                            }}
                        />

                        {node.type === 'building' && (
                            <text x={node.x + 12} y={node.y + 4} fill='#000000' fontSize='14' className='font-bold'>
                                {id}
                            </text>
                        )}
                    </g>
                ))}
            </svg>

            {/* Building Selection Controls */}
            <div className='absolute right-8 top-8 rounded-md bg-white/90 p-4 shadow-sm space-y-4'>
                <div className='text-sm space-y-1'>
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
                <Divider size='auto' orientation='horizontal' />
                <div className='space-y-4'>
                    <div>
                        <h3 className='text-sm font-medium'>Select Buildings:</h3>
                        <p className='text-xs text-gray-500'>Start: {selected.start || 'Not selected'}</p>
                        <p className='text-xs text-gray-500'>End: {selected.end || 'Not selected'}</p>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        {buildings.map(building => (
                            <button
                                key={building}
                                onClick={() => handleBuildingSelect(building)}
                                className={`text-xs px-2 py-1 rounded ${
                                    selected.start === building || selected.end === building
                                        ? 'bg-ut-burntorange text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                {building}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
