import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Popup from '@views/components/common/Popup/Popup';
import React from 'react';

import CourseDescription from './CourseDescription/CourseDescription';
import CourseHeader from './CourseHeader/CourseHeader';
import styles from './CoursePopup.module.scss';
import GradeDistribution from './GradeDistribution/GradeDistribution';

interface Props {
    course: Course;
    activeSchedule?: UserSchedule;
    onClose: () => void;
}

/**
 * The popup that appears when the user clicks on a course for more details.
 */
export default function CoursePopup({ course, activeSchedule, onClose }: Props) {
    return (
        <Popup className={styles.popup} overlay onClose={onClose}>
            <CourseHeader course={course} activeSchedule={activeSchedule} onClose={onClose} />
            <CourseDescription course={course} />
            <GradeDistribution course={course} />
        </Popup>
    );
}
