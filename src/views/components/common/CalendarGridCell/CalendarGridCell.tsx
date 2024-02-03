import React from 'react';
import styles from './CalendarGridCell.module.scss';

const CalendarCell: React.FC = (props) => {
  return (
    <div className={styles.calendarCell}>
      <div className={styles.hourLine}></div>
    </div>
  );
};

export default CalendarCell;
