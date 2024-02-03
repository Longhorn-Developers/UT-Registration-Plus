import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';

/**
 * a map of the days of the week that a class is taught, and the corresponding abbreviation
 */
export const DAY_MAP = {
  M: 'Monday',
  T: 'Tuesday',
  W: 'Wednesday',
  TH: 'Thursday',
  F: 'Friday',
  S: 'Saturday',
  SU: 'Sunday',
} as const;
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
          <div key={dayIndex} className={styles.dayy}>
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