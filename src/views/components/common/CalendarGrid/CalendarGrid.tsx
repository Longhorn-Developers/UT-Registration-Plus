import React from 'react';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import CalendarCourseCell from '../CalendarCourseCell/CalendarCourseCell';
import { Chip } from '../Chip/Chip';


const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['S', 'SU'].includes(key));
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);
const grid = [];
for (let i = 0; i < 13; i++) {
    const row = [];
    let hour = hoursOfDay[i];
    row.push(
        <div key={hour} className={styles.timeBlock}>
            <div className={styles.timeLabelContainer}>
                <p>{(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}</p>
            </div>
        </div>
    );
    row.push(Array.from({ length: 5 }, (_, j) => <CalendarCell key={j} />));
    grid.push(row);
}

interface Props {
    courseCells: typeof CalendarCourseCell[];
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
export function Calendar({ courseCells }: React.PropsWithChildren<Props>): JSX.Element {

    return (
        <div className={styles.calendar}>
            <div className={styles.dayLabelContainer} />
            {/* Displaying the rest of the calendar */}
            <div className={styles.timeAndGrid}>
                {/* <div className={styles.timeColumn}>
            <div className={styles.timeBlock}></div>
            {hoursOfDay.map((hour) => (
                <div key={hour} className={styles.timeBlock}>
                <div className={styles.timeLabelContainer}>
                    <p>{hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}</p>
                </div>
                </div>
            ))}
            </div> */}
                <div className={styles.calendarGrid}>
                    {/* Displaying day labels */}
                    <div className={styles.timeBlock} />
                    {daysOfWeek.map(day => (
                        <div key={day} className={styles.day}>
                            {day}
                        </div>
                    ))}
                    {grid.map((row) => row)}
                </div>
            </div>
            {courseCells.map((Block: typeof CalendarCourseCell) => (
                <div key={`${Block}`} 
                     style ={{
                            gridColumn: `1`,
                            gridRow: `1`
                     }}>
                    <Chip label='test'/>
                </div>
            ))}
        </div>
    );
};

export default Calendar;
