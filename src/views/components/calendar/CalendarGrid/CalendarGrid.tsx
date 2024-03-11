import type { Course } from '@shared/types/Course';
import { DAY_MAP } from '@shared/types/CourseMeeting';
import { getCourseColors } from '@shared/util/colors';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell/CalendarCourseCell';
import CalendarCell from '@views/components/calendar/CalendarGridCell/CalendarGridCell';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import React, { useEffect, useState } from 'react';

import styles from './CalendarGrid.module.scss';

const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['S', 'SU'].includes(key));
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

interface Props {
    courseCells?: CalendarGridCourse[];
    saturdayClass?: boolean;
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
export default function CalendarGrid({
    courseCells,
    saturdayClass,
    setCourse,
}: React.PropsWithChildren<Props>): JSX.Element {
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        const newGrid = [];
        for (let i = 0; i < 13; i++) {
            const row = [];
            let hour = hoursOfDay[i];
            let styleProp = {
                gridColumn: '1',
                gridRow: `${2 * i + 2}`,
            };
            row.push(
                <div key={hour} className={styles.timeBlock} style={styleProp}>
                    <div className={styles.timeLabelContainer}>
                        <p>{(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}</p>
                    </div>
                </div>
            );
            for (let k = 0; k < 5; k++) {
                styleProp = {
                    gridColumn: `${k + 2}`,
                    gridRow: `${2 * i + 2} / ${2 * i + 4}`,
                };
                row.push(<CalendarCell key={k} styleProp={styleProp} />);
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
    }, []);

    return (
        <div className={styles.calendarGrid}>
            {/* Displaying day labels */}
            <div className={styles.timeBlock} />
            {daysOfWeek.map(day => (
                <div key={day} className={styles.day}>
                    {day}
                </div>
            ))}
            {grid.map(row => row)}
            {courseCells ? <AccountForCourseConflicts courseCells={courseCells} setCourse={setCourse} /> : null}
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
}

function AccountForCourseConflicts({ courseCells, setCourse }: AccountForCourseConflictsProps): JSX.Element[] {
    //  Groups by dayIndex to identify overlaps
    const days = courseCells.reduce((acc, cell: CalendarGridCourse) => {
        const { dayIndex } = cell.calendarGridPoint;
        if (!acc[dayIndex]) {
            acc[dayIndex] = [];
        }
        acc[dayIndex].push(cell);
        return acc;
    }, {});

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

    //  Part of TODO: block.course is definitely a course object
    //  console.log(courseCells);

    return courseCells.map((block, i) => {
        const { courseDeptAndInstr, timeAndLocation, status, colors } = courseCells[i].componentProps;

        return (
            <div
                key={`${block}`}
                style={{
                    gridColumn: `${block.calendarGridPoint.dayIndex + 2}`,
                    gridRow: `${block.calendarGridPoint.startIndex} / ${block.calendarGridPoint.endIndex}`,
                    width: `calc(100% / ${block.totalColumns})`,
                    marginLeft: `calc(100% * ${(block.gridColumnStart - 1) / block.totalColumns})`,
                    padding: '0px 10px 4px 0px',
                }}
            >
                <CalendarCourseCell
                    courseDeptAndInstr={courseDeptAndInstr}
                    timeAndLocation={timeAndLocation}
                    status={status}
                    //  TODO: Change to block.componentProps.colors when colors are integrated to the rest of the project
                    colors={getCourseColors('emerald', 500) /*  block.componentProps.colors */}
                    onClick={() => setCourse(block.course)}
                />
            </div>
        );
    });
}
