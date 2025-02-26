import React, { useState } from 'react';

interface DevTogglesProps {
    dynamicRendering: boolean;
    showBuildings: boolean;
    showIntersections: boolean;
    showWalkways: boolean;
    showBuildingText: boolean;
    showPrioritizedOnly: boolean;
    onToggleDynamicRendering: () => void;
    onToggleBuildings: () => void;
    onToggleIntersections: () => void;
    onToggleWalkways: () => void;
    onToggleBuildingText: () => void;
    onTogglePrioritizedOnly: () => void;
}

/**
 * DevToggles component allows developers to toggle visibility of map elements.
 *
 * @param dynamicRendering - Whether to enable dynamic rendering.
 * @param showBuildings - Whether to show buildings on the map.
 * @param showIntersections - Whether to show intersections on the map.
 * @param showWalkways - Whether to show walkways on the map.
 * @param onToggleDynamicRendering - Callback function to toggle dynamic rendering.
 * @param onToggleBuildings - Callback function to toggle buildings visibility.
 * @param onToggleIntersections - Callback function to toggle intersections visibility.
 * @param onToggleWalkways - Callback function to toggle walkways visibility.
 *
 * @returns The rendered DevToggles component.
 */
export default function DevToggles({
    dynamicRendering,
    showBuildings,
    showIntersections,
    showWalkways,
    showBuildingText,
    showPrioritizedOnly,
    onToggleDynamicRendering,
    onToggleBuildings,
    onToggleIntersections,
    onToggleWalkways,
    onToggleBuildingText,
    onTogglePrioritizedOnly,
}: DevTogglesProps): JSX.Element {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    return (
        <div className='flex flex-col gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
            <div className='flex items-center justify-between text-xs text-gray-700 font-semibold'>
                <span>Dev Controls</span>
                <button
                    onClick={() => setIsCollapsed(prev => !prev)}
                    className='ml-2 p-1 text-gray-500 hover:text-gray-800'
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='14'
                        height='14'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        {isCollapsed ? <polyline points='6 9 12 15 18 9' /> : <polyline points='18 15 12 9 6 15' />}
                    </svg>
                </button>
            </div>
            {!isCollapsed && (
                <div className='flex flex-col gap-1'>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={dynamicRendering} onChange={onToggleDynamicRendering} />
                        Dynamic Rendering
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={showBuildings} onChange={onToggleBuildings} />
                        Show Buildings
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={showBuildingText} onChange={onToggleBuildingText} />
                        Show Building Text
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={showPrioritizedOnly} onChange={onTogglePrioritizedOnly} />
                        Prioritized Buildings Only
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={showIntersections} onChange={onToggleIntersections} />
                        Show Intersections
                    </label>
                    <label className='flex cursor-pointer items-center gap-2 text-xs'>
                        <input type='checkbox' checked={showWalkways} onChange={onToggleWalkways} />
                        Show Walkways
                    </label>
                </div>
            )}
        </div>
    );
}
