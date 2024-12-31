import { GearSix, Sidebar } from '@phosphor-icons/react';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { Button } from '@views/components/common/Button';
import CourseStatus from '@views/components/common/CourseStatus';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses';
import useSchedules from '@views/hooks/useSchedules';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React, { useEffect, useState } from 'react';

/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */
const handleOpenOptions = async (): Promise<void> => {
    const url = chrome.runtime.getURL('/options.html');
    await openTabFromContentScript(url);
};

interface CalendarHeaderProps {
    onSidebarToggle?: () => void;
}

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader({ onSidebarToggle }: CalendarHeaderProps): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const [_enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);

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
        <div className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
            <Button
                variant='single'
                icon={Sidebar}
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
                <Button variant='single' icon={GearSix} color='theme-black' onClick={handleOpenOptions} />
            </div>
        </div>
    );
}
