import { Status } from '@shared/types/Course';
import { Button } from '@views/components/common/Button/Button';
import CourseStatus from '@views/components/common/CourseStatus/CourseStatus';
import Divider from '@views/components/common/Divider/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import MenuIcon from '~icons/material-symbols/menu';
import RefreshIcon from '~icons/material-symbols/refresh';

/**
 * Opens the options page in a new tab.
 * @returns A promise that resolves when the options page is opened.
 */
const handleOpenOptions = async (): Promise<void> => {
    const url = chrome.runtime.getURL('/options.html');
    await openTabFromContentScript(url);
};

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader(): JSX.Element {
    const [activeSchedule] = useSchedules();

    return (
        <div className='flex items-center gap-5 border-b px-7 py-4'>
            <Button variant='single' icon={MenuIcon} color='ut-gray' />
            <LargeLogo />
            <Divider className='mx-4 self-center' size='2.5rem' orientation='vertical' />
            <div className='flex-grow'>
                <ScheduleTotalHoursAndCourses
                    scheduleName={activeSchedule.name}
                    totalHours={activeSchedule.hours}
                    totalCourses={activeSchedule.courses.length}
                />
                <div className='flex items-center gap-1'>
                    <Text variant='mini' className='text-ut-gray'>
                        DATA UPDATED ON: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                    </Text>
                    <button className='inline-block h-4 w-4 bg-transparent p-0 btn'>
                        <RefreshIcon className='h-4 w-4 animate-duration-800 text-ut-black' />
                    </button>
                </div>
            </div>
            <div className='flex flex-row items-center justify-end gap-6'>
                <CourseStatus size='small' status={Status.WAITLISTED} />
                <CourseStatus size='small' status={Status.CLOSED} />
                <CourseStatus size='small' status={Status.CANCELLED} />

                {/* <Button variant='single' icon={UndoIcon} color='ut-black' />
                    <Button variant='single' icon={RedoIcon} color='ut-black' /> */}
                {/* <Button variant='single' icon={SettingsIcon} color='ut-black' onClick={handleOpenOptions} /> */}
            </div>
        </div>
    );
}
