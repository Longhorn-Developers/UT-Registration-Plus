import React from 'react';
import styles from './CalendarGridCell.module.scss';

/**
 * Component representing each 1 hour time block of a calendar
 * @param props
 */
const CalendarCell: React.FC = (props) => {
  return (
    <div className={styles.calendarCell}>
      <div className={styles.hourLine}>
        TEMP
      </div>
    </div>
  );
};

export default CalendarCell;
