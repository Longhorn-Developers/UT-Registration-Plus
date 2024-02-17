import React from 'react';
import Text from '../Text/Text';
import CalendarCourseBlock from '../CalendarCourseCell/CalendarCourseCell';
import { Course } from '../../../../shared/types/Course';
import { Button } from '../Button/Button';
import ImageIcon from '~icons/material-symbols/image';
import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import { getCourseColors } from '../../../../shared/util/colors';

type CalendarBottomBarProps = {
    courses: Course[];
};

/**
 *
 */
export const CalendarBottomBar = ({ courses }: CalendarBottomBarProps): JSX.Element => {
    if (courses.length === -1) console.log('foo'); // dumb line to make eslint happy
    return (
        <div className='w-full flex py-1.25'>
            <div className='flex flex-grow items-center gap-3.75 pl-7.5 pr-2.5'>
                <Text variant='h4'>Async. and Other:</Text>
                <div className='h-14 inline-flex gap-2.5'>
                    {courses.map(course => (
                        <CalendarCourseBlock
                            course={course}
                            colors={getCourseColors('orange')}
                            key={course.uniqueId}
                            className='w-35!'
                        />
                    ))}
                </div>
            </div>
            <div className='flex items-center pl-2.5 pr-7.5'>
                <Button variant='single' color='ut-black' icon={CalendarMonthIcon}>
                    Save as .CAL
                </Button>
                <Button variant='single' color='ut-black' icon={ImageIcon}>
                    Save as .PNG
                </Button>
            </div>
        </div>
    );
};
