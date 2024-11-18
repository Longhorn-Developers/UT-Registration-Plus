import type { Course } from '@shared/types/Course';
import { DAY_MAP } from '@shared/types/CourseMeeting';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import Text from '@views/components/common/Text/Text';
import { type CalendarGridCourse, EARLIEST, LATEST } from '@views/hooks/useFlattenedCourseSchedule';
import React, { useState } from 'react';

import CalendarCell from './CalendarGridCell';

// const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
// const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

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
        <>
            <CalendarHour hour={hour} />
            <div className='grid-row-span-2 w-4 border-b border-r border-gray-300' />
            {[...Array(cols).keys()].map(col => (
                <CalendarCell key={`${row}${col}`} row={row} col={col} />
            ))}
        </>
    );
}

// TODO: add Saturday class support

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
export default function CalendarGrid({
    courseCells,
    saturdayClass: _saturdayClass, // TODO: implement/move away from props
    setCourse,
}: React.PropsWithChildren<Props>): JSX.Element {
    const FIRST_HOUR = 8;
    const LAST_HOUR = 9 + 12;
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['MON', 'TUE', 'WED', 'THU', 'FRI']);
    const [hoursOfDay, setHoursOfDay] = useState<number[]>([
        ...Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, index) => index + FIRST_HOUR),
    ]);

    // Don't display courses that can't be displayed
    let restoreDefaultDaysOfWeek: boolean = true;
    let restoreDefaultEarlyHours: boolean = true;
    let restoreDefaultLateHours: boolean = true;
    const validCourseCells = courseCells!.filter(
        courseCell =>
            courseCell.course.schedule.meetings.find(meeting => {
                if (meeting.days.includes(DAY_MAP.S)) {
                    restoreDefaultDaysOfWeek = false;
                    if (!daysOfWeek.includes('SAT')) {
                        setDaysOfWeek([...daysOfWeek, 'SAT']);
                        return true;
                    }
                }
                if (meeting.endTime / 60 > LAST_HOUR) {
                    restoreDefaultLateHours = false;
                    if (hoursOfDay.find(hour => hour > LAST_HOUR) === undefined) {
                        setHoursOfDay([
                            ...hoursOfDay,
                            ...Array.from(
                                { length: Math.ceil(LATEST / 60) - LAST_HOUR },
                                (_, index) => index + LAST_HOUR + 1
                            ),
                        ]);
                        return true;
                    }
                }
                if (meeting.startTime / 60 < FIRST_HOUR) {
                    restoreDefaultEarlyHours = false;
                    if (hoursOfDay.find(hour => hour < FIRST_HOUR) === undefined) {
                        setHoursOfDay([
                            ...Array.from(
                                { length: FIRST_HOUR - Math.floor(EARLIEST / 60) },
                                (_, index) => index + Math.floor(EARLIEST / 60)
                            ),
                            ...hoursOfDay,
                        ]);
                        return true;
                    }
                }
                return false;
            }) === undefined
    );

    if (restoreDefaultDaysOfWeek && daysOfWeek.includes('SAT')) {
        setDaysOfWeek([...daysOfWeek.filter(day => day !== 'SAT')]);
    }
    if (restoreDefaultLateHours && hoursOfDay.find(hour => hour > LAST_HOUR) !== undefined) {
        setHoursOfDay([...hoursOfDay.filter(hour => hour <= LAST_HOUR)]);
    }
    if (restoreDefaultEarlyHours && hoursOfDay.find(hour => hour < FIRST_HOUR) !== undefined) {
        setHoursOfDay([...hoursOfDay.filter(hour => hour >= FIRST_HOUR)]);
    }
    return (
        <div
            className={`grid grid-cols-[auto_auto_repeat(${daysOfWeek.length},1fr)] grid-rows-[auto_repeat(${2 * (hoursOfDay.length - 1)},1fr)] h-full`}
        >
            {/* Displaying day labels */}
            <div />
            <div className='w-4 border-b border-r border-gray-300' />
            {daysOfWeek.map(day => (
                <div className='h-4 flex items-end justify-center border-b border-r border-gray-300 pb-1.5'>
                    <Text key={day} variant='small' className='text-center text-ut-burntorange' as='div'>
                        {day}
                    </Text>
                </div>
            ))}
            {[...Array(hoursOfDay.length - 1).keys()].map(i => makeGridRow(i, daysOfWeek.length, hoursOfDay))}
            <CalendarHour hour={hoursOfDay[hoursOfDay.length - 1]!} />
            {Array(daysOfWeek.length + 1)
                .fill(1)
                .map(() => (
                    <div className='h-4 flex items-end justify-center border-r border-gray-300' />
                ))}
            {courseCells ? (
                <AccountForCourseConflicts
                    courseCells={validCourseCells}
                    setCourse={setCourse}
                    hoursOfDay={hoursOfDay}
                    FIRST_HOUR={FIRST_HOUR}
                />
            ) : null}
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
    hoursOfDay: number[];
    FIRST_HOUR: number;
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({
    courseCells,
    setCourse,
    hoursOfDay,
    FIRST_HOUR,
}: AccountForCourseConflictsProps): JSX.Element[] {
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
    Object.values(days).forEach((dayCells: CalendarGridCourse[]) => {
        // Sort by start time to ensure proper columnIndex assignment
        dayCells.sort((a, b) => a.calendarGridPoint.startIndex - b.calendarGridPoint.startIndex);

        dayCells.forEach((cell, _, arr) => {
            let columnIndex = 1;
            cell.totalColumns = 1;
            // Check for overlaps and adjust columnIndex as needed
            for (let otherCell of arr) {
                if (otherCell !== cell) {
                    const isOverlapping =
                        otherCell.calendarGridPoint.startIndex < cell.calendarGridPoint.endIndex &&
                        otherCell.calendarGridPoint.endIndex > cell.calendarGridPoint.startIndex;
                    if (isOverlapping) {
                        // Adjust columnIndex to not overlap with the otherCell
                        if (otherCell.gridColumnStart && otherCell.gridColumnStart >= columnIndex) {
                            columnIndex = otherCell.gridColumnStart + 1;
                        }
                        cell.totalColumns += 1;
                    }
                }
            }
            cell.gridColumnStart = columnIndex;
            cell.gridColumnEnd = columnIndex + 1;
        });
    });

    // Offset indices by the number of hours off from the first and last normal hours
    const earlyOffset: number = 2 * hoursOfDay.filter(hour => hour < FIRST_HOUR).length;
    // const lateOffset: number = 2 * hoursOfDay.filter(hour => hour < FIRST_HOUR).length + 1;

    return courseCells
        .filter(block => !block.async)
        .map(block => {
            const { courseDeptAndInstr, timeAndLocation, status } = block.componentProps;

            return (
                <div
                    key={`${JSON.stringify(block)}`}
                    style={{
                        gridColumn: `${block.calendarGridPoint.dayIndex + 3}`,
                        gridRow: `${block.calendarGridPoint.startIndex + earlyOffset} / ${block.calendarGridPoint.endIndex + earlyOffset}`,
                        width: `calc(100% / ${block.totalColumns ?? 1})`,
                        marginLeft: `calc(100% * ${((block.gridColumnStart ?? 0) - 1) / (block.totalColumns ?? 1)})`,
                    }}
                    className='pb-1 pl-0 pr-2.5 pt-0 screenshot:pb-0.5 screenshot:pr-0.5'
                >
                    <CalendarCourseCell
                        courseDeptAndInstr={courseDeptAndInstr}
                        timeAndLocation={timeAndLocation}
                        status={status}
                        colors={block.course.colors}
                        onClick={() => setCourse(block.course)}
                    />
                </div>
            );
        });
}
