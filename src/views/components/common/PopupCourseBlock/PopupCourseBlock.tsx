import React from 'react';
import { Course } from 'src/shared/types/Course';
import classNames from 'classnames';
import styles from './PopupCourseBlock.module.scss';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';

type PopupCourseBlockProps = {
    className?: string;
    style?: React.CSSProperties;
    course: Course;
};

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({ className, style, course }: PopupCourseBlockProps): JSX.Element {
    return (
        <div className={classNames(className, styles.courseBlock)} style={style}>
            <div className={styles.dragHandle}>⋮⋮</div>
            <Text className={styles.courseInfo} variant='h1-course'>
                {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.map(v => v.lastName)}`}
            </Text>
            <Icon className={styles.icon} name='timelapse' />
        </div>
    );
}
