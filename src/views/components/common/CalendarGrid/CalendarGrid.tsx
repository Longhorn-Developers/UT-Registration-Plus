import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';

const daysOfWeek = Object.values(DAY_MAP);
daysOfWeek.pop();
daysOfWeek.pop();
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);
const grid = Array.from({ length: 5 }, () =>
  Array.from({ length: 13 }, (_, columnIndex) => (
    <CalendarCell key={columnIndex} />
  ))
);

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
        {/* Displaying day labels */}
        {daysOfWeek.map(day => (
          <div key={day} className={styles.day}>
            {day}
          </div>
        ))}
      </div>
      {/* Displaying the rest of the calendar */}
      <div className={styles.timeAndGrid}>
        <div className={styles.timeColumn}>
          {hoursOfDay.map((hour) => (
            <div key={hour} className={styles.timeBlock}>
              <div className={styles.timeLabelContainer}>
                <p>{hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? 'AM' : 'PM'}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {grid.map((row, rowIndex) => (
            row
          ))}
        </div>
      </div>
    </div>
  )
};

export default Calendar;
