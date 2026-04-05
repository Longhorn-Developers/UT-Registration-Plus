import Text from '@views/components/common/Text/Text';
import type { JSX } from 'react';

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
        <div className='gap-0.5 grid'>
            <Text className='block truncate text-theme-black flex-initial overflow-hidden' variant='h1' as='div'>
                {scheduleName}
            </Text>
            <Text variant='h4' as='p' className='text-ut-burntorange inline-flex gap-3'>
                <span>
                    {totalHours}&nbsp;
                    <span className='ml-0.5 uppercase'>{totalHours === 1 ? 'Hour' : 'Hours'}</span>
                </span>
                <span>
                    {totalCourses}&nbsp;
                    <span className='ml-0.5 uppercase'>{totalCourses === 1 ? 'Course' : 'Courses'}</span>
                </span>
            </Text>
        </div>
    );
}
