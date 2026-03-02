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
const IS_STORYBOOK = import.meta.env.STORYBOOK;
const DEFAULT_START_HOUR = 8;

interface Props {
    courseCells?: CalendarGridCourse[];
    saturdayClass?: boolean;
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

function CalendarHour({ hour }: { hour: number }) {
    return (
        <div className='grid-row-span-2 pr-2'>
            <Text variant='small' className='inline-block w-full text-right -translate-y-2.25'>
                {(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}
            </Text>
        </div>
    );
}

function makeGridRow(row: number, cols: number, hoursOfDay: number[]): JSX.Element {
    const hour = hoursOfDay[row]!;

    return (
        <Fragment key={row}>
            <CalendarHour hour={hour} />
            <div className='grid-row-span-2 w-4 border-b border-r border-gray-300' />
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
    saturdayClass: _saturdayClass,
    setCourse,
}: React.PropsWithChildren<Props>): JSX.Element {
    // Detect if any class starts before 8 AM (480 minutes)
    const hasEarlyClass =
        courseCells?.some(c => {
            if (c.async) return false;
            const startMinutes = (c.calendarGridPoint.startIndex - 3) * 30 + 360;
            return startMinutes < 480;
        }) ?? false;

    let earliestClassHour = DEFAULT_START_HOUR;

    courseCells?.forEach(c => {
        if (c.async) {
            return;
        }

        const startMinutes = (c.calendarGridPoint.startIndex - 3) * 30 + 360;
        const startHour = Math.floor(startMinutes / 60);

        if (startHour < earliestClassHour) {
            earliestClassHour = startHour;
        }
    });

    const visualStartHour = Math.max(0, Math.min(earliestClassHour, 8));

    const visualEndHour = 21;
    const hoursOfDay = Array.from({ length: visualEndHour - visualStartHour }, (_, i) => i + visualStartHour);
    const totalRows = (visualEndHour - visualStartHour) * 2;

    return (
        <div
            className='grid grid-cols-[auto_auto_repeat(5,1fr)] h-full'
            style={{
                gridTemplateRows: `auto auto repeat(${totalRows}, 1fr)`,
            }}
        >
            {/* Cover top left corner of grid, so time gets cut off at the top of the partial border */}
            <div className='sticky top-[85px] z-10 col-span-2 h-3 bg-white' />

            {daysOfWeek.map(day => (
                <div
                    // Full height with background to prevent grid lines from showing behind
                    className='sticky top-[85px] z-10 row-span-2 h-7 flex flex-col items-end self-start justify-end bg-white'
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

            <div />
            {/* time tick for the first hour */}
            <div className='h-4 w-4 self-end border-b border-r border-gray-300' />

            {hoursOfDay.map((_, i) => makeGridRow(i, 5, hoursOfDay))}

            <ColorPickerProvider>
                {courseCells && <AccountForCourseConflicts courseCells={courseCells} setCourse={setCourse} />}
            </ColorPickerProvider>
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

function AccountForCourseConflicts({ courseCells, setCourse }: AccountForCourseConflictsProps): JSX.Element[] {
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
            console.error(error);
            if (sentryScope) sentryScope.captureException(error);
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
                        gridRow: `${block.calendarGridPoint.startIndex} / ${block.calendarGridPoint.endIndex}`,
                        width: `calc(100% / ${block.totalColumns ?? 1})`,
                        marginLeft: `calc(100% * ${((block.gridColumnStart ?? 0) - 1) / (block.totalColumns ?? 1)})`,
                    }}
                    className='pb-1 pl-0 pr-2.5 pt-0'
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
