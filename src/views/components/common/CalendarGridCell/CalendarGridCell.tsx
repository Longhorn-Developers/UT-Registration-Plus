import React from 'react';
import styles from './CalendarGridCell.module.scss';

const CalendarCell: React.FC = (props) => {
  return (
    <div className={styles['calendar-cell']}>
      <div className={styles['hour-line']}></div>
    </div>
  );
};

export default CalendarCell;
