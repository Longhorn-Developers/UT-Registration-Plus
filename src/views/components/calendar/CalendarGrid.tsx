import type { Course } from '@shared/types/Course';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import Text from '@views/components/common/Text/Text';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import React from 'react';

import CalendarCell from './CalendarGridCell';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

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

function makeGridRow(row: number, cols: number): JSX.Element {
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
    return (
        <div className='grid grid-cols-[auto_auto_repeat(5,1fr)] grid-rows-[auto_repeat(26,1fr)] h-full'>
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
            {[...Array(13).keys()].map(i => makeGridRow(i, 5))}
            <CalendarHour hour={21} />
            {Array(6)
                .fill(1)
                .map(() => (
                    <div className='h-4 flex items-end justify-center border-r border-gray-300' />
                ))}
            {courseCells ? <AccountForCourseConflicts courseCells={courseCells} setCourse={setCourse} /> : null}
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({ courseCells, setCourse }: AccountForCourseConflictsProps): JSX.Element[] {
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
