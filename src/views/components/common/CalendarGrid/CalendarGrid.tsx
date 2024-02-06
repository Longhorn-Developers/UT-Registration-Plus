import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';

const daysOfWeek = Object.values(DAY_MAP);
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props 
 */
const Calendar: React.FC = (props) => {
  return (
    <div className={styles.calendar}>
      <div className={styles.dayLabelContainer}></div>
      {daysOfWeek.map((day, dayIndex) => (
        <div key={dayIndex} className={styles.day}>
          <div className={styles.dayLabelContainer}>
            <div className={styles.dayLabel}>{day}</div>
          </div>
          {hoursOfDay.map((hour) => (
            <div key={`${day}-${hour}`} className={styles.timeBlock}>
              <div className={styles.timeLabelContainer}>
                <span>{hour}:00</span>
              </div>
              <CalendarCell />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;