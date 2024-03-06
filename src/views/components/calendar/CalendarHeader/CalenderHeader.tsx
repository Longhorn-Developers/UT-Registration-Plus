import calIcon from '@assets/logo.png';
import { Status } from '@shared/types/Course';
import { Button } from '@views/components/common/Button/Button';
import CourseStatus from '@views/components/common/CourseStatus/CourseStatus';
import Divider from '@views/components/common/Divider/Divider';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import MenuIcon from '~icons/material-symbols/menu';
import RedoIcon from '~icons/material-symbols/redo';
import SettingsIcon from '~icons/material-symbols/settings';
import UndoIcon from '~icons/material-symbols/undo';

/**
 * Opens the options page in a new tab.
 * @returns {Promise<void>} A promise that resolves when the options page is opened.
 */
const handleOpenOptions = async () => {
    const url = chrome.runtime.getURL('/src/pages/options/index.html');
    await openTabFromContentScript(url);
};

/**
 * Renders the header component for the calendar.
 * @returns The JSX element representing the calendar header.
 */
export default function CalendarHeader(): JSX.Element {
    return (
        <div className='min-h-79px min-w-672px w-full flex px-0 py-15'>
            <div className='flex flex-row gap-20'>
                <div className='flex gap-10'>
                    <div className='flex gap-1'>
                        <Button className='self-center' variant='single' icon={MenuIcon} color='ut-gray' />
                        <div className='flex items-center gap-2'>
                            <img src={calIcon} className='max-w-[48px] min-w-[48px]' alt='UT Registration Plus Logo' />
                            <div className='flex flex-col whitespace-nowrap'>
                                <Text className='text-lg text-ut-burntorange font-medium'>UT Registration</Text>
                                <Text className='text-lg text-ut-orange font-medium'>Plus</Text>
                            </div>
                        </div>
                    </div>
                    <Divider className='self-center' size='2.5rem' orientation='vertical' />
                    <div className='flex flex-col self-center'>
                        <ScheduleTotalHoursAndCourses scheduleName='SCHEDULE' totalHours={22} totalCourses={8} />
                        <Text variant='h4' className='text-xs text-gray font-medium leading-normal'>
                            DATA UPDATED ON: 12:00 AM 02/01/2024
                        </Text>
                    </div>
                </div>
                <div className='flex flex-row items-center justify-end space-x-8'>
                    <div className='flex flex-row space-x-4'>
                        <CourseStatus size='small' status={Status.WAITLISTED} />
                        <CourseStatus size='small' status={Status.CLOSED} />
                        <CourseStatus size='small' status={Status.CANCELLED} />
                    </div>
                    <div className='flex flex-row'>
                        <Button variant='single' icon={UndoIcon} color='ut-black' />
                        <Button variant='single' icon={RedoIcon} color='ut-black' />
                        <Button variant='single' icon={SettingsIcon} color='ut-black' onClick={handleOpenOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
