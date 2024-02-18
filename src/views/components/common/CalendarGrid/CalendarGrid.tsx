import React, { useState, useRef, useEffect } from 'react';
//  import html2canvas from 'html2canvas';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';
import { CalendarGridCourse } from 'src/views/hooks/useFlattenedCourseSchedule';
/*  import calIcon from 'src/assets/icons/cal.svg';
import pngIcon from 'src/assets/icons/png.svg';
*/
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import CalendarCourseCell from '../CalendarCourseCell/CalendarCourseCell';  
import styles from './CalendarGrid.module.scss';


/*  const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['S', 'SU'].includes(key));
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
}   */

interface Props {
    courseCells: CalendarGridCourse[];
    saturdayClass: boolean;
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
function CalendarGrid({ courseCells, saturdayClass }: React.PropsWithChildren<Props>): JSX.Element {
    const [iterator, setIterator] = useState<number>(0);
    const [grid, setGrid] = useState([]);
    const calendarRef = useRef(null); // Create a ref for the calendar grid

    const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['S', 'SU'].includes(key));
    const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

    const saveAsPNG = () => {
        if (calendarRef.current) {
            html2canvas(calendarRef.current).then(canvas => {
                // Create an a element to trigger download
                const a = document.createElement('a');
                a.href = canvas.toDataURL('image/png');
                a.download = 'calendar.png';
                a.click();
            });
        }
    };

    useEffect(() => {
        const newGrid = [];
        for (let i = 0; i < 13; i++) {
            const row = [];
            let hour = hoursOfDay[i];
            let styleProp = {
                gridColumn: '1',
                gridRow: `${(2 * i) + 2}`,
            };
            row.push(
                <div key={hour} className={styles.timeBlock} style={styleProp}>
                    <div className={styles.timeLabelContainer}>
                        <p>{(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}</p>
                    </div>
                </div>
            );
            for (let k = 0; k < 5; k++) {
                //  let shouldRender = false;
                styleProp = {
                    gridColumn: `${k + 2}`,
                    gridRow: `${2 * i + 2} / ${2 * i + 4}`,
                };
                /*  let shouldRenderChild = courseCells[iterator]?.calendarGridPoint && 
                k === courseCells[iterator].calendarGridPoint.dayIndex && i === courseCells[iterator].calendarGridPoint.startIndex;
                let childElement = <div className={styles.dot}/>;   */
                /*  let completeGridCell = shouldRenderChild ? <CalendarCell key={k} children={childElement}/>  
                : <CalendarCell key={k} />;     */
                row.push(<CalendarCell key={k} styleProp={styleProp}/>);
            }
            newGrid.push(row);
        }
        setGrid(newGrid);
    }, []);

    return (
        <div className={styles.calendar}>
            <div className={styles.dayLabelContainer}/>
            {/* Displaying the rest of the calendar */}
            <div className={styles.timeAndGrid}>
                <div className={styles.calendarGrid}>
                    {/* Displaying day labels */}
                    <div className={styles.timeBlock}/>
                    {daysOfWeek.map(day => (
                        <div key={day} className={styles.day}>
                        {day}
                        </div>
                    ))}
                    {grid.map((row, rowIndex) => (row))}
                    {courseCells.map((block: CalendarGridCourse) => (
                         <div
                            key={`${block}`}
                            style={{
                                gridColumn: `${block.calendarGridPoint.dayIndex + 1}`,
                                gridRow: `${block.calendarGridPoint.startIndex + 1} / ${block.calendarGridPoint.endIndex + 1}`,
                            }}
                        >
                            <CalendarCourseCell
                                courseDeptAndInstr={block.componentProps.courseDeptAndInstr}
                                timeAndLocation={block.componentProps.timeAndLocation}
                                status={block.componentProps.status}
                                colors={block.componentProps.colors}
                            />
                        </div>  
                    ))} 
                </div>
            </div>
        </div>
    );
}

export default CalendarGrid;


/* <div className={styles.buttonContainer}>
                <div className={styles.divider} /> 
                <button className={styles.calendarButton}>
                    <img src={calIcon} className={styles.buttonIcon} alt='CAL' />
                    Save as .CAL
                </button>
                <div className={styles.divider} />
                <button onClick={saveAsPNG} className={styles.calendarButton}>
                    <img src={pngIcon} className={styles.buttonIcon} alt='PNG' />
                    Save as .PNG
                </button>
                        </div>  */