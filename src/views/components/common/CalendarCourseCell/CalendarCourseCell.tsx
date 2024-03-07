import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseMeeting } from '@shared/types/CourseMeeting';
import React from 'react';

import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';

import Text from '../Text/Text';

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
    let rightIcon: React.ReactNode | null = null;
    if (course.status === Status.WAITLISTED) {
        rightIcon = <WaitlistIcon className='h-5 w-5' />;
    } else if (course.status === Status.CLOSED) {
        rightIcon = <ClosedIcon className='h-5 w-5' />;
    } else if (course.status === Status.CANCELLED) {
        rightIcon = <CancelledIcon className='h-5 w-5' />;
    }

    return (
        <div className='w-full flex justify-center rounded bg-slate-300 p-2 text-ut-black'>
            <div className='flex flex-1 flex-col gap-1'>
                <Text variant='h1-course' className='leading-[75%]!'>
                    {course.department} {course.number} - {course.instructors[0].lastName}
                </Text>
                <Text variant='h3-course' className='leading-[75%]!'>
                    {`${meeting.getTimeString({ separator: '–', capitalize: true })}${
                        meeting.location ? ` – ${meeting.location.building}` : ''
                    }`}
                </Text>
            </div>
            {rightIcon && (
                <div className='h-fit flex items-center justify-center justify-self-start rounded bg-slate-700 p-0.5 text-white'>
                    {rightIcon}
                </div>
            )}
        </div>
    );
};

export default CalendarCourseBlock;
