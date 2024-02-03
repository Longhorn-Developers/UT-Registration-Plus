import React from 'react';
import styles from './CalendarSidebar.module.scss';
import Icon from '../Icon/Icon';
import Divider from '../Divider/Divider';

const CalendarSidebar: React.FC = () => {
    return (
        <div className={styles.sidebar}>
            <div className={styles.headerContainer}>
                <h2>MY SCHEDULES</h2>
                <Icon name="add"/>
            </div>
            <Divider style={{ width: '100%' }} type="solid" />
            <div className={styles.headerContainer}>
                <h2>IMPORTANT LINKS</h2>
                <Icon name="add"/>
            </div>
        </div>
    );
};

export default CalendarSidebar;