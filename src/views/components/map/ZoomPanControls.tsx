import React from 'react';

import { Button } from '../common/Button';

interface ZoomPanControlsProps {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoomPan: () => void;
    zoomLevel: number;
}

/**
 * ZoomPanControls component provides buttons for zooming and panning.
 *
 * @param zoomIn - Function to zoom in the map.
 * @param zoomOut - Function to zoom out the map.
 * @param resetZoomPan - Function to reset zoom and pan to default.
 * @param zoomLevel - Current zoom level.
 *
 * @returns The rendered ZoomPanControls component.
 */
export default function ZoomPanControls({
    zoomIn,
    zoomOut,
    resetZoomPan,
    zoomLevel,
}: ZoomPanControlsProps): JSX.Element {
    return (
        <div className='flex gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
            <Button onClick={zoomIn} color='ut-burntorange' variant='minimal' size='mini' className='px-3 py-1'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <circle cx='11' cy='11' r='8' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                    <line x1='11' y1='8' x2='11' y2='14' />
                    <line x1='8' y1='11' x2='14' y2='11' />
                </svg>
            </Button>
            <Button onClick={zoomOut} color='ut-burntorange' variant='minimal' size='mini' className='px-3 py-1'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <circle cx='11' cy='11' r='8' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                    <line x1='8' y1='11' x2='14' y2='11' />
                </svg>
            </Button>
            <Button onClick={resetZoomPan} color='ut-burntorange' variant='minimal' size='mini' className='px-3 py-1'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
                    <polyline points='9 22 9 12 15 12 15 22' />
                </svg>
            </Button>
            <span className='flex items-center text-xs font-medium'>{Math.round(zoomLevel * 100)}%</span>
        </div>
    );
}
