import classnames from 'classnames';
import React from 'react';
import styles from './Dropdown.module.scss';
import IcBaselineArrowDropUp from '~icons/ic/baseline-arrow-drop-up'

export type Props = {
    // color?: Color | React.CSSProperties['borderColor'];
    style?: React.CSSProperties;
    className?: string;
    testId?: string;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
export default function Dropdown(props: Props) {
    const [expanded, toggle] = React.useState(false);
    const [hours, addHours] = React.useState(22);
    const [courses, addCourse] = React.useState(8);
    const toggleSwitch = () => {
        toggle(!expanded);
    }

    const setHours = (newHours) => {
        addHours(newHours)
    }

    const setCourses = (newCourses) => {
        addCourse(newCourses);
    }
    
    return (
        <button
            onClick={toggleSwitch}
            style={props.style} 
            data-testid={props.testId} 
            className={classnames(styles.dropdown, props.className)}
        >
        <p className={styles.title}>MAIN SCHEDULE:</p>
        <p className={styles.info}>{hours} HOURS {courses} Courses</p>
        <DropdownArrowUp/>
        {expanded ? (
            <ul className="menu">
                <li className="item">
                    <button>Menu 1</button>
                </li>
                <li className="item">
                    <button>Menu 2</button>
                </li>
            </ul>
        )
        : null}
        </button>
    );
}
