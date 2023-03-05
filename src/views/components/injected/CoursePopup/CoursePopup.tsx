import React from 'react';
import { Course } from 'src/shared/types/Course';
import { Button } from '../../common/Button/Button';
import styles from './CoursePopup.module.scss';

interface Props {
    course: Course;
    onClose: () => void;
}

export default function CoursePopup({ course, onClose }: Props) {
    return (
        <div>
            <h1>{course.fullName}</h1>
            <p>{course.description}</p>
            <Button onClick={onClose}>Close</Button>
        </div>
    );
}
