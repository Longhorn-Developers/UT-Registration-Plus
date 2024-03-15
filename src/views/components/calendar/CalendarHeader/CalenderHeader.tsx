import { Status } from '@shared/types/Course';
import { Button } from '@views/components/common/Button/Button';
import CourseStatus from '@views/components/common/CourseStatus/CourseStatus';
import Divider from '@views/components/common/Divider/Divider';
import { LogoIcon } from '@views/components/common/LogoIcon';
import ScheduleTotalHoursAndCourses from '@views/components/common/ScheduleTotalHoursAndCourses/ScheduleTotalHoursAndCourses';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React from 'react';

import MenuIcon from '~icons/material-symbols/menu';
import RedoIcon from '~icons/material-symbols/redo';
import SettingsIcon from '~icons/material-symbols/settings';
import UndoIcon from '~icons/material-symbols/undo';

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
        <div className='min-h-79px min-w-672px w-full flex px-0 py-5'>
            <div className='w-full flex flex-row gap-20'>
                <div className='flex gap-10'>
                    <div className='flex gap-1'>
                        <Button className='self-center' variant='single' icon={MenuIcon} color='ut-gray' />
                        <div className='flex items-center gap-2'>
                            <LogoIcon />
                            <div className='flex flex-col whitespace-nowrap'>
                                <Text className='text-ut-burntorange text-lg! font-medium!'>UT Registration</Text>
                                <Text className='text-ut-orange text-lg! font-medium!'>Plus</Text>
                            </div>
                        </div>
                    </div>
                    <Divider className='self-center' size='2.5rem' orientation='vertical' />
                    <div className='flex flex-col self-center'>
                        <ScheduleTotalHoursAndCourses
                            scheduleName={activeSchedule.name}
                            totalHours={activeSchedule.hours}
                            totalCourses={activeSchedule.courses.length}
                        />
                        <Text variant='h4' className='text-gray text-xs! font-medium! leading-normal!'>
                            LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                        </Text>
                    </div>
                </div>
                <div className='ml-auto flex flex-row items-center justify-end space-x-8'>
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
