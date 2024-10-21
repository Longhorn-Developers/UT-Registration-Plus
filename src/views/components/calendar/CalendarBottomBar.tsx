import type { Course } from '@shared/types/Course';
import { saveAsCal, saveCalAsPng } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import Text from '@views/components/common/Text/Text';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import React from 'react';

import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import ImageIcon from '~icons/material-symbols/image';

import CalendarCourseBlock from './CalendarCourseCell';

type CalendarBottomBarProps = {
    courseCells?: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
};

/**
 * Renders the bottom bar of the calendar component.
 *
 * @param {Object[]} courses - The list of courses to display in the calendar.
 * @returns {JSX.Element} The rendered bottom bar component.
 */
export default function CalendarBottomBar({ courseCells, setCourse }: CalendarBottomBarProps): JSX.Element {
    const asyncCourseCells = courseCells?.filter(block => block.async);
    const displayCourses = asyncCourseCells && asyncCourseCells.length > 0;

    return (
        <div className='w-full flex py-1.25 pl-7.5 pr-6.25'>
            <div
                className={clsx('flex flex-grow items-center gap-3.75 text-nowrap', {
                    'py-7.5': !displayCourses,
                })}
            >
                {displayCourses && (
                    <>
                        <Text variant='p' className='text-ut-black'>
                            ASYNC/OTHER
                        </Text>
                        <Text variant='h4' className='text-gray-300'>
                            —
                        </Text>
                        <div className='inline-flex gap-2.5'>
                            {asyncCourseCells.map(block => {
                                const { courseDeptAndInstr, status, colors, className } = block.componentProps;
                                return (
                                    <CalendarCourseBlock
                                        courseDeptAndInstr={courseDeptAndInstr}
                                        status={status}
                                        colors={colors}
                                        key={courseDeptAndInstr}
                                        className={clsx(className, 'w-35! h-15!')}
                                        onClick={() => setCourse(block.course)}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            <div className='flex items-center screenshot:hidden'>
                {displayCourses && <Divider orientation='vertical' size='1rem' className='mx-1.25' />}
                <Button variant='single' color='ut-black' icon={CalendarMonthIcon} onClick={saveAsCal}>
                    Save as .CAL
                </Button>
                <Divider orientation='vertical' size='1rem' className='mx-1.25' />
                <Button
                    variant='single'
                    color='ut-black'
                    icon={ImageIcon}
                    onClick={() => requestAnimationFrame(() => saveCalAsPng())}
                >
                    Save as .PNG
                </Button>
            </div>
        </div>
    );
}
