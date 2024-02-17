import React, { useState } from 'react';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import CalendarCourseCell from '../CalendarCourseCell/CalendarCourseCell';
import styles from './CalendarGrid.module.scss';

//  import calIcon from 'src/assets/icons/cal.svg';
//  import pngIcon from 'src/assets/icons/png.svg';

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
    courseCells: CalendarGridCourse[];
    saturdayClass: boolean;
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
function CalendarGrid({ courseCells, saturdayClass }: React.PropsWithChildren<Props> ): JSX.Element {
    const [iterator, setIterator] = useState<number>(0);
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
                <div className={styles.calendarGrid} id='grid1'>
                    {/* Displaying day labels */}
                    <div className={styles.timeBlock} />
                    {daysOfWeek.map((day, x) => (
                        <div key={`${day}`} className={styles.day}>
                            {day}
                        </div>
                    ))}
                    {grid.map((row, y) => (
                        <div key={`${row}`}>
                            {row.map((cell, x) => {
                                const shouldRenderChild = courseCells[iterator].calendarGridPoint && x === courseCells[iterator].calendarGridPoint.dayIndex && y === courseCells[iterator].calendarGridPoint.startIndex;
                                if (shouldRenderChild) {
                                    setIterator((iterator) => iterator + 1);
                                }
                                return (
                                    <div key={`${cell}`}>
                                        {cell}
                                        {shouldRenderChild && <CalendarCourseCell 
                                        courseDeptAndInstr={courseCells[iterator].componentProps.courseDeptAndInstr}
                                        status={courseCells[iterator].componentProps.status}
                                        colors={courseCells[iterator].componentProps.colors} />}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* <div className={styles.buttonContainer}>
                <div className={styles.divider}></div> 
                <button className={styles.calendarButton}>
                    <img src={calIcon} className={styles.buttonIcon} alt="CAL" />
                    Save as .CAL
                </button>
                <div className={styles.divider}></div> 
                <button className={styles.calendarButton}>
                    <img src={pngIcon} className={styles.buttonIcon} alt="PNG" />
                    Save as .PNG
                </button>
            </div>  */}
        </div>
    );
}

export default CalendarGrid;
