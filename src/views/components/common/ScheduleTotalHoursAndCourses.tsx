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
                        className='font-all-small-caps! capitalize screenshot:inline sm:inline'
                    >
                        {totalHours === 1 ? 'Hour' : 'Hours'}
                    </Text>
                </div>
                <div className='flex flex-row items-center gap-1.25 text-theme-black'>
                    <Text variant='h3' as='span' className='capitalize screenshot:inline sm:inline'>
                        {totalCourses}
                    </Text>
                    <Text
                        variant='h3'
                        as='span'
                        className='font-all-small-caps! capitalize screenshot:inline sm:inline'
                    >
                        {totalCourses === 1 ? 'Course' : 'Courses'}
                    </Text>
                </div>
            </div>
        </div>
    );
}
