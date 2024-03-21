import type { Course } from '@shared/types/Course';
import React from 'react';

import styles from './CalendarCourseMeeting.module.scss';

/**
 * Props for the CalendarCourseMeeting component.
 */
export interface CalendarCourseMeetingProps {
    /** The Course that the meeting is for. */
    course: Course;
    /* index into course meeting array to display */
    meetingIdx?: number;
}

/**
 * `CalendarCourseMeeting` is a functional component that displays a course meeting.
 *
 * @example
 * <CalendarCourseMeeting course={course} meeting={meeting} />
 */
export default function CalendarCourseMeeting({ course, meetingIdx }: CalendarCourseMeetingProps): JSX.Element | null {
    let meeting = meetingIdx !== undefined ? course.schedule.meetings[meetingIdx] : undefined;

    if (!meeting) {
        return null;
    }

    return (
        <div className={styles.component}>
            <div className={styles.content}>
                <div className={styles['course-detail']}>
                    <div className={styles.course}>
                        {course.department} {course.number} - {course.instructors[0]?.lastName}
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
}
