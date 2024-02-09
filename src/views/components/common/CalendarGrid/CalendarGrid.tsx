import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';

const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['SAT', 'SUN'].includes(key));
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);
const grid = [];
for (let i = 0; i < 13; i++) {
  const row = [];
  row.push(hoursOfDay[i]);
  row.push(Array.from({ length: 5 }, (_, j) => <CalendarCell key={j} />));
  grid.push(row);
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
const Calendar: React.FC = (props) => {
  return (
    <div className={styles.calendar}>
      <div className={styles.dayLabelContainer}>
        {/* Empty cell in the top-left corner */}
        <div className={styles.day} />
        
      </div>
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
          <div className={styles.timeBlock}></div>
          {daysOfWeek.map(day => (
            <div key={day} className={styles.day}>
              {day}
            </div>
          ))}
          {grid.map((row, rowIndex) => (
            row
          ))}
        </div>
      </div>
    </div>
  )
};

export default Calendar;
