import { ClockUser, LockKey, Prohibit } from '@phosphor-icons/react';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseColors } from '@shared/types/ThemeColors';
import { pickFontColor } from '@shared/util/colors';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

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
 * @param courseDeptAndInstr - The course department and instructor.
 * @param timeAndLocation - The time and location of the course.
 * @param status - The status of the course.
 * @param colors - The colors for styling the cell.
 * @param className - Additional CSS class name for the cell.
 * @returns The rendered component.
 */
export default function CalendarCourseCell({
    courseDeptAndInstr,
    timeAndLocation,
    status,
    colors,
    className,
    onClick,
}: CalendarCourseCellProps): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips }) => setEnableCourseStatusChips(enableCourseStatusChips));

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        return () => {
            OptionsStore.removeListener(l1);
        };
    }, []);

    let rightIcon: React.ReactNode | null = null;
    if (enableCourseStatusChips) {
        if (status === Status.WAITLISTED) {
            rightIcon = <ClockUser weight='fill' className='h-5 w-5' />;
        } else if (status === Status.CLOSED) {
            rightIcon = <LockKey weight='fill' className='h-5 w-5' />;
        } else if (status === Status.CANCELLED) {
            rightIcon = <Prohibit weight='fill' className='h-5 w-5' />;
        }
    }

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    // Note that overflow-hidden is the duct tape holding this all together

    return (
        <div
            className={clsx(
                'h-full w-0 flex justify-center rounded p-x-2 p-y-1.2 cursor-pointer hover:shadow-md transition-shadow-100 ease-out',
                {
                    'min-w-full': timeAndLocation,
                    'w-full': !timeAndLocation,
                },
                fontColor,
                className
            )}
            style={{
                backgroundColor: colors.primaryColor,
            }}
            onClick={onClick}
        >
            <div className={clsx('flex flex-1 flex-col gap-0.25 overflow-hidden max-h-full')}>
                <Text
                    variant='h1-course'
                    as='p'
                    className={clsx('leading-tight! truncate overflow-clip!', {
                        '-mb-0.2': timeAndLocation,
                        'text-wrap': !timeAndLocation,
                    })}
                >
                    {courseDeptAndInstr}
                </Text>
                {timeAndLocation && (
                    <Text variant='h3-course' as='p' className='whitespace-pre-line'>
                        {timeAndLocation}
                    </Text>
                )}
            </div>
            {rightIcon && (
                <div
                    className='h-fit flex items-center justify-center justify-self-start rounded p-0.5 text-white screenshot:hidden'
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
