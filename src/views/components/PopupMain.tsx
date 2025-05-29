import splashText from '@assets/insideJokes';
import createSchedule from '@pages/background/lib/createSchedule';
import { CalendarDots, GearSix, Plus } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import Divider from '@views/components/common/Divider';
import Text from '@views/components/common/Text/Text';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useSchedules, { getActiveSchedule, replaceSchedule, switchSchedule } from '@views/hooks/useSchedules';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import React, { useEffect, useState } from 'react';

import { Button } from './common/Button';
import CourseStatus from './common/CourseStatus';
import { SmallLogo } from './common/LogoIcon';
import PopupCourseBlock from './common/PopupCourseBlock';
import ScheduleDropdown from './common/ScheduleDropdown';
import ScheduleListItem from './common/ScheduleListItem';
import { SortableList } from './common/SortableList';

/**
 * Renders the main popup component.
 * This component displays the main schedule, courses, and options buttons.
 */
export default function PopupMain(): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    // const [enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);
    useKC_DABR_WASM();

    useEffect(() => {
        const initAllSettings = async () => {
            const { enableCourseStatusChips } = await initSettings();
            setEnableCourseStatusChips(enableCourseStatusChips);
            // setEnableDataRefreshing(enableDataRefreshing);
        };

        initAllSettings();

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        // const l2 = OptionsStore.listen('enableDataRefreshing', async ({ newValue }) => {
        //     setEnableDataRefreshing(newValue);
        //     // console.log('enableDataRefreshing', newValue);
        // });

        return () => {
            OptionsStore.removeListener(l1);
            // OptionsStore.removeListener(l2);
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
        setFunny(prevFunny => {
            // Ensure that the next splash text is not the same as the previous one
            const splashTextWithoutCurrent = splashText.filter(text => text !== prevFunny);
            const randomIndex = Math.floor(Math.random() * splashTextWithoutCurrent.length);

            return (
                splashTextWithoutCurrent[randomIndex] ??
                'If you are seeing this, something has gone horribly wrong behind the scenes.'
            );
        });

        // Generate a new splash text every time the active schedule changes
    }, [activeSchedule.id]);

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
            <div className='px-spacing-6 py-spacing-5'>
                <div className='flex items-center justify-between bg-white'>
                    <SmallLogo />
                    <div className='flex items-center gap-2.5'>
                        <Button
                            variant='filled'
                            color='ut-burntorange'
                            onClick={handleCalendarOpenOnClick}
                            icon={CalendarDots}
                            iconProps={{ weight: 'fill' }}
                        >
                            Calendar
                        </Button>
                        <Button variant='minimal' color='ut-black' onClick={handleOpenOptions} icon={GearSix} />
                    </div>
                </div>
            </div>
            <Divider className='bg-ut-offwhite/50' orientation='horizontal' size='100%' />
            <div className='px-5 pb-2.5 pt-3.75'>
                <ScheduleDropdown>
                    <SortableList
                        draggables={schedules}
                        onChange={reordered => {
                            const activeSchedule = getActiveSchedule();
                            const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                            // don't care about the promise
                            UserScheduleStore.set('schedules', reordered);
                            UserScheduleStore.set('activeIndex', activeIndex);
                        }}
                        renderItem={schedule => (
                            <ScheduleListItem schedule={schedule} onClick={() => switchSchedule(schedule.id)} />
                        )}
                    />
                    <div className='bottom-0 right-0 mt-2.5 w-full flex justify-end'>
                        <Button
                            variant='filled'
                            size='mini'
                            color='ut-burntorange'
                            onClick={handleAddSchedule}
                            icon={Plus}
                        />
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
            <div
                style={{ scrollbarGutter: 'stable' }}
                className='flex-1 self-stretch overflow-y-scroll pl-spacing-6 pr-[6px]'
            >
                {activeSchedule?.courses?.length > 0 && (
                    <SortableList
                        draggables={activeSchedule.courses.map(course => ({
                            id: course.uniqueId,
                            course,
                        }))}
                        onChange={reordered => {
                            activeSchedule.courses = reordered.map(({ course }) => course);
                            replaceSchedule(getActiveSchedule(), activeSchedule);
                        }}
                        renderItem={({ id, course }) => (
                            <PopupCourseBlock key={id} course={course} colors={course.colors} />
                        )}
                    />
                )}
            </div>
            <div className='w-full flex flex-col items-center gap-1.25 px-spacing-6 py-spacing-5'>
                <div className='flex gap-spacing-6'>
                    {enableCourseStatusChips && (
                        <>
                            <CourseStatus status='WAITLISTED' size='small' />
                            <CourseStatus status='CLOSED' size='small' />
                            <CourseStatus status='CANCELLED' size='small' />
                        </>
                    )}
                </div>
                {/* {enableDataRefreshing && (
                    <div className='inline-flex items-center self-center gap-1'> */}
                {/* <Text variant='mini' className='text-ut-gray !font-normal'>
                            LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                        </Text> */}
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
                {/* </div>
                )} */}
            </div>
        </div>
    );
}
