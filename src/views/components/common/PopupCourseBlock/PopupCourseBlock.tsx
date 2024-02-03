import React from 'react';
import { Course } from 'src/shared/types/Course';

type PopupCourseBlockProps = {
    className?: string;
    style?: React.CSSProperties;
    course: Course;
};

/**
 *
 * @param props
 */
export default function PopupCourseBlock({ className, style, course }: PopupCourseBlockProps) {
    return (
        <div className={className} style={style}>
            {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.map(v => v.lastName)}`}
        </div>
    );
}
