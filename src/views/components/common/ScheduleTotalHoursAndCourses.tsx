import Text from '@views/components/common/Text/Text';
import React from 'react';

import ClockIcon from '~icons/ic/baseline-access-time-filled';
import BookIcon from '~icons/material-symbols/book-2-rounded';

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
            <Text className='truncate text-ut-burntorange' variant='h1' as='span'>
                {`${scheduleName} `}
            </Text>
            <div className='flex flex-row items-baseline gap-2'>
                <div className='flex flex-row items-baseline gap-1'>
                    <ClockIcon className='text-theme-black' style={{ fontSize: '2em' }} />
                    <Text variant='h1' as='span' className='font-normal normal-case!'>
                        <span className='text-theme-black'>{totalHours}</span>{' '}
                    </Text>
                    <Text variant='h1' as='span' className='normal-case!'>
                        <span className='text-theme-black font-bold' style={{ fontVariant: 'all-small-caps' }}>
                            {totalHours === 1 ? 'HOUR' : 'HOURS'}
                        </span>
                    </Text>
                </div>
                <div className='flex flex-row items-baseline gap-1'>
                    <BookIcon className='text-theme-black' style={{ fontSize: '2em' }} />
                    <Text variant='h1' as='span' className='font-normal normal-case!'>
                        <span className='text-theme-black'>{totalCourses}</span>{' '}
                    </Text>
                    <Text variant='h1' as='span' className='normal-case!'>
                        <span className='text-theme-black font-bold' style={{ fontVariant: 'all-small-caps' }}>
                            {totalCourses === 1 ? 'COURSE' : 'COURSES'}
                        </span>
                    </Text>
                </div>
            </div>
        </div>
    );
}
