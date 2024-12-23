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
        <div className='min-w-full flex flex-col items-start whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange' variant='h1' as='span'>
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
