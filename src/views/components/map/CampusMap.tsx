/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';

import { Button } from '../common/Button';
import { graphNodes } from './graphNodes';
import type { ProcessInPersonMeetings } from './Map';
import { Path } from './Path';
import { calcDirectPathStats, PathStats } from './PathStats';
import type { DayCode, NodeId } from './types';
import { DAY_MAPPING } from './types';
import { getMidpoint } from './utils';

// Image: 784x754
const UTMapURL = new URL('/src/assets/UT-Map.png', import.meta.url).href;
const showDebugNodes = false;

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
                size='mini'
                className={`px-3 py-1 ${
                    selectedDay === day ? 'bg-ut-burntorange text-white' : 'hover:bg-ut-burntorange/10'
                }`}
            >
                {day}
            </Button>
        ))}
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
 *
 * The rendered output includes:
 * - An image of the campus map.
 * - An SVG overlay with paths and buildings.
 * - Controls for selecting the day and displaying path information.
 */
export default function CampusMap({ processedCourses }: CampusMapProps): JSX.Element {
    const [selected, setSelected] = useState<SelectedBuildings>({
        start: null,
        end: null,
    });
    const [selectedDay, setSelectedDay] = useState<DayCode | null>(null);
    const [hoveredPathIndex, setHoveredPathIndex] = useState<number | null>(null);
    const [toggledPathIndex, setToggledPathIndex] = useState<number | null>(null);

    const getDailyPaths = (courses: ProcessInPersonMeetings[]) => {
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
    };

    const relevantPaths = useMemo(() => {
        if (!selectedDay) return [];

        const coursesForDay = processedCourses.filter(course => course.day === DAY_MAPPING[selectedDay]);

        const paths = getDailyPaths(coursesForDay);

        return paths.map(path => ({
            ...path,
            timeBetweenClasses: Math.floor(path.endTime - path.startTime),
        }));
    }, [selectedDay, processedCourses]);

    const handleDaySelect = (day: DayCode) => {
        setSelectedDay(prevDay => (prevDay === day ? null : day));
        setHoveredPathIndex(null);
        setToggledPathIndex(null);
    };

    const handleBuildingSelect = (buildingId: NodeId) => {
        setSelected(prev => {
            if (!prev.start) return { ...prev, start: buildingId };
            if (!prev.end) return { ...prev, end: buildingId };
            return { start: buildingId, end: null };
        });
    };

    const handlePathClick = (index: number) => {
        setToggledPathIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const shouldShowPath = (index: number) => {
        if (hoveredPathIndex !== null) {
            return hoveredPathIndex === index;
        }
        if (toggledPathIndex !== null) {
            return toggledPathIndex === index;
        }
        return true;
    };

    return (
        <div className='relative h-full w-full'>
            {/* Map Image */}
            <img src={UTMapURL} alt='UT Campus Map' className='h-full w-full object-contain' />

            {/* SVG Overlay */}
            <svg className='absolute left-0 top-0 h-full w-full' viewBox='0 0 784 754' preserveAspectRatio='none'>
                {/* Render buildings and intersections */}
                {Object.entries(graphNodes).map(([id, node]) => (
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
                            stroke={node.type !== 'walkway' ? 'white' : showDebugNodes ? 'green' : 'transparent'}
                            strokeWidth='2'
                            className='cursor-pointer opacity-90'
                            onClick={() => {
                                // if (node.type === 'building') {
                                //     handleBuildingSelect(id);
                                // }

                                handleBuildingSelect(id);
                                console.log(id, node);
                            }}
                        />
                        {node.type === 'building' && (
                            <text x={node.x + 12} y={node.y + 4} fill='#000000' fontSize='14' className='font-bold'>
                                {id}
                            </text>
                        )}
                    </g>
                ))}

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

            {/* Controls and Information */}
            <div className='absolute right-8 top-8 flex flex-col gap-4'>
                {/* Day Selector */}
                <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

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
                                    key={index}
                                    className={`text-xs space-y-1 cursor-pointer transition-colors duration-200 ${
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
