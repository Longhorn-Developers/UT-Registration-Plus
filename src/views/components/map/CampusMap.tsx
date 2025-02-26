/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DaySelector from './DaySelector';
import DevToggles from './DevToggles';
import FullscreenButton from './FullscreenButton';
import { graphNodes } from './graphNodes';
import type { ProcessInPersonMeetings } from './Map';
import { Path } from './Path';
import { calcDirectPathStats, PathStats } from './PathStats';
import TimeWarningLabel from './TimeWarningLabel';
import type { DayCode, NodeId, NodeType } from './types';
import { DAY_MAPPING } from './types';
import { getMidpoint } from './utils';
import ZoomPanControls from './ZoomPanControls';

// Image: 783x753
const UTMapURL = new URL('/src/assets/UT-Map.svg', import.meta.url).href;

const minZoom = 0.5;
const maxZoom = 5;
const zoomStep = 1.2;

// Define zoom level thresholds for showing different levels of detail
const ZOOM_LEVELS = {
    LOW: 0.8, // Show minimal buildings at this zoom level and below
    MEDIUM: 1.5, // Show moderate amount of buildings
    HIGH: 2.5, // Show all buildings with full details
} as const;

type SelectedBuildings = {
    start: NodeId | null;
    end: NodeId | null;
};

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
    const [dynamicRendering, setDynamicRendering] = useState<boolean>(true);
    const [showBuildings, setShowBuildings] = useState<boolean>(true);
    const [showBuildingText, setShowBuildingText] = useState<boolean>(true);
    const [showPrioritizedOnly, setShowPrioritizedOnly] = useState<boolean>(false);
    const [showIntersections, setShowIntersections] = useState<boolean>(false);
    const [showWalkways, setShowWalkways] = useState<boolean>(false);

    // Zoom and pan state
    const [zoomLevel, setZoomLevel] = useState<number>(1);
    const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Refs
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Function to calculate the current viewport in SVG coordinates
    const calculateViewport = useCallback(() => {
        if (!mapContainerRef.current) return null;

        const container = mapContainerRef.current;
        const rect = container.getBoundingClientRect();

        // SVG dimensions from viewBox
        const svgWidth = 783;
        const svgHeight = 753;

        // Calculate visible area in SVG coordinates
        const scaleFactor = 1 / zoomLevel;
        const visibleWidth = rect.width * scaleFactor;
        const visibleHeight = rect.height * scaleFactor;

        // Calculate the center point in SVG coordinates after pan
        const centerX = svgWidth / 2 - panPosition.x * scaleFactor;
        const centerY = svgHeight / 2 - panPosition.y * scaleFactor;

        return {
            left: centerX - visibleWidth / 2,
            right: centerX + visibleWidth / 2,
            top: centerY - visibleHeight / 2,
            bottom: centerY + visibleHeight / 2,
            width: visibleWidth,
            height: visibleHeight,
        };
    }, [zoomLevel, panPosition]);

    // Check if a node is in the viewport
    const isNodeInViewport = useCallback(
        (
            node: { x: number; y: number },
            viewport: {
                left: number;
                right: number;
                top: number;
                bottom: number;
            } | null
        ) => {
            if (!dynamicRendering) return true;
            if (!viewport) return true;

            return (
                node.x >= viewport.left &&
                node.x <= viewport.right &&
                node.y >= viewport.top &&
                node.y <= viewport.bottom
            );
        },
        [dynamicRendering]
    );

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

    // Memoized set of important buildings - buildings in active paths or daily routes
    const importantBuildings = useMemo(() => {
        const result = new Set<NodeId>();

        // Add selected buildings
        if (selected.start) result.add(selected.start);
        if (selected.end) result.add(selected.end);

        // Add buildings in the daily paths
        relevantPaths?.forEach(path => {
            result.add(path.start);
            result.add(path.end);
        });

        return result;
    }, [selected.start, selected.end, relevantPaths]);

    // Memoized set of buildings to show based on zoom level and grid clustering
    const visibleBuildings = useMemo(() => {
        // Start with important buildings (selected or in active paths)
        const result = new Set<NodeId>(importantBuildings);
        const viewport = calculateViewport();

        if (!dynamicRendering) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'building' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // If showing prioritized buildings only, return just the important ones
        if (showPrioritizedOnly) {
            return result;
        }

        // If we're zoomed in enough, show all buildings in viewport
        if (zoomLevel >= ZOOM_LEVELS.HIGH) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'building' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // At medium zoom, show more buildings but still cluster them
        if (zoomLevel >= ZOOM_LEVELS.MEDIUM) {
            // Create a grid-based clustering with medium density
            const gridSize = 40;
            const grid: Record<string, NodeId[]> = {};

            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'building' && isNodeInViewport(node, viewport)) {
                    const gridX = Math.floor(node.x / gridSize);
                    const gridY = Math.floor(node.y / gridSize);
                    const gridId = `${gridX}-${gridY}`;

                    if (!grid[gridId]) {
                        grid[gridId] = [];
                    }
                    grid[gridId].push(id);
                }
            });

            // Select one building per grid cell
            Object.values(grid).forEach(buildings => {
                if (buildings.length > 0) {
                    // Sort to ensure consistent selection
                    const sorted = [...buildings].sort();
                    if (sorted[0]) {
                        result.add(sorted[0]);
                    }
                }
            });
            return result;
        }

        // At low zoom, create a sparser grid
        const gridSize = 70;
        const grid: Record<string, NodeId[]> = {};

        Object.entries(graphNodes).forEach(([id, node]) => {
            if (node.type === 'building' && isNodeInViewport(node, viewport)) {
                const gridX = Math.floor(node.x / gridSize);
                const gridY = Math.floor(node.y / gridSize);
                const gridId = `${gridX}-${gridY}`;

                if (!grid[gridId]) {
                    grid[gridId] = [];
                }
                grid[gridId].push(id);
            }
        });

        // Select one building per grid cell
        Object.values(grid).forEach(buildings => {
            if (buildings.length > 0) {
                // Sort to ensure consistent selection
                const sorted = [...buildings].sort();
                if (sorted[0]) {
                    result.add(sorted[0]);
                }

                // For grid cells with many buildings, maybe show a second one too
                if (sorted.length > 3 && zoomLevel > ZOOM_LEVELS.LOW && sorted[1]) {
                    result.add(sorted[1]);
                }
            }
        });

        return result;
    }, [importantBuildings, calculateViewport, dynamicRendering, showPrioritizedOnly, zoomLevel, isNodeInViewport]);

    // Determine which intersections to show based on zoom level
    const visibleIntersections = useMemo(() => {
        const result = new Set<NodeId>();
        const viewport = calculateViewport();

        // Only process if intersections should be shown
        if (!showIntersections) return result;

        if (!dynamicRendering) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'intersection' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // Show all intersections at high zoom
        if (zoomLevel >= ZOOM_LEVELS.HIGH) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'intersection' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // At medium zoom, show a subset
        if (zoomLevel >= ZOOM_LEVELS.MEDIUM) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'intersection' && isNodeInViewport(node, viewport)) {
                    // Show every 2nd intersection
                    const nodeIndex = parseInt(id.replace(/\D/g, '') || '0', 10);
                    if (nodeIndex % 2 === 0) {
                        result.add(id);
                    }
                }
            });
            return result;
        }

        // At low zoom, show very few intersections
        Object.entries(graphNodes).forEach(([id, node]) => {
            if (node.type === 'intersection' && isNodeInViewport(node, viewport)) {
                // Show only every 4th intersection
                const nodeIndex = parseInt(id.replace(/\D/g, '') || '0', 10);
                if (nodeIndex % 4 === 0) {
                    result.add(id);
                }
            }
        });

        return result;
    }, [calculateViewport, dynamicRendering, showIntersections, zoomLevel, isNodeInViewport]);

    // Determine which walkways to show based on zoom level
    const visibleWalkways = useMemo(() => {
        const result = new Set<NodeId>();
        const viewport = calculateViewport();

        // Only process if walkways should be shown
        if (!showWalkways) return result;

        if (!dynamicRendering) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'walkway' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // Show all walkways at high zoom
        if (zoomLevel >= ZOOM_LEVELS.HIGH) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'walkway' && isNodeInViewport(node, viewport)) {
                    result.add(id);
                }
            });
            return result;
        }

        // At medium zoom, show a subset
        if (zoomLevel >= ZOOM_LEVELS.MEDIUM) {
            Object.entries(graphNodes).forEach(([id, node]) => {
                if (node.type === 'walkway' && isNodeInViewport(node, viewport)) {
                    // Show every 3rd walkway
                    const nodeIndex = parseInt(id.replace(/\D/g, '') || '0', 10);
                    if (nodeIndex % 3 === 0) {
                        result.add(id);
                    }
                }
            });
            return result;
        }

        // At low zoom, show very few walkways
        Object.entries(graphNodes).forEach(([id, node]) => {
            if (node.type === 'walkway' && isNodeInViewport(node, viewport)) {
                // Show only every 5th walkway
                const nodeIndex = parseInt(id.replace(/\D/g, '') || '0', 10);
                if (nodeIndex % 5 === 0) {
                    result.add(id);
                }
            }
        });

        return result;
    }, [calculateViewport, dynamicRendering, showWalkways, zoomLevel, isNodeInViewport]);

    // Determine if a node should be shown based on type and zoom level
    const shouldShowNode = useCallback(
        (type: NodeType, id: NodeId): boolean => {
            // Always show selected buildings
            if (id === selected.start || id === selected.end) return true;

            switch (type) {
                case 'building':
                    return showBuildings && visibleBuildings.has(id);
                case 'intersection':
                    return visibleIntersections.has(id);
                case 'walkway':
                    return visibleWalkways.has(id);
                default:
                    return false;
            }
        },
        [showBuildings, selected, visibleBuildings, visibleIntersections, visibleWalkways]
    );

    // Get the appropriate node size based on zoom level with maximum cap
    const getNodeSize = useCallback(
        (type: NodeType): number => {
            const baseSize = type === 'building' ? 6 : 4;
            const minSize = baseSize * 0.8; // Minimum size at low zoom
            const maxSize = baseSize * 0.5; // Maximum size cap

            // If below minimum zoom level
            if (zoomLevel <= ZOOM_LEVELS.LOW) {
                return minSize;
            }

            // If above maximum zoom level, cap the size
            if (zoomLevel >= ZOOM_LEVELS.HIGH) {
                return maxSize;
            }

            // Scale size gradually between LOW and HIGH zoom levels
            const zoomRatio = (zoomLevel - ZOOM_LEVELS.LOW) / (ZOOM_LEVELS.HIGH - ZOOM_LEVELS.LOW);
            return minSize + zoomRatio * (maxSize - minSize);
        },
        [zoomLevel]
    );

    // Get the appropriate text size based on zoom level with maximum cap
    const getTextSize = useCallback((): number => {
        const minSize = 12; // Minimum text size at low zoom
        const maxSize = 8; // Maximum text size cap

        // If below minimum zoom level
        if (zoomLevel <= ZOOM_LEVELS.LOW) {
            return minSize;
        }

        // If above maximum zoom level, cap the size
        if (zoomLevel >= ZOOM_LEVELS.HIGH) {
            return maxSize;
        }

        // Scale text size gradually between LOW and HIGH zoom levels
        const zoomRatio = (zoomLevel - ZOOM_LEVELS.LOW) / (ZOOM_LEVELS.HIGH - ZOOM_LEVELS.LOW);
        return minSize + zoomRatio * (maxSize - minSize);
    }, [zoomLevel]);

    // Determine if text should be shown for a node
    const shouldShowText = useCallback(
        (type: NodeType, id: NodeId): boolean => {
            // If building text is disabled in dev controls, don't show any text
            if (!showBuildingText) return false;

            if (type !== 'building') return false;

            // Always show text for selected buildings
            if (id === selected.start || id === selected.end) return true;

            // Show text based on zoom level
            return zoomLevel >= ZOOM_LEVELS.LOW;
        },
        [zoomLevel, selected, showBuildingText]
    );

    // Zoom and pan handlers
    const handleZoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(prev * zoomStep, maxZoom));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(prev / zoomStep, minZoom));
    }, []);

    const handleResetZoomPan = useCallback(() => {
        setZoomLevel(1);
        setPanPosition({ x: 0, y: 0 });
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            setZoomLevel(prev => Math.min(prev * zoomStep, maxZoom));
        } else {
            setZoomLevel(prev => Math.max(prev / zoomStep, minZoom));
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
                            shouldShowNode(node.type, id) && (
                                <g key={id}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={getNodeSize(node.type)}
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
                                        strokeWidth={zoomLevel < ZOOM_LEVELS.MEDIUM ? '1.5' : '2'}
                                        className='cursor-pointer opacity-90'
                                        onClick={() => handleBuildingSelect(id)}
                                    />
                                    {node.type === 'building' && shouldShowText(node.type, id) && (
                                        <text
                                            x={node.x + 12}
                                            y={node.y + 4}
                                            fill='#000000'
                                            fontSize={getTextSize()}
                                            className='font-bold'
                                            style={{
                                                // Fade in text based on zoom level for smooth transition
                                                opacity: zoomLevel < ZOOM_LEVELS.LOW ? zoomLevel / ZOOM_LEVELS.LOW : 1,
                                            }}
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
                {/* Day Selector */}
                <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

                {/* Zoom and Pan Controls */}
                <ZoomPanControls
                    zoomIn={handleZoomIn}
                    zoomOut={handleZoomOut}
                    resetZoomPan={handleResetZoomPan}
                    zoomLevel={zoomLevel}
                />

                {/* Fullscreen Button */}
                <FullscreenButton containerRef={mapContainerRef} />

                {/* Dev Toggles */}
                <DevToggles
                    dynamicRendering={dynamicRendering}
                    showBuildings={showBuildings}
                    showIntersections={showIntersections}
                    showWalkways={showWalkways}
                    showBuildingText={showBuildingText}
                    showPrioritizedOnly={showPrioritizedOnly}
                    onToggleDynamicRendering={() => setDynamicRendering(prev => !prev)}
                    onToggleBuildings={() => setShowBuildings(prev => !prev)}
                    onToggleIntersections={() => setShowIntersections(prev => !prev)}
                    onToggleWalkways={() => setShowWalkways(prev => !prev)}
                    onToggleBuildingText={() => setShowBuildingText(prev => !prev)}
                    onTogglePrioritizedOnly={() => setShowPrioritizedOnly(prev => !prev)}
                />
            </div>

            {/* Path information */}
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
