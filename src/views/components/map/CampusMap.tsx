/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '../common/Button';
import { graphNodes } from './graphNodes';
import type { ProcessInPersonMeetings } from './Map';
import { Path } from './Path';
import { calcDirectPathStats, PathStats } from './PathStats';
import type { DayCode, NodeId, NodeType } from './types';
import { DAY_MAPPING } from './types';
import { getMidpoint } from './utils';

// Image: 783x753
const UTMapURL = new URL('/src/assets/UT-Map.svg', import.meta.url).href;

const minZoom = 0.5;
const maxZoom = 5;
const zoomStep = 1.2;

type SelectedBuildings = {
    start: NodeId | null;
    end: NodeId | null;
};

interface DaySelectorProps {
    selectedDay: DayCode | null;
    onDaySelect: (day: DayCode) => void;
}

/**
 * DaySelector component allows users to select a day from a list of days.
 *
 * @param selectedDay - The currently selected day.
 * @param onDaySelect - Callback function to handle day selection.
 *
 * @returns The rendered DaySelector component.
 */
const DaySelector = ({ selectedDay, onDaySelect }: DaySelectorProps): JSX.Element => (
    <div className='flex gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
        {(Object.keys(DAY_MAPPING) as DayCode[]).map(day => (
            <Button
                key={day}
                onClick={() => onDaySelect(day)}
                color='ut-burntorange'
                variant={selectedDay === day ? 'filled' : 'minimal'}
                size='mini'
                className='px-3 py-1'
            >
                {day}
            </Button>
        ))}
    </div>
);

interface DevTogglesProps {
    showBuildings: boolean;
    showIntersections: boolean;
    showWalkways: boolean;
    onToggleBuildings: () => void;
    onToggleIntersections: () => void;
    onToggleWalkways: () => void;
}

/**
 * DevToggles component allows developers to toggle visibility of map elements.
 *
 * @param showBuildings - Whether to show buildings on the map.
 * @param showIntersections - Whether to show intersections on the map.
 * @param showWalkways - Whether to show walkways on the map.
 * @param onToggleBuildings - Callback function to toggle buildings visibility.
 * @param onToggleIntersections - Callback function to toggle intersections visibility.
 * @param onToggleWalkways - Callback function to toggle walkways visibility.
 *
 * @returns The rendered DevToggles component.
 */
const DevToggles = ({
    showBuildings,
    showIntersections,
    showWalkways,
    onToggleBuildings,
    onToggleIntersections,
    onToggleWalkways,
}: DevTogglesProps): JSX.Element => (
    <div className='flex flex-col gap-2 rounded-md bg-white/90 p-2 shadow-sm'>
        <div className='text-xs text-gray-700 font-semibold'>Dev Controls</div>
        <div className='flex flex-col gap-1'>
            <label className='flex cursor-pointer items-center gap-2 text-xs'>
                <input type='checkbox' checked={showBuildings} onChange={onToggleBuildings} />
                Show Buildings
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
    </div>
);

/**
 * TimeWarningLabel component that renders a warning label on a map.
 * The label consists of a circle with a text inside it, indicating the number of minutes.
 *
 * @param x - The x-coordinate for the center of the circle.
 * @param y - The y-coordinate for the center of the circle.
 * @param minutes - The number of minutes to display inside the circle.
 * @returns A JSX element representing the warning label.
 */
const TimeWarningLabel = ({ x, y, minutes }: { x: number; y: number; minutes: number }): JSX.Element => (
    <g>
        <circle cx={x} cy={y} r={12} fill='white' stroke='#FF4444' strokeWidth={2} />
        <text x={x} y={y} textAnchor='middle' dominantBaseline='middle' fill='#FF4444' fontSize='10' fontWeight='bold'>
            {minutes}&apos;
        </text>
    </g>
);

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
const ZoomPanControls = ({ zoomIn, zoomOut, resetZoomPan, zoomLevel }: ZoomPanControlsProps): JSX.Element => (
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

type CampusMapProps = {
    processedCourses: ProcessInPersonMeetings[];
};

/**
 * Component representing the campus map with interactive features.
 *
 * @param processedCourses - Array of processed courses.
 * @returns The rendered CampusMap component.
 *
 * @remarks
 * This component renders a map of the campus with interactive features such as:
 * - Selecting buildings to create a path.
 * - Displaying daily paths between sequential classes.
 * - Highlighting paths with less than 15 minutes transition time.
 * - Zooming and panning the map.
 * - Toggling visibility of different map elements.
 *
 * The rendered output includes:
 * - An image of the campus map.
 * - An SVG overlay with paths and buildings.
 * - Controls for selecting the day and displaying path information.
 * - Dev controls for toggling element visibility.
 * - Zoom and pan controls.
 */
export default function CampusMap({ processedCourses }: CampusMapProps): JSX.Element {
    // Core state
    const [selected, setSelected] = useState<SelectedBuildings>({
        start: null,
        end: null,
    });
    const [selectedDay, setSelectedDay] = useState<DayCode | null>(null);
    const [hoveredPathIndex, setHoveredPathIndex] = useState<number | null>(null);
    const [toggledPathIndex, setToggledPathIndex] = useState<number | null>(null);

    // Dev toggle state
    const [showBuildings, setShowBuildings] = useState<boolean>(true);
    const [showIntersections, setShowIntersections] = useState<boolean>(true);
    const [showWalkways, setShowWalkways] = useState<boolean>(false);

    // Zoom and pan state
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Refs
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Zoom and pan handlers
    const handleZoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(prev * zoomStep, maxZoom)); // Limit max zoom
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(prev / zoomStep, minZoom)); // Limit min zoom
    }, []);

    const handleResetZoomPan = useCallback(() => {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoomLevel(prev => Math.min(prev * zoomStep, maxZoom)); // Zoom in, limit max zoom
        } else {
            setZoomLevel(prev => Math.max(prev / zoomStep, minZoom)); // Zoom out, limit min zoom
        }
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button !== 0) return; // Only handle left mouse button
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;

            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;

            setPanPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setDragStart({ x: e.clientX, y: e.clientY });
        },
        [isDragging, dragStart]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Path calculations
    const getDailyPaths = useCallback((courses: ProcessInPersonMeetings[]) => {
        const sortedCourses = [...courses].sort((a, b) => a.normalizedStartTime - b.normalizedStartTime);

        const paths = [];

        for (let i = 0; i < sortedCourses.length - 1; i++) {
            const currentCourse = sortedCourses[i];
            const nextCourse = sortedCourses[i + 1];

            if (currentCourse && nextCourse && currentCourse.location?.building && nextCourse.location?.building) {
                paths.push({
                    start: currentCourse.location.building,
                    end: nextCourse.location.building,
                    startTime: currentCourse.normalizedEndTime,
                    endTime: nextCourse.normalizedStartTime,
                    colors: currentCourse.colors,
                    startCourseName: currentCourse.fullName,
                    endCourseName: nextCourse.fullName,
                });
            }
        }

        return paths;
    }, []);

    const relevantPaths = useMemo(() => {
        if (!selectedDay) return [];

        const coursesForDay = processedCourses.filter(course => course.day === DAY_MAPPING[selectedDay]);

        const paths = getDailyPaths(coursesForDay);

        return paths.map(path => ({
            ...path,
            timeBetweenClasses: Math.floor(path.endTime - path.startTime),
        }));
    }, [selectedDay, processedCourses, getDailyPaths]);

    // Event handlers
    const handleDaySelect = useCallback((day: DayCode) => {
        setSelectedDay(prevDay => (prevDay === day ? null : day));
        setHoveredPathIndex(null);
        setToggledPathIndex(null);
    }, []);

    const handleBuildingSelect = useCallback((buildingId: NodeId) => {
        setSelected(prev => {
            if (!prev.start) return { ...prev, start: buildingId };
            if (!prev.end) return { ...prev, end: buildingId };
            return { start: buildingId, end: null };
        });
    }, []);

    const handlePathClick = useCallback((index: number) => {
        setToggledPathIndex(prevIndex => (prevIndex === index ? null : index));
    }, []);

    const shouldShowNode = useCallback(
        (type: NodeType): boolean => {
            switch (type) {
                case 'building':
                    return showBuildings;
                case 'intersection':
                    return showIntersections;
                case 'walkway':
                    return showWalkways;
                default:
                    return false;
            }
        },
        [showBuildings, showIntersections, showWalkways]
    );

    const shouldShowPath = useCallback(
        (index: number) => {
            if (hoveredPathIndex !== null) {
                return hoveredPathIndex === index;
            }
            if (toggledPathIndex !== null) {
                return toggledPathIndex === index;
            }
            return true;
        },
        [hoveredPathIndex, toggledPathIndex]
    );

    // Global mouse up handler
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    return (
        <div className='relative h-full w-full overflow-hidden' ref={mapContainerRef}>
            {/* Map container with zoom and pan applied */}
            <div
                className={`relative h-full w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {/* Map Image */}
                <img src={UTMapURL} alt='UT Campus Map' className='h-full w-full object-contain' draggable={false} />

                {/* SVG Overlay - ensuring it matches the image dimensions */}
                <svg
                    className='absolute left-0 top-0 h-full w-full'
                    viewBox='0 0 783 753'
                    preserveAspectRatio='xMidYMid meet'
                >
                    {/* Render buildings, intersections, and walkways */}
                    {Object.entries(graphNodes).map(
                        ([id, node]) =>
                            shouldShowNode(node.type) && (
                                <g key={id}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={node.type === 'building' ? 6 : 4}
                                        fill={
                                            id === selected.start
                                                ? '#579D42'
                                                : id === selected.end
                                                  ? '#D10000'
                                                  : node.type === 'building'
                                                    ? '#BF5700'
                                                    : node.type === 'intersection'
                                                      ? '#9CADB7'
                                                      : '#D6D2C400'
                                        }
                                        stroke={node.type !== 'walkway' ? 'white' : 'green'}
                                        strokeWidth='2'
                                        className='cursor-pointer opacity-90'
                                        onClick={() => handleBuildingSelect(id)}
                                    />
                                    {node.type === 'building' && (
                                        <text
                                            x={node.x + 12}
                                            y={node.y + 4}
                                            fill='#000000'
                                            fontSize='14'
                                            className='font-bold'
                                        >
                                            {id}
                                        </text>
                                    )}
                                </g>
                            )
                    )}

                    {/* Render daily schedule paths */}
                    {relevantPaths.map(
                        (path, index) =>
                            shouldShowPath(index) && (
                                // eslint-disable-next-line react/no-array-index-key
                                <g key={`${path.start}-${path.end}-${index}`}>
                                    <Path
                                        startId={path.start}
                                        endId={path.end}
                                        graph={graphNodes}
                                        color={path.colors?.primaryColor || '#BF5700'}
                                        className='stroke-4 opacity-50 transition-opacity duration-300 hover:opacity-80'
                                    />
                                    {path.timeBetweenClasses < 15 &&
                                        (() => {
                                            const midpoint = getMidpoint(path.start, path.end);
                                            return midpoint ? (
                                                <TimeWarningLabel
                                                    x={midpoint.x}
                                                    y={midpoint.y}
                                                    minutes={path.timeBetweenClasses}
                                                />
                                            ) : null;
                                        })()}
                                </g>
                            )
                    )}

                    {/* Render user-selected path */}
                    {selected.start && selected.end && (
                        <Path
                            startId={selected.start}
                            endId={selected.end}
                            graph={graphNodes}
                            color='#BF5700'
                            className='opacity-75 transition-opacity duration-300 hover:opacity-100'
                        />
                    )}
                </svg>
            </div>

            {/* Fixed position controls that don't move with zoom/pan */}
            <div className='absolute left-8 top-8 z-10 flex flex-col gap-4'>
                {/* Day Selector - now positioned separately from the dynamic controls */}
                <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

                {/* Zoom and Pan Controls */}
                <ZoomPanControls
                    zoomIn={handleZoomIn}
                    zoomOut={handleZoomOut}
                    resetZoomPan={handleResetZoomPan}
                    zoomLevel={zoomLevel}
                />

                {/* Dev Toggles */}
                <DevToggles
                    showBuildings={showBuildings}
                    showIntersections={showIntersections}
                    showWalkways={showWalkways}
                    onToggleBuildings={() => setShowBuildings(prev => !prev)}
                    onToggleIntersections={() => setShowIntersections(prev => !prev)}
                    onToggleWalkways={() => setShowWalkways(prev => !prev)}
                />
            </div>

            {/* Path information - now separate from day selector to avoid movement */}
            <div className='absolute right-8 top-8 z-10 max-h-[calc(100vh-120px)] flex flex-col gap-4 overflow-y-auto'>
                {/* Path Statistics - show when a path is selected */}
                {selected.start && selected.end && <PathStats startId={selected.start} endId={selected.end} />}

                {/* Daily Paths Statistics - show when day is selected */}
                {relevantPaths.length > 0 && (
                    <div className='rounded-md bg-white/90 p-3 shadow-sm'>
                        <div className='mb-2'>
                            <p className='text-sm font-medium'>Daily Transitions</p>
                            <p className='text-xs text-gray-600'>
                                Total time:{' '}
                                {relevantPaths.reduce(
                                    (total, path) =>
                                        total +
                                        (calcDirectPathStats({ startId: path.start, endId: path.end })
                                            ?.walkingTimeMinutes || 0),
                                    0
                                )}{' '}
                                min
                            </p>
                            <p className='text-xs text-gray-600'>
                                Total distance:{' '}
                                {relevantPaths.reduce(
                                    (total, path) =>
                                        total +
                                        (calcDirectPathStats({ startId: path.start, endId: path.end })
                                            ?.distanceInFeet || 0),
                                    0
                                )}{' '}
                                ft
                            </p>
                        </div>
                        <div className='space-y-4'>
                            {relevantPaths.map((path, index) => (
                                <div
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`path-info-${index}`}
                                    className={`cursor-pointer space-y-1 text-xs transition-colors duration-200 ${
                                        toggledPathIndex === index ? 'bg-gray-100' : ''
                                    }`}
                                    style={{
                                        borderLeft: `3px solid ${path.colors?.primaryColor || '#BF5700'}`,
                                    }}
                                    onMouseEnter={() => setHoveredPathIndex(index)}
                                    onMouseLeave={() => setHoveredPathIndex(null)}
                                    onClick={() => handlePathClick(index)}
                                >
                                    <p className='ml-2'>{path.startCourseName}</p>
                                    <p className='ml-2'>
                                        (
                                        {
                                            calcDirectPathStats({ startId: path.start, endId: path.end })
                                                ?.walkingTimeMinutes
                                        }{' '}
                                        min,{' '}
                                        {calcDirectPathStats({ startId: path.start, endId: path.end })?.distanceInFeet}{' '}
                                        ft)
                                        {' - '}
                                        {path.timeBetweenClasses} min transition
                                        {path.timeBetweenClasses < 15 && ' ⚠️'}
                                    </p>
                                    <p className='ml-2'>{path.endCourseName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
