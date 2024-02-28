import { Status } from '@shared/types/Course';
import type { StatusType } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';
import type { CourseColors } from 'src/shared/util/colors';
import { pickFontColor } from 'src/shared/util/colors';

import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';

/**
 * Props for the CalendarCourseCell component.
 */
export interface CalendarCourseCellProps {
    courseDeptAndInstr: string;
    timeAndLocation?: string;
    status: StatusType;
    colors: CourseColors;
    className?: string;
}

/**
 * Renders a cell for a calendar course.
 *
 * @component
 * @param {CalendarCourseCellProps} props - The component props.
 * @param {string} props.courseDeptAndInstr - The course department and instructor.
 * @param {string} props.timeAndLocation - The time and location of the course.
 * @param {StatusType} props.status - The status of the course.
 * @param {Colors} props.colors - The colors for styling the cell.
 * @param {string} props.className - Additional CSS class name for the cell.
 * @returns {JSX.Element} The rendered component.
 */
const CalendarCourseCell: React.FC<CalendarCourseCellProps> = ({
    courseDeptAndInstr,
    timeAndLocation,
    status,
    colors,
    className,
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
            className={clsx('h-full w-full flex justify-center rounded p-2 overflow-x-hidden', fontColor, className)}
            style={{
                backgroundColor: colors.primaryColor,
            }}
        >
            <div className='flex flex-1 flex-col gap-1'>
                <Text
                    variant='h1-course'
                    className={clsx('-my-0.8 leading-tight', {
                        truncate: timeAndLocation,
                    })}
                >
                    {courseDeptAndInstr}
                </Text>
                {timeAndLocation && (
                    <Text variant='h3-course' className='-mb-0.5'>
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
