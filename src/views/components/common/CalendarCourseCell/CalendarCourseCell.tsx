import { Status } from '@shared/types/Course';
import React from 'react';
import { CourseColors, pickFontColor } from 'src/shared/util/colors';
import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';
import Text from '../Text/Text';

    /** The Course that the meeting is for. */
    course: Course;
    /* index into course meeting array to display */
    meetingIdx?: number;
    colors: CourseColors;
}

const CalendarCourseCell: React.FC<CalendarCourseCellProps> = ({
    courseDeptAndInstr,
    timeAndLocation,
    status,
    colors,
}: CalendarCourseCellProps) => {
    let rightIcon: React.ReactNode | null = null;
    if (status === Status.WAITLISTED) {
        rightIcon = <WaitlistIcon className='h-5 w-5' />;
    } else if (status === Status.CLOSED) {
        rightIcon = <ClosedIcon className='h-5 w-5' />;
    } else if (status === Status.CANCELLED) {
        rightIcon = <CancelledIcon className='h-5 w-5' />;
    }

    // whiteText based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);

    return (
        <div
            className={`w-full flex justify-center rounded p-2 ${fontColor}`}
            style={{
                backgroundColor: colors.primaryColor,
            }}
        >
            <div className='flex flex-1 flex-col gap-1'>
                <Text variant='h1-course' className='leading-[75%]!'>
                    {courseDeptAndInstr}
                </Text>
                {timeAndLocation && (
                    <Text variant='h3-course' className='leading-[75%]!'>
                        {timeAndLocation}
                    </Text>
                )}
            </div>
            {rightIcon && (
                <div
                    className='h-fit flex items-center justify-center justify-self-start rounded p-0.5 text-white'
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                >
                    {rightIcon}
                </div>
            )}
        </div>
    );
};

export default CalendarCourseCell;
