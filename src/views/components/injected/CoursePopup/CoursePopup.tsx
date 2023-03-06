import React from 'react';
import { Course } from 'src/shared/types/Course';
import Icon from '../../common/Icon/Icon';
import Popup from '../../common/Popup/Popup';
import styles from './CoursePopup.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CoursePopup({ course, onClose }: Props) {
    return (
        <Popup overlay>
            <div className={styles.popupBody}>
                <div className={styles.courseTitle}>{course.courseName}</div>
                <div className={styles.courseDescription}>{course.uniqueId}</div>
            </div>
        </Popup>
    );
}
