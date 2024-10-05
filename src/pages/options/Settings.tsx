import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { getCourseColors } from '@shared/util/colors';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { SmallLogo } from '@views/components/common/LogoIcon';
import PopupCourseBlock from '@views/components/common/PopupCourseBlock';
import SwitchButton from '@views/components/common/SwitchButton';
import Text from '@views/components/common/Text/Text';
import { LONGHORN_DEVELOPERS_ADMINS, useGitHubStats } from '@views/hooks/useGitHubStats';
import useSchedules from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { ExampleCourse } from 'src/stories/components/ConflictsWithWarning.stories';

import DeleteForeverIcon from '~icons/material-symbols/delete-forever';
import RefreshIcon from '~icons/material-symbols/refresh';

import App from './DevMode';
import Preview from './Preview';

/**
 * Custom hook for enabling developer mode.
 *
 * @param targetCount - The target count to activate developer mode.
 * @returns A tuple containing a boolean indicating if developer mode is active and a function to increment the count.
 */
const useDevMode = (targetCount: number): [boolean, () => void] => {
    const [count, setCount] = useState(0);
    const [active, setActive] = useState(false);
    const [lastClick, setLastClick] = useState(0);

    const incrementCount = useCallback(() => {
        const now = Date.now();
        if (now - lastClick < 500) {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                if (newCount === targetCount) {
                    setActive(true);
                }
                return newCount;
            });
        } else {
            setCount(1);
        }
        setLastClick(now);
    }, [lastClick, targetCount]);

    useEffect(() => {
        const timer = setTimeout(() => setCount(0), 3000);
        return () => clearTimeout(timer);
    }, [count]);

    return [active, incrementCount];
};

/**
 * Renders the settings page for the UTRP (UT Registration Plus) extension.
 * Allows customization options and displays credits for the development team.
 *
 * @returns The JSX element representing the settings page.
 */
export default function SettingsPage() {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const [showTimeLocation, setShowTimeLocation] = useState<boolean>(false);
    const [highlightConflicts, setHighlightConflicts] = useState<boolean>(false);
    const [loadAllCourses, setLoadAllCourses] = useState<boolean>(false);
    const [enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);

    // [TODO]: Toggle GitHub stats when the user presses the 'S' key
    const [showGitHubStats, setShowGitHubStats] = useState<boolean>(true);
    const { adminGitHubStats, userGitHubStats, contributors } = useGitHubStats(showGitHubStats);

    const [activeSchedule, schedules] = useSchedules();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        initSettings().then(
            ({
                enableCourseStatusChips,
                enableTimeAndLocationInPopup,
                enableHighlightConflicts,
                enableScrollToLoad,
                enableDataRefreshing,
            }) => {
                setEnableCourseStatusChips(enableCourseStatusChips);
                setShowTimeLocation(enableTimeAndLocationInPopup);
                setHighlightConflicts(enableHighlightConflicts);
                setLoadAllCourses(enableScrollToLoad);
                setEnableDataRefreshing(enableDataRefreshing);
            }
        );

        // Listen for changes in the settings
        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        const l2 = OptionsStore.listen('enableTimeAndLocationInPopup', async ({ newValue }) => {
            setShowTimeLocation(newValue);
            // console.log('enableTimeAndLocationInPopup', newValue);
        });

        const l3 = OptionsStore.listen('enableHighlightConflicts', async ({ newValue }) => {
            setHighlightConflicts(newValue);
            // console.log('enableHighlightConflicts', newValue);
        });

        const l4 = OptionsStore.listen('enableScrollToLoad', async ({ newValue }) => {
            setLoadAllCourses(newValue);
            // console.log('enableScrollToLoad', newValue);
        });

        const l5 = OptionsStore.listen('enableDataRefreshing', async ({ newValue }) => {
            setEnableDataRefreshing(newValue);
            // console.log('enableDataRefreshing', newValue);
        });

        // Remove listeners when the component is unmounted
        return () => {
            OptionsStore.removeListener(l1);
            OptionsStore.removeListener(l2);
            OptionsStore.removeListener(l3);
            OptionsStore.removeListener(l4);
            OptionsStore.removeListener(l5);
        };
    }, []);

    const [devMode, toggleDevMode] = useDevMode(10);

    if (devMode) {
        return <App />;
    }

    return (
        <ExtensionRoot>
            <div className='bg-white p-6'>
                <header className='mb-6 flex items-center justify-between'>
                    <div className='flex items-center'>
                        <SmallLogo className='pr-4' />
                        <Divider size='2rem' orientation='vertical' />
                        <h1 className='pl-4 text-xl text-ut-burntorange font-bold'>UTRP SETTINGS & CREDITS PAGE</h1>
                    </div>
                    {/* TODO: this icon doesn't show up in prod builds */}
                    <img src='/src/assets/LD-icon.png' alt='LD Icon' className='h-10 w-10 rounded-lg' />
                </header>

                <div className='flex'>
                    <div className='mr-4 w-1/2'>
                        <section className='mb-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>CUSTOMIZATION OPTIONS</h2>
                            <div className='flex space-x-4'>
                                <div className='w-1/2 space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>Show Course Status</h3>
                                            <p className='text-sm text-gray-600'>
                                                Shows an indicator for waitlisted, cancelled, and closed courses.
                                            </p>
                                        </div>
                                        <SwitchButton
                                            isChecked={enableCourseStatusChips}
                                            onChange={() => {
                                                setEnableCourseStatusChips(!enableCourseStatusChips);
                                                OptionsStore.set('enableCourseStatusChips', !enableCourseStatusChips);
                                            }}
                                        />
                                    </div>

                                    <Divider size='auto' orientation='horizontal' />

                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>
                                                Show Time & Location in Popup
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                Shows the course&apos;s time and location in the extension&apos;s popup.
                                            </p>
                                        </div>
                                        <SwitchButton
                                            isChecked={showTimeLocation}
                                            onChange={() => {
                                                setShowTimeLocation(!showTimeLocation);
                                                OptionsStore.set('enableTimeAndLocationInPopup', !showTimeLocation);
                                            }}
                                        />
                                    </div>
                                </div>
                                <Preview>
                                    <CalendarCourseCell
                                        colors={getCourseColors('orange')}
                                        courseDeptAndInstr={ExampleCourse.department}
                                        className={ExampleCourse.number}
                                        status={ExampleCourse.status}
                                        timeAndLocation={ExampleCourse.schedule.meetings[0]!.getTimeString({
                                            separator: '-',
                                        })}
                                    />
                                    <PopupCourseBlock colors={getCourseColors('orange')} course={ExampleCourse} />
                                </Preview>
                            </div>
                        </section>

                        <Divider size='auto' orientation='horizontal' />

                        <section className='my-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>ADVANCED SETTINGS</h2>
                            <div className='flex space-x-4'>
                                <div className='w-1/2 space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>Refresh Data</h3>
                                            <p className='text-sm text-gray-600'>
                                                Refreshes waitlist, course status, and other info with the latest data
                                                from UT&apos;s site.
                                            </p>
                                        </div>
                                        <Button
                                            variant='outline'
                                            color='ut-black'
                                            icon={RefreshIcon}
                                            onClick={() => console.log('Refresh clicked')}
                                            disabled={!enableDataRefreshing}
                                        >
                                            Refresh
                                        </Button>
                                    </div>

                                    <Divider size='auto' orientation='horizontal' />

                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>
                                                Course Conflict Highlight
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                Adds a red strikethrough to courses that have conflicting times.
                                            </p>
                                        </div>
                                        <SwitchButton
                                            isChecked={highlightConflicts}
                                            onChange={() => {
                                                setHighlightConflicts(!highlightConflicts);
                                                OptionsStore.set('enableHighlightConflicts', !highlightConflicts);
                                            }}
                                        />
                                    </div>

                                    <Divider size='auto' orientation='horizontal' />

                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>
                                                Load All Courses in Course Schedule
                                            </h3>
                                            <p className='text-sm text-gray-600'>
                                                Loads all courses in the Course Schedule site by scrolling, instead of
                                                using next/prev page buttons.
                                            </p>
                                        </div>
                                        <SwitchButton
                                            isChecked={loadAllCourses}
                                            onChange={() => {
                                                setLoadAllCourses(!loadAllCourses);
                                                OptionsStore.set('enableScrollToLoad', !loadAllCourses);
                                            }}
                                        />
                                    </div>

                                    <Divider size='auto' orientation='horizontal' />

                                    <div className='flex items-center justify-between'>
                                        <div className='max-w-xs'>
                                            <h3 className='text-ut-burntorange font-semibold'>Reset All Data</h3>
                                            <p className='text-sm text-gray-600'>
                                                Erases all schedules and courses you have.
                                            </p>
                                        </div>
                                        <Button
                                            variant='outline'
                                            color='ut-red'
                                            icon={DeleteForeverIcon}
                                            onClick={() => console.log('Erase clicked')}
                                        >
                                            Erase All
                                        </Button>
                                    </div>
                                </div>
                                <Preview>
                                    <div className='inline-flex items-center self-center gap-1'>
                                        <Text variant='small' className='text-ut-gray !font-normal'>
                                            DATA LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
                                        </Text>
                                    </div>
                                    <Text
                                        variant='h2-course'
                                        className={clsx('text-center text-ut-red !font-normal', {
                                            'line-through': highlightConflicts,
                                        })}
                                    >
                                        01234 MWF 10:00 AM - 11:00 AM UTC 1.234
                                    </Text>
                                </Preview>
                            </div>
                        </section>

                        <Divider size='auto' orientation='horizontal' />

                        <section className='my-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold' onClick={toggleDevMode}>
                                Developer Mode
                            </h2>
                        </section>
                    </div>

                    <section className='ml-4 w-1/2'>
                        <section>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>LONGHORN DEVELOPERS ADMINS</h2>
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 sm:grid-cols-3'>
                                {LONGHORN_DEVELOPERS_ADMINS.map(admin => (
                                    <div key={admin.githubUsername} className='rounded-lg bg-gray-100 p-4 shadow-md'>
                                        <h3
                                            className='text-ut-burntorange font-semibold hover:cursor-pointer'
                                            onClick={() =>
                                                window.open(`https://github.com/${admin.githubUsername}`, '_blank')
                                            }
                                        >
                                            {admin.name}
                                        </h3>
                                        <p className='text-sm text-gray-600'>{admin.role}</p>
                                        {showGitHubStats && adminGitHubStats[admin.githubUsername] && (
                                            <div className='mt-2'>
                                                <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                                <p className='text-xs'>
                                                    Merged PRs: {adminGitHubStats[admin.githubUsername]?.mergedPRs}
                                                </p>
                                                <p className='text-xs'>
                                                    Commits: {adminGitHubStats[admin.githubUsername]?.commits}
                                                </p>
                                                <p className='text-xs text-ut-green'>
                                                    {adminGitHubStats[admin.githubUsername]?.linesAdded} ++
                                                </p>
                                                <p className='text-xs text-ut-red'>
                                                    {adminGitHubStats[admin.githubUsername]?.linesDeleted} --
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className='my-8'>
                            <h2 className='mb-4 text-xl text-ut-black font-semibold'>UTRP DEVELOPMENT TEAM</h2>
                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4 sm:grid-cols-3'>
                                {contributors.map(username => (
                                    <div key={username} className='rounded-lg bg-gray-100 p-4 shadow-md'>
                                        <h3
                                            className='text-ut-burntorange font-semibold hover:cursor-pointer'
                                            onClick={() => window.open(`https://github.com/${username}`, '_blank')}
                                        >
                                            {username}
                                        </h3>
                                        <p className='text-sm text-gray-600'>Contributor</p>
                                        {showGitHubStats && userGitHubStats[username] && (
                                            <div className='mt-2'>
                                                <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                                <p className='text-xs'>
                                                    Merged PRs: {userGitHubStats[username]?.mergedPRs}
                                                </p>
                                                <p className='text-xs'>Commits: {userGitHubStats[username]?.commits}</p>
                                                <p className='text-xs text-ut-green'>
                                                    {userGitHubStats[username]?.linesAdded} ++
                                                </p>
                                                <p className='text-xs text-ut-red'>
                                                    {userGitHubStats[username]?.linesDeleted} --
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </ExtensionRoot>
    );
}
