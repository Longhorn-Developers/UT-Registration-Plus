import { enableCourseRefreshing, enableCourseStatusChips } from '@shared/util/experimental';
import { Button } from '@views/components/common/Button';
import CourseStatus from '@views/components/common/CourseStatus';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import React from 'react';

import MenuIcon from '~icons/material-symbols/menu';
import RefreshIcon from '~icons/material-symbols/refresh';

interface CalendarHeaderProps {
    onSidebarToggle?: () => void;
}

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [activeSchedule] = useSchedules();

    return (
        <div className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
            <Button
                variant='single'
                icon={MenuIcon}
                color='ut-gray'
                onClick={onSidebarToggle}
                className='screenshot:hidden'
            />
            <LargeLogo />
            <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
            <div className='flex-1 screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
                {enableCourseRefreshing && (
                    <div className='flex items-center gap-1 screenshot:hidden'>
                        <Text variant='mini' className='text-nowrap text-ut-gray font-normal!'>
                            DATA LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                        </Text>
                        <button className='inline-block h-4 w-4 bg-transparent p-0 btn'>
                            <RefreshIcon className='h-4 w-4 animate-duration-800 text-ut-black' />
                        </button>
                    </div>
                )}
            </div>
            <div className='hidden flex-row items-center justify-end gap-6 screenshot:hidden lg:flex'>
                {enableCourseStatusChips && (
                    <>
                        <CourseStatus status='WAITLISTED' size='mini' />
                        <CourseStatus status='CLOSED' size='mini' />
                        <CourseStatus status='CANCELLED' size='mini' />
                    </>
                )}

                {/* <Button variant='single' icon={UndoIcon} color='ut-black' />
                    <Button variant='single' icon={RedoIcon} color='ut-black' /> */}
                {/* <Button variant='single' icon={SettingsIcon} color='ut-black' onClick={handleOpenOptions} /> */}
            </div>
        </div>
    );
}
