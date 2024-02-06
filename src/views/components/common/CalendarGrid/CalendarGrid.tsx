import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';

const daysOfWeek = Object.values(DAY_MAP);
daysOfWeek.pop();
daysOfWeek.pop();
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

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
      {hoursOfDay.map((hour) => (
        <div key={hour} className={styles.row}>
          {/* Hour column */}
          <div className={styles.timeLabelContainer}>
            <span>{hour}:00</span>
          </div>
          {/* Calendar cells for each day */}
          {daysOfWeek.map((day, dayIndex) => (
            <div key={`${day}-${hour}`} className={styles.timeBlock}>
              <CalendarCell />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;