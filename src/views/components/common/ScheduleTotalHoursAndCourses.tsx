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
        <div className='min-w-full w-0 flex items-center gap-2.5 whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange uppercase' variant='h1' as='span'>
                {`${scheduleName}: `}
            </Text>
            <Text variant='h3' as='div' className='flex flex-row items-center gap-2 text-theme-black'>
                {totalHours} {totalHours === 1 ? 'Hour' : 'Hours'}
                <Text variant='h4' as='span' className='hidden capitalize screenshot:inline sm:inline'>
                    {totalCourses} {totalCourses === 1 ? 'Course' : 'Courses'}
                </Text>
            </Text>
        </div>
    );
}
