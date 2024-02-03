import React from 'react';
import { Course } from 'src/shared/types/Course';
import { CourseMeeting } from 'src/shared/types/CourseMeeting';
import Text from '../Text/Text';
import styles from './CalendarCourseBlock.module.scss';

export interface CalendarCourseBlockProps {
    /** The Course that the meeting is for. */
    course: Course;
    /* index into course meeting array to display */
    meetingIdx?: number;
    /** The background color for the course. */
    color: string;
}

const CalendarCourseBlock: React.FC<CalendarCourseBlockProps> = ({ course, meetingIdx }: CalendarCourseBlockProps) => {
    let meeting: CourseMeeting | null = meetingIdx !== undefined ? course.schedule.meetings[meetingIdx] : null;
    return (
        <div className={styles.component}>
            <div className={styles.content}>
                <div className={styles['course-detail']}>
                    <Text variant='h1-course'>
                        {course.department} {course.number} - {course.instructors[0].lastName}
                    </Text>
                    <Text variant='h3-course'>
                        {`${meeting.getTimeString({ separator: '-', capitalize: true })}${
                            meeting.location ? ` - ${meeting.location.building}` : ''
                        }`}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default CalendarCourseBlock;
