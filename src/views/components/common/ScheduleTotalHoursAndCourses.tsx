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
        <div className='block min-w-full w-0 items-center gap-2.5 whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange uppercase' variant='h1' as='span'>
                {`${scheduleName}:`}
            </Text>
            <br />
            <div className='flex flex-row items-center gap-2.5 text-ut-black'>
                <div className='flex flex-row items-center gap-1 text-ut-black font-normal'>
                    <Text variant='h4' as='span' className='hidden capitalize screenshot:inline sm:inline'>
                        {totalHours}
                    </Text>{' '}
                    <span className='font-bold' style={{ fontVariant: 'all-small-caps' }}>
                        {totalHours === 1 ? 'Hour' : 'Hours'}
                    </span>
                </div>
                <div className='flex flex-row items-center gap-1 text-ut-black'>
                    <Text variant='h4' as='span' className='hidden font-normal capitalize screenshot:inline sm:inline'>
                        {totalCourses}
                    </Text>{' '}
                    <span className='font-bold' style={{ fontVariant: 'all-small-caps' }}>
                        {totalCourses === 1 ? 'Course' : 'Courses'}
                    </span>
                </div>
            </div>
        </div>
    );
}
