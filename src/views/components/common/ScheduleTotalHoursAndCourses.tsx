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
        <div className='flex flex-col items-start gap-1 whitespace-nowrap'>
            <Text className='w-full truncate text-ut-burntorange normal-case!' variant='h1' as='span'>
                {`${scheduleName} `}
            </Text>
            <Text variant='h3' as='div' className='flex flex-row items-center gap-2.5 text-theme-black'>
                <Text variant='h4' as='span' className='hidden text-ut-black uppercase screenshot:inline sm:inline'>
                    {totalHours} {totalHours === 1 ? 'Hour' : 'Hours'}
                </Text>

                <Text variant='h4' as='span' className='hidden text-ut-black uppercase screenshot:inline sm:inline'>
                    {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
                </Text>
            </Text>
        </div>
    );
}
