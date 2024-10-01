import { background } from '@shared/messages';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { enableCourseRefreshing, enableCourseStatusChips } from '@shared/util/experimental';
import Divider from '@views/components/common/Divider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import List from '@views/components/common/List';
import Text from '@views/components/common/Text/Text';
import useSchedules, { getActiveSchedule, replaceSchedule, switchSchedule } from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import clsx from 'clsx';
import React, { useState } from 'react';

import CalendarIcon from '~icons/material-symbols/calendar-month';
import RefreshIcon from '~icons/material-symbols/refresh';
import SettingsIcon from '~icons/material-symbols/settings';

import CourseStatus from './common/CourseStatus';
import { SmallLogo } from './common/LogoIcon';
import PopupCourseBlock from './common/PopupCourseBlock';
import ScheduleDropdown from './common/ScheduleDropdown';
import ScheduleListItem from './common/ScheduleListItem';
import splashText from 'src/assets/insideJokes';
import { useEffect } from 'react';

/**
 * Renders the main popup component.
 * This component displays the main schedule, courses, and options buttons.
 */
export default function PopupMain(): JSX.Element {
    const [activeSchedule, schedules] = useSchedules();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [funny, setFunny] = useState<string>('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * splashText.length);
        setFunny(
            splashText[randomIndex] ?? 'If you are seeing this, something has gone horribly wrong behind the scenes.'
        );
    }, []);

    const handleOpenOptions = async () => {
        const url = chrome.runtime.getURL('/options.html');
        await openTabFromContentScript(url);
    };

    const handleCalendarOpenOnClick = async () => {
        await background.switchToCalendarTab({});
        window.close();
    };

    return (
        <ExtensionRoot>
            <div className='h-screen max-h-full flex flex-col bg-white'>
                <div className='p-5 py-3.5'>
                    <div className='flex items-center justify-between bg-white'>
                        <SmallLogo />
                        <div className='flex items-center gap-2.5'>
                            <button className='bg-ut-burntorange px-2 py-1.25 btn' onClick={handleCalendarOpenOnClick}>
                                <CalendarIcon className='size-6 text-white' />
                            </button>
                            <button className='bg-transparent px-2 py-1.25 btn' onClick={handleOpenOptions}>
                                <SettingsIcon className='size-6 color-ut-black' />
                            </button>
                        </div>
                    </div>
                </div>
                <Divider orientation='horizontal' size='100%' />
                <div className='px-5 pb-2.5 pt-3.75'>
                    <ScheduleDropdown>
                        <List
                            draggables={schedules}
                            itemKey={schedule => schedule.id}
                            onReordered={reordered => {
                                const activeSchedule = getActiveSchedule();
                                const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                                // don't care about the promise
                                UserScheduleStore.set('schedules', reordered);
                                UserScheduleStore.set('activeIndex', activeIndex);
                            }}
                            gap={10}
                        >
                            {(schedule, handleProps) => (
                                <ScheduleListItem
                                    schedule={schedule}
                                    onClick={() => {
                                        switchSchedule(schedule.id);
                                    }}
                                    dragHandleProps={handleProps}
                                />
                            )}
                        </List>
                    </ScheduleDropdown>
                </div>
                {activeSchedule?.courses?.length === 0 && (
                    <div className='flex flex-col items-center self-center gap-1 py-2'>
                        <Text variant='h4' className='text-center text-ut-gray !font-normal'>
                            {funny}
                        </Text>
                        <Text variant='p' className='text-center text-black '>
                            (No courses added)
                        </Text>
                    </div>
                )}
                <div className='flex-1 self-stretch overflow-y-auto px-5'>
                    {activeSchedule?.courses?.length > 0 && (
                        <List
                            draggables={activeSchedule.courses}
                            onReordered={reordered => {
                                activeSchedule.courses = reordered;
                                replaceSchedule(getActiveSchedule(), activeSchedule);
                            }}
                            itemKey={e => e.uniqueId}
                            gap={10}
                        >
                            {(course, handleProps) => (
                                <PopupCourseBlock
                                    key={course.uniqueId}
                                    course={course}
                                    colors={course.colors}
                                    dragHandleProps={handleProps}
                                />
                            )}
                        </List>
                    )}
                </div>
                <div className='w-full flex flex-col items-center gap-1.25 p-5 pt-3.75'>
                    <div className='flex gap-2.5'>
                        {enableCourseStatusChips && (
                            <>
                                <CourseStatus status='WAITLISTED' size='mini' />
                                <CourseStatus status='CLOSED' size='mini' />
                                <CourseStatus status='CANCELLED' size='mini' />
                            </>
                        )}
                    </div>
                    {enableCourseRefreshing && (
                        <div className='inline-flex items-center self-center gap-1'>
                            <Text variant='mini' className='text-ut-gray !font-normal'>
                                DATA LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                            </Text>
                            <button
                                className='h-4 w-4 bg-transparent p-0 btn'
                                onClick={() => {
                                    setIsRefreshing(true);
                                }}
                            >
                                <RefreshIcon
                                    className={clsx('h-4 w-4 text-ut-black animate-duration-800', {
                                        'animate-spin': isRefreshing,
                                    })}
                                />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </ExtensionRoot>
    );
}
