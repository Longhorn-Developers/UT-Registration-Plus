import React from 'react';

import styles from './CalendarGridCell.module.scss';

interface Props {
    styleProp: any;
}

/**
 * Component representing each 1 hour time block of a calendar
 * @param props
 */
function CalendarCell({ styleProp }: Props): JSX.Element {
    return (
        <div className={styles.calendarCell} style={styleProp}>
            <div className={styles.hourLine} />
        </div>
    );
}

export default CalendarCell;
