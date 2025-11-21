import type { Course } from '@shared/types/Course';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import Text from '@views/components/common/Text/Text';
import { ColorPickerProvider } from '@views/contexts/ColorPickerContext';
import { useSentryScope } from '@views/contexts/SentryContext';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import React, { Fragment } from 'react';

import CalendarCell from './CalendarGridCell';
import { calculateCourseCellColumns } from './utils';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const defaultStartHour = 8; // 8 am
const defaultEndHour = 21; // 9 pm

const IS_STORYBOOK = import.meta.env.STORYBOOK;

interface Props {
    courseCells?: CalendarGridCourse[];
    saturdayClass?: boolean;
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

function CalendarHour({ hour, style }: { hour: number; style?: React.CSSProperties }) {
    return (
        <div className='grid-row-span-2 pr-2' style={style}>
            <Text variant='small' className='inline-block w-full text-right -translate-y-2.25'>
                {(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}
            </Text>
        </div>
    );
}

function makeGridRow(row: number, cols: number, hour: number): JSX.Element {
    const rowStart = 2 * row + 3; // skip the 2 header rows
    const rowEnd = 2 * row + 5; // span 2 rows per hour
    return (
        <Fragment key={row}>
            <CalendarHour hour={hour} style={{ gridColumn: 1, gridRow: `${rowStart} / ${rowEnd}` }} />
            <div
                className='grid-row-span-2 w-4 border-b border-r border-gray-300'
                style={{ gridColumn: 2, gridRow: `${rowStart} / ${rowEnd}` }}
            />
            {[...Array(cols).keys()].map(col => (
                <CalendarCell key={`${row}${col}`} row={row} col={col} />
            ))}
        </Fragment>
    );
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 *
 * @param courseCells - The courses to display on the calendar
 * @param saturdayClass - Whether the user has a Saturday class
 * @param setCourse - Function to set the course to display in the course details panel
 * @returns The CalendarGrid component
 */
export default function CalendarGrid({
    courseCells,
    saturdayClass: _saturdayClass, // TODO: implement/move away from props
    setCourse,
}: React.PropsWithChildren<Props>): JSX.Element {
    // Use classes to determine dimensions of the calendar grid
    const inPersonCells = (courseCells ?? []).filter(block => !block.async);

    // Add Saturday column if a class exists
    const hasSaturday = inPersonCells.some(block => block.calendarGridPoint.dayIndex === 5);
    const calendarDays = hasSaturday ? [...daysOfWeek, 'SAT'] : [...daysOfWeek];
    const dayCols = calendarDays.length;

    // Calculate earliest and latest times based on grid dimensions
    const earliestIndex = inPersonCells.reduce<number | null>((min, c) => {
        const s = c.calendarGridPoint.startIndex;
        if (s < 0) return min === null ? s : Math.min(min, s);
        return min === null ? s : Math.min(min, s);
    }, null);
    const latestIndex = inPersonCells.reduce<number | null>((max, c) => {
        const e = c.calendarGridPoint.endIndex;
        return max === null ? e : Math.max(max, e);
    }, null);

    // map grid indices to time
    const indexToApproxMinutes = (index: number) => 480 + 30 * (index - 3);

    // Adjust start/end from 8AM/9PM depending on other classes
    const startHour =
        earliestIndex !== null
            ? Math.min(defaultStartHour, Math.max(0, Math.floor(indexToApproxMinutes(earliestIndex) / 60)))
            : defaultStartHour;

    const endHour =
        latestIndex !== null
            ? Math.max(defaultEndHour, Math.ceil(indexToApproxMinutes(latestIndex) / 60))
            : defaultEndHour;

    const hoursOfDay = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const contentRepeat = (endHour - startHour) * 2 + 1;
    const shiftRows = (defaultStartHour - startHour) * 2; // 2 rows per hour

    return (
        <div
            className='grid h-full'
            style={{
                gridTemplateColumns: `auto auto repeat(${dayCols}, 1fr)`,
                gridTemplateRows: `auto auto repeat(${contentRepeat}, 1fr)`,
            }}
        >
            {/* Cover top left corner of grid, so time gets cut off at the top of the partial border */}
            <div className='sticky top-[85px] z-10 h-3 bg-white' style={{ gridColumn: '1 / span 2', gridRow: '1' }} />
            {/* Displaying day labels (include Saturday when present) */}
            {calendarDays.map((day, idx) => (
                <div
                    // Full height with background to prevent grid lines from showing behind
                    className='sticky top-[85px] z-10 row-span-2 h-7 flex flex-col items-end self-start justify-end bg-white'
                    style={{ gridColumn: `${idx + 3}`, gridRow: '1 / span 2' }}
                    key={day}
                >
                    {/* Partial border height because that's what Isaiah wants */}
                    <div className='h-4 w-full flex items-end border-b border-r border-gray-300'>
                        {/* Alignment for text */}
                        <div className='h-[calc(1.75rem_-_1px)] w-full flex items-center justify-center'>
                            <Text variant='small' className='text-center text-ut-burntorange' as='div'>
                                {day}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}
            {/* empty slot, for alignment (2nd row, 1st column) */}
            <div style={{ gridColumn: 1, gridRow: 2 }} />
            {/* time tick for the first hour (2nd row, 2nd column) */}
            <div className='h-4 w-4 self-end border-b border-r border-gray-300' style={{ gridColumn: 2, gridRow: 2 }} />
            {[...Array(Math.max(0, hoursOfDay.length - 1)).keys()].map(i => makeGridRow(i, dayCols, hoursOfDay[i]!))}
            {/* last hour label at the bottom */}
            <CalendarHour
                hour={hoursOfDay[hoursOfDay.length - 1]!}
                style={{
                    gridColumn: 1,
                    gridRow: `${2 * (hoursOfDay.length - 1) + 3} / ${2 * (hoursOfDay.length - 1) + 5}`,
                }}
            />
            {Array(dayCols + 1)
                .fill(1)
                .map((_, i) => (
                    // Key suppresses warning about duplicate keys,
                    // and index is fine because it doesn't change between renders
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className='h-4 flex items-end justify-center border-r border-gray-300' />
                ))}
            <ColorPickerProvider>
                {courseCells && (
                    <AccountForCourseConflicts
                        courseCells={courseCells}
                        setCourse={setCourse}
                        __shiftRows__={shiftRows}
                    />
                )}
            </ColorPickerProvider>
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    // Internal prop to shift indices when the grid starts before 8 AM
    __shiftRows__?: number;
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({
    courseCells,
    setCourse,
    __shiftRows__ = 0,
}: AccountForCourseConflictsProps): JSX.Element[] {
    // Sentry is not defined in storybook.
    // This is a valid use case for a condition hook, since IS_STORYBOOK is determined at build time,
    // it doesn't change between renders.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [sentryScope] = IS_STORYBOOK ? [undefined] : useSentryScope();

    //  Groups by dayIndex to identify overlaps
    const days = courseCells.reduce(
        (acc, cell: CalendarGridCourse) => {
            const { dayIndex } = cell.calendarGridPoint;
            if (acc[dayIndex] === undefined) {
                acc[dayIndex] = [];
            }
            acc[dayIndex]!.push(cell);
            return acc;
        },
        {} as Record<number, CalendarGridCourse[]>
    );

    // Check for overlaps within each day and adjust gridColumnIndex and totalColumns
    Object.values(days).forEach((dayCells: CalendarGridCourse[], idx) => {
        try {
            calculateCourseCellColumns(dayCells);
        } catch (error) {
            console.error(`Error calculating course cell columns ${idx}`, error);
            if (sentryScope) {
                sentryScope.captureException(error);
            }
        }
    });

    return courseCells
        .filter(block => !block.async)
        .map(block => {
            const { courseDeptAndInstr, timeAndLocation, status } = block.componentProps;

            return (
                <div
                    key={`${JSON.stringify(block)}`}
                    style={{
                        gridColumn: `${block.calendarGridPoint.dayIndex + 3}`,
                        gridRow: `${block.calendarGridPoint.startIndex + __shiftRows__} / ${
                            block.calendarGridPoint.endIndex + __shiftRows__
                        }`,
                        width: `calc(100% / ${block.totalColumns ?? 1})`,
                        marginLeft: `calc(100% * ${((block.gridColumnStart ?? 0) - 1) / (block.totalColumns ?? 1)})`,
                    }}
                    className='pb-1 pl-0 pr-2.5 pt-0 screenshot:pb-0.5 screenshot:pr-0.5'
                >
                    <CalendarCourseCell
                        courseDeptAndInstr={courseDeptAndInstr}
                        timeAndLocation={timeAndLocation}
                        status={status}
                        onClick={() => setCourse(block.course)}
                        blockData={block}
                    />
                </div>
            );
        });
}
