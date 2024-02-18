import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';
import calIcon from 'src/assets/icons/cal.svg';
import pngIcon from 'src/assets/icons/png.svg';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import CalendarCourseCell from '../CalendarCourseCell/CalendarCourseCell';
import styles from './CalendarGrid.module.scss';

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
function CalendarGrid({ courseCells, saturdayClass }: React.PropsWithChildren<Props>): JSX.Element {
    const calendarRef = useRef(null); // Create a ref for the calendar grid

    const saveAsPNG = () => {
        htmlToImage
            .toPng(calendarRef.current, {
                backgroundColor: 'white',
                style: {
                    background: 'white',
                    marginTop: '20px',
                    marginBottom: '20px',
                    marginRight: '20px',
                    marginLeft: '20px',
                },
            })
            .then(dataUrl => {
                let img = new Image();
                img.src = dataUrl;
                fetch(dataUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const href = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = href;
                        link.download = 'my-schedule.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                    .catch(error => console.error('Error downloading file:', error));
            })
            .catch(error => {
                console.error('oops, something went wrong!', error);
            });
    };

    return (
        <div className={styles.calendar}>
            <div className={styles.dayLabelContainer} />
            {/* Displaying the rest of the calendar */}
            <div ref={calendarRef} className={styles.timeAndGrid}>
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
                    {grid.map((row, index) => (
                        <React.Fragment key={index}>{row}</React.Fragment>
                    ))}
                </div>
            </div>
            {courseCells.map((block: CalendarGridCourse) => (
                <div
                    key={`${block}`}
                    style={{
                        gridColumn: `${block.calendarGridPoint.dayIndex}`,
                        gridRow: `${block.calendarGridPoint.startIndex} / ${block.calendarGridPoint.endIndex}`,
                    }}
                >
                    <CalendarCourseCell
                        courseDeptAndInstr={block.componentProps.courseDeptAndInstr}
                        status={block.componentProps.status}
                        colors={block.componentProps.colors}
                    />
                </div>
            ))}
            <div className={styles.buttonContainer}>
                <div className={styles.divider} /> {/* First divider */}
                <button className={styles.calendarButton}>
                    <img src={calIcon} className={styles.buttonIcon} alt='CAL' />
                    Save as .CAL
                </button>
                <div className={styles.divider} /> {/* Second divider */}
                <button onClick={saveAsPNG} className={styles.calendarButton}>
                    <img src={pngIcon} className={styles.buttonIcon} alt='PNG' />
                    Save as .PNG
                </button>
            </div>
        </div>
    );
}

export default CalendarGrid;
