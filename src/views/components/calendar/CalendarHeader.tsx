import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { Button } from '@views/components/common/Button';
import CourseStatus from '@views/components/common/CourseStatus';
import Divider from '@views/components/common/Divider';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import useSchedules from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';

// import RefreshIcon from '~icons/material-symbols/refresh';
import MenuIcon from '~icons/material-symbols/menu';

interface CalendarHeaderProps {
    sidebarOpen?: boolean;
    onSidebarToggle?: () => void;
}

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ sidebarOpen, onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const [enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);

    const [activeSchedule] = useSchedules();

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips, enableDataRefreshing }) => {
            setEnableCourseStatusChips(enableCourseStatusChips);
            setEnableDataRefreshing(enableDataRefreshing);
        });

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        const l2 = OptionsStore.listen('enableDataRefreshing', async ({ newValue }) => {
            setEnableDataRefreshing(newValue);
            // console.log('enableDataRefreshing', newValue);
        });

        return () => {
            OptionsStore.removeListener(l1);
            OptionsStore.removeListener(l2);
        };
    }, []);

    return (
        <div className='min-h-[91px] flex items-center gap-5 overflow-x-auto overflow-y-hidden px-7 py-4 md:overflow-x-hidden'>
            {!sidebarOpen && (
                <Button
                    variant='single'
                    color='theme-black'
                    onClick={onSidebarToggle}
                    className='h-fit screenshot:hidden !p-0'
                    icon={MenuIcon}
                />
            )}

            <div className='screenshot:transform-origin-left screenshot:scale-120'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
            </div>

            <Divider className='mx-2 self-center md:mx-4 screenshot:hidden' size='2.5rem' orientation='vertical' />

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
            </div>
        </div>
    );
}
