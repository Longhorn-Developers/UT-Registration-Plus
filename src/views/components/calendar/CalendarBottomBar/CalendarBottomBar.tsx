import { saveAsCal, saveCalAsPng } from '@views/components/calendar/utils';
import { Button } from '@views/components/common/Button/Button';
import Divider from '@views/components/common/Divider/Divider';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import ImageIcon from '~icons/material-symbols/image';

import type { CalendarCourseCellProps } from '../CalendarCourseCell/CalendarCourseCell';
import CalendarCourseBlock from '../CalendarCourseCell/CalendarCourseCell';

type CalendarBottomBarProps = {
    courses?: CalendarCourseCellProps[];
    calendarRef: React.RefObject<HTMLDivElement>;
};

/**
 * Renders the bottom bar of the calendar component.
 *
 * @param {Object[]} courses - The list of courses to display in the calendar.
 * @param {React.RefObject} calendarRef - The reference to the calendar component.
 * @returns {JSX.Element} The rendered bottom bar component.
 */
export default function CalendarBottomBar({ courses, calendarRef }: CalendarBottomBarProps): JSX.Element {
    const displayCourses = courses && courses.length > 0;

    return (
        <div className='w-full flex py-1.25'>
            <div
                className={`flex flex-grow items-center gap-3.75 ${displayCourses ? '' : 'py-7'} pl-7.5 pr-2.5 text-nowrap`}
            >
                {displayCourses ? (
                    <>
                        <Text variant='h4'>Async. and Other:</Text>
                        <div className='h-14 inline-flex gap-2.5'>
                            {courses.map(({ courseDeptAndInstr, status, colors, className }) => (
                                <CalendarCourseBlock
                                    courseDeptAndInstr={courseDeptAndInstr}
                                    status={status}
                                    colors={colors}
                                    key={courseDeptAndInstr}
                                    className={clsx(className, 'w-35!')}
                                />
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
            <div className='flex items-center pl-2.5 pr-7.5'>
                {displayCourses ? <Divider orientation='vertical' size='1rem' className='mx-1.25' /> : null}
                <Button variant='single' color='ut-black' icon={CalendarMonthIcon} onClick={saveAsCal}>
                    Save as .CAL
                </Button>
                <Divider orientation='vertical' size='1rem' className='mx-1.25' />
                <Button variant='single' color='ut-black' icon={ImageIcon} onClick={() => saveCalAsPng(calendarRef)}>
                    Save as .PNG
                </Button>
            </div>
        </div>
    );
}
