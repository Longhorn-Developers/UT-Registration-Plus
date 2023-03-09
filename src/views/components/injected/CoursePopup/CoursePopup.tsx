import React from 'react';
import { Course } from 'src/shared/types/Course';
import Popup from '../../common/Popup/Popup';
import CourseDescription from './CourseDescription/CourseDescription';
import CourseHeader from './CourseHeader/CourseHeader';
import styles from './CoursePopup.module.scss';
import GradeDistribution from './GradeDistribution/GradeDistribution';

interface Props {
    course: Course;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CoursePopup({ course, onClose }: Props) {
    return (
        <Popup className={styles.popup} overlay onClose={onClose}>
            <CourseHeader course={course} onClose={onClose} />
            <CourseDescription course={course} />
            <GradeDistribution course={course} />
        </Popup>
    );
}
