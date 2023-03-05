import React from 'react';
import { Course } from 'src/shared/types/Course';
import styles from './CoursePopup.module.scss';

interface Props {
    course: Course;
}

export default function CoursePopup({ course }: Props) {
    return (
        <div>
            <h1>{course.fullName}</h1>
            <p>{course.description}</p>
        </div>
    );
}
