import splashText from '@assets/insideJokes';
import createSchedule from '@pages/background/lib/createSchedule';
import { CalendarDots, Flag, GearSix } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import Divider from '@views/components/common/Divider';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import useReportIssueDialog from '@views/hooks/useReportIssueDialog';
import useSchedules, { getActiveSchedule, switchSchedule } from '@views/hooks/useSchedules';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import { useEffect, useState } from 'react';

import { Button } from './common/Button';
import CourseStatus from './common/CourseStatus';
import { SmallLogo } from './common/LogoIcon';
import ScheduleDropdown from './common/ScheduleDropdown';

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

        const l1 = OptionsStore.subscribe('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        // const l2 = OptionsStore.listen('enableDataRefreshing', async ({ newValue }) => {
        //     setEnableDataRefreshing(newValue);
        //     // console.log('enableDataRefreshing', newValue);
        // });

        return () => {
            OptionsStore.unsubscribe(l1);
            // OptionsStore.removeListener(l2);
        };
    }, []);

    const [activeSchedule, schedules] = useSchedules();

    // const [isRefreshing, setIsRefreshing] = useState(false);
    const [emptyMessagesByScheduleId, setEmptyMessagesByScheduleId] = useState<Record<string, string>>({});
    const showReportIssueDialog = useReportIssueDialog();

    const enforceScheduleLimit = useEnforceScheduleLimit();
    const handleAddSchedule = () => {
        if (enforceScheduleLimit()) {
            createSchedule('New Schedule');
        }
    };

    useEffect(() => {
        setEmptyMessagesByScheduleId(prev => {
            const next: Record<string, string> = {};
            const used = new Set<string>();

            for (const schedule of schedules) {
                const existing = prev[schedule.id];
                if (existing) {
                    next[schedule.id] = existing;
                    used.add(existing);
                    continue;
                }

                const available = splashText.filter(text => !used.has(text));
                const pool = available.length > 0 ? available : splashText;
                const randomIndex = Math.floor(Math.random() * pool.length);
                const selected =
                    pool[randomIndex] ?? 'If you are seeing this, something has gone horribly wrong behind the scenes.';

                next[schedule.id] = selected;
                used.add(selected);
            }

            return next;
        });
    }, [schedules]);

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
                    <div className='flex items-center gap-1.5'>
                        <Button
                            variant='filled'
                            size='small'
                            color='ut-burntorange'
                            onClick={handleCalendarOpenOnClick}
                            icon={CalendarDots}
                            iconProps={{ weight: 'fill' }}
                        >
                            Calendar
                        </Button>
                        <Button
                            variant='minimal'
                            size='small'
                            color='ut-black'
                            icon={Flag}
                            title='Send feedback'
                            onClick={showReportIssueDialog}
                        />
                        <Button
                            variant='minimal'
                            size='small'
                            color='ut-black'
                            onClick={handleOpenOptions}
                            icon={GearSix}
                        />
                    </div>
                </div>
            </div>
            <Divider className='bg-ut-offwhite/50' orientation='horizontal' size='100%' />
            <div className='flex-1 min-h-0 px-5 pb-2.5 pt-2.5'>
                <ScheduleDropdown
                    schedules={schedules}
                    activeScheduleId={activeSchedule.id}
                    onScheduleClick={switchSchedule}
                    onAddSchedule={handleAddSchedule}
                    getEmptyMessage={scheduleId =>
                        emptyMessagesByScheduleId[scheduleId] ??
                        'If you are seeing this, something has gone horribly wrong behind the scenes.'
                    }
                    onReorder={reordered => {
                        const activeSchedule = getActiveSchedule();
                        const activeIndex = reordered.findIndex(s => s.id === activeSchedule.id);

                        UserScheduleStore.set('schedules', reordered);
                        UserScheduleStore.set('activeIndex', Math.max(activeIndex, 0));
                    }}
                />
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
