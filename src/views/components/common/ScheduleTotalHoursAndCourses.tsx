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
        <div className='min-w-full w-0 flex items-baseline gap-5 whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange uppercase' variant='h1' as='span'>
                {`${scheduleName}: `}
            </Text>
            <div className='flex flex-row items-baseline gap-5'>
                <Text
                    variant='h3'
                    as='span'
                    className='text-smallcaps flex flex-row items-baseline gap-2 text-theme-black sm:inline-flex'
                >
                    <span className='font-bold'>{totalHours}</span>
                    <span className='font-normal'>{totalHours === 1 ? 'Hour' : 'Hours'}</span>
                </Text>
                <Text
                    variant='h3'
                    as='span'
                    className='text-smallcaps hidden flex flex-row items-baseline gap-2 text-theme-black screenshot:inline-flex sm:inline-flex'
                >
                    <span className='font-bold'>{totalCourses}</span>
                    <span className='font-normal'>{totalCourses === 1 ? 'Course' : 'Courses'}</span>
                </Text>
            </div>
        </div>
    );
}
