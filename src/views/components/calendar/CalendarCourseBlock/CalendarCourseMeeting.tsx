import React from 'react';
import { Course } from 'src/shared/types/Course';
import { CourseMeeting } from 'src/shared/types/CourseMeeting';
import styles from './CalendarCourseMeeting.module.scss';

/**
 * Props for the CalendarCourseMeeting component.
 */
export interface CalendarCourseMeetingProps {
    /** The Course that the meeting is for. */
    course: Course;
    /* index into course meeting array to display */
    meetingIdx?: number;
    /** The background color for the course. */
    color: string;
    /** The icon to display on the right side of the course. This is optional. */
    rightIcon?: React.ReactNode;
}

/**
 * `CalendarCourseMeeting` is a functional component that displays a course meeting.
 *
 * @example
 * <CalendarCourseMeeting course={course} meeting={meeting} color="red" rightIcon={<Icon />} />
 */
const CalendarCourseMeeting: React.FC<CalendarCourseMeetingProps> = ({
    course,
    meetingIdx,
}: CalendarCourseMeetingProps) => {
    let meeting: CourseMeeting | null = meetingIdx !== undefined ? course.schedule.meetings[meetingIdx] : null;
    return (
        <div className={styles.component}>
            <div className={styles.content}>
                <div className={styles['course-detail']}>
                    <div className={styles.course}>
                        {course.department} {course.number} - {course.instructors[0].lastName}
                    </div>
                    <div className={styles['time-and-location']}>
                        {`${meeting.getTimeString({ separator: '-', capitalize: true })}${
                            meeting.location ? ` - ${meeting.location.building}` : ''
                        }`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarCourseMeeting;
