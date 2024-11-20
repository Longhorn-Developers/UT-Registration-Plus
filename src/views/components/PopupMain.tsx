import splashText from '@assets/insideJokes';
import createSchedule from '@pages/background/lib/createSchedule';
import { background } from '@shared/messages';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { openReportWindow } from '@shared/util/openReportWindow';
import Divider from '@views/components/common/Divider';
import List from '@views/components/common/List';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules, { getActiveSchedule, replaceSchedule, switchSchedule } from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import React, { useEffect, useState } from 'react';

import AddSchedule from '~icons/material-symbols/add';
import CalendarIcon from '~icons/material-symbols/calendar-month';
import Feedback from '~icons/material-symbols/flag';
import SettingsIcon from '~icons/material-symbols/settings';

import { Button } from './common/Button';
import CourseStatus from './common/CourseStatus';
import { SmallLogo } from './common/LogoIcon';
import PopupCourseBlock from './common/PopupCourseBlock';
import ScheduleDropdown from './common/ScheduleDropdown';
import ScheduleListItem from './common/ScheduleListItem';

/**
 * Renders the main popup component.
 * This component displays the main schedule, courses, and options buttons.
 */
export default function PopupMain(): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const [enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);
    useKC_DABR_WASM();

    useEffect(() => {
        const initAllSettings = async () => {
            const { enableCourseStatusChips, enableDataRefreshing } = await initSettings();
            setEnableCourseStatusChips(enableCourseStatusChips);
            setEnableDataRefreshing(enableDataRefreshing);
        };

        initAllSettings();

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

    const [activeSchedule, schedules] = useSchedules();
    // const [isRefreshing, setIsRefreshing] = useState(false);
    const [funny, setFunny] = useState<string>('');

    const enforceScheduleLimit = useEnforceScheduleLimit();
    const handleAddSchedule = () => {
        if (enforceScheduleLimit()) {
            createSchedule('New Schedule');
        }
    };

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * splashText.length);
        setFunny(
            splashText[randomIndex] ?? 'If you are seeing this, something has gone horribly wrong behind the scenes.'
        );
    }, []);

    const handleOpenOptions = async () => {
        const url = chrome.runtime.getURL('/options.html');
        background.openNewTab({ url });
    };

    const handleCalendarOpenOnClick = async () => {
        await background.switchToCalendarTab({});
        window.close();
    };

    return (
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
                        <button className='bg-transparent px-2 py-1.25 btn' onClick={openReportWindow}>
                            <Feedback className='size-6 color-ut-black' />
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
                    <div className='bottom-0 right-0 mt-2.5 w-full flex justify-end'>
                        <Button
                            variant='filled'
                            color='ut-burntorange'
                            className='h-fit p-0 btn'
                            onClick={handleAddSchedule}
                        >
                            <AddSchedule className='h-6 w-6' />
                        </Button>
                    </div>
                </ScheduleDropdown>
            </div>
            {activeSchedule?.courses?.length === 0 && (
                <div className='max-w-64 flex flex-col items-center self-center gap-1.25 px-2 py-2 pt-24'>
                    <Text variant='p' className='text-center text-ut-gray !font-normal'>
                        {funny}
                    </Text>
                    <Text variant='small' className='text-center text-black'>
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
                {enableDataRefreshing && (
                    <div className='inline-flex items-center self-center gap-1'>
                        <Text variant='mini' className='text-ut-gray !font-normal'>
                            LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                        </Text>
                        {/* <button
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
                        </button> */}
                    </div>
                )}
            </div>
        </div>
    );
}
