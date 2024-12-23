import Text from '@views/components/common/Text/Text';
import React from 'react';

/**
 * Props for ScheduleTotalHoursAndCourses
 */
export interface ScheduleTotalHoursAndCoursesProps {
    scheduleName: string;
    totalHours: number;
    totalCourses: number;
}

/**
 * The ScheduleTotalHoursAndCourses as per the Labels and Details Figma section
 *
 * @param scheduleName - The name of the schedule.
 * @param totalHours - The total number of hours.
 * @param totalCourses - The total number of courses.
 * @returns The rendered ScheduleTotalHoursAndCourses component.
 */
export default function ScheduleTotalHoursAndCourses({
    scheduleName,
    totalHours,
    totalCourses,
}: ScheduleTotalHoursAndCoursesProps): JSX.Element {
    return (
        <div className='min-w-full w-0 items-center whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange normal-case!' variant='h1' as='span'>
                {scheduleName}
            </Text>
            <div className='flex flex-row items-center gap-2.5 text-theme-black'>
                <div className='flex flex-row items-center gap-1.25 text-theme-black'>
                    <Text variant='h3' as='span' className='capitalize screenshot:inline sm:inline'>
                        {totalHours}
                    </Text>
                    <Text
                        variant='h3'
                        as='span'
                        className='capitalize screenshot:inline sm:inline font-all-small-caps!'
                    >
                        {totalHours === 1 ? 'HOUR' : 'HOURS'}
                    </Text>
                </div>
                <div className='flex flex-row items-center gap-1.25 text-theme-black'>
                    <Text variant='h3' as='span' className='capitalize screenshot:inline sm:inline'>
                        {totalCourses}
                    </Text>
                    <Text
                        variant='h3'
                        as='span'
                        className='capitalize screenshot:inline sm:inline font-all-small-caps!'
                    >
                        {totalCourses === 1 ? 'COURSE' : 'COURSES'}
                    </Text>
                </div>
            </div>
        </div>
    );
}
