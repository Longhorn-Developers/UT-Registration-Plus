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
        <div className='w-full flex flex-col items-start'>
            <div className='max-w-full overflow-hidden'>
                <Text className='block w-full truncate text-ut-burntorange' variant='h1' as='span'>
                    {scheduleName}
                </Text>
            </div>
            <Text variant='h3' as='div' className='flex flex-row items-center gap-2.5 text-theme-black'>
                <Text variant='h4' as='span' className='inline text-theme-black'>
                    {totalHours}&nbsp;
                    <Text variant='h3' as='span' className='inline text-theme-black font-all-small-caps!'>
                        {totalHours === 1 ? 'Hour' : 'Hours'}
                    </Text>
                </Text>
                <Text variant='h4' as='span' className='inline text-theme-black'>
                    {totalCourses}&nbsp;
                    <Text variant='h3' as='span' className='inline text-theme-black font-all-small-caps!'>
                        {totalCourses === 1 ? 'Course' : 'Courses'}
                    </Text>
                </Text>
            </Text>
        </div>
    );
}
