import React from 'react';
import { Course } from 'src/shared/types/Course';
import Popup from '../../common/Popup/Popup';
import CourseInfoDescription from './CourseInfoDescription/CourseInfoDescription';
import CourseInfoHeader from './CourseInfoHeader/CourseInfoHeader';
import styles from './CourseInfoPopup.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CourseInfoPopup({ course, onClose }: Props) {
    console.log(course);
    return (
        <Popup className={styles.popup} overlay onClose={onClose}>
            <CourseInfoHeader course={course} onClose={onClose} />
            <CourseInfoDescription course={course} />
        </Popup>
    );
}
