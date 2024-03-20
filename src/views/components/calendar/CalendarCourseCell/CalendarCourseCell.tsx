import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseColors } from '@shared/types/ThemeColors';
import { pickFontColor } from '@shared/util/colors';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

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
    onClick?: React.MouseEventHandler<HTMLDivElement>;
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
export default function CalendarCourseCell({
    courseDeptAndInstr,
    timeAndLocation,
    status,
    colors,
    className,
    onClick,
}: CalendarCourseCellProps): JSX.Element {
    let rightIcon: React.ReactNode | null = null;
    if (status === Status.WAITLISTED) {
        rightIcon = <WaitlistIcon className='h-5 w-5' />;
    } else if (status === Status.CLOSED) {
        rightIcon = <ClosedIcon className='h-5 w-5' />;
    } else if (status === Status.CANCELLED) {
        rightIcon = <CancelledIcon className='h-5 w-5' />;
    }

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);

    return (
        <div
            className={clsx(
                'h-full min-w-full w-0 flex justify-center rounded p-2 cursor-pointer',
                fontColor,
                className
            )}
            style={{
                backgroundColor: colors.primaryColor,
            }}
            onClick={onClick}
        >
            <div
                className={clsx('flex flex-1 flex-col gap-0.25 overflow-hidden max-h-full', {
                    'self-center': !timeAndLocation,
                })}
            >
                <Text
                    variant='h1-course'
                    as='p'
                    className={clsx('leading-tight! truncate', {
                        '-mt-0.8 -mb-0.2': timeAndLocation,
                        'text-wrap': !timeAndLocation,
                    })}
                >
                    {courseDeptAndInstr}
                </Text>
                {timeAndLocation && (
                    <Text variant='h3-course' as='p'>
                        {timeAndLocation}
                    </Text>
                )}
            </div>
            {rightIcon && (
                <div
                    className='screenshot:hidden h-fit flex items-center justify-center justify-self-start rounded p-0.5 text-white'
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                >
                    {rightIcon}
                </div>
            )}
        </div>
    );
}
