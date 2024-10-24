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
        <div className='min-w-full w-0 flex items-baseline gap-2.5 whitespace-nowrap'>
            <Text className='truncate text-ut-burntorange uppercase' variant='h1' as='span'>
                {`${scheduleName}: `}
            </Text>
            <div className='flex flex-row items-baseline gap-2'>
                <div>
                    <Text variant='h1' as='span' className='font-normal normal-case!'>
                        <span className='text-theme-black'>{totalHours}</span>{' '}
                    </Text>
                    <Text variant='h3' as='span' className='normal-case!'>
                        <span className='text-theme-black font-bold' style={{ fontVariant: 'all-small-caps' }}>
                            {totalHours === 1 ? 'HOUR' : 'HOURS'}
                        </span>
                    </Text>
                </div>
                <div>
                    <Text variant='h1' as='span' className='font-normal normal-case!'>
                        <span className='text-theme-black'>{totalCourses}</span>{' '}
                    </Text>
                    <Text variant='h3' as='span' className='normal-case!'>
                        <span className='text-theme-black font-bold' style={{ fontVariant: 'all-small-caps' }}>
                            {totalCourses === 1 ? 'COURSE' : 'COURSES'}
                        </span>
                    </Text>
                </div>
            </div>
        </div>
    );
}
