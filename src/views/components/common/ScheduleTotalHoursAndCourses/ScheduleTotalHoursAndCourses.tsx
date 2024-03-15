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
 * @param props ScheduleTotalHoursAndCoursesProps
 */
export default function ScheduleTotalHoursAndCourses({
    scheduleName,
    totalHours,
    totalCourses,
}: ScheduleTotalHoursAndCoursesProps): JSX.Element {
    return (
        <div className='min-w-64 flex content-center items-baseline gap-2 whitespace-nowrap uppercase'>
            <Text className='text-ut-burntorange' variant='h1' as='span'>
                {`${scheduleName}: `}
            </Text>
            <Text variant='h3' as='div' className='flex flex-row items-center gap-2 text-theme-black'>
                {totalHours} {totalHours === 1 ? 'HOUR' : 'HOURS'}
                <Text variant='h4' as='span' className='text-ut-black'>
                    {totalCourses} {totalCourses === 1 ? 'COURSE' : 'COURSES'}
                </Text>
            </Text>
        </div>
    );
}
