// import addCourse from '@pages/background/lib/addCourse';
import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { deleteAllSchedules } from '@pages/background/lib/deleteSchedule';
import exportSchedule from '@pages/background/lib/exportSchedule';
import importSchedule from '@pages/background/lib/importSchedule';
import { CalendarDots, Trash } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { CRX_PAGES } from '@shared/types/CRXPages';
import MIMEType from '@shared/types/MIMEType';
import { downloadBlob } from '@shared/util/downloadBlob';
// import { addCourseByUrl } from '@shared/util/courseUtils';
// import { getCourseColors } from '@shared/util/colors';
// import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import { Button } from '@views/components/common/Button';
import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
// import PopupCourseBlock from '@views/components/common/PopupCourseBlock';
import SwitchButton from '@views/components/common/SwitchButton';
import Text from '@views/components/common/Text/Text';
import useChangelog from '@views/hooks/useChangelog';
import useSchedules from '@views/hooks/useSchedules';
// import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
// import getCourseTableRows from '@views/lib/getCourseTableRows';
import { GitHubStatsService, LONGHORN_DEVELOPERS_ADMINS, LONGHORN_DEVELOPERS_SWE } from '@views/lib/getGitHubStats';
// import { SiteSupport } from '@views/lib/getSiteSupport';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

import IconoirGitFork from '~icons/iconoir/git-fork';

// import { ExampleCourse } from 'src/stories/components/ConflictsWithWarning.stories';;
import FileUpload from '../common/FileUpload';
import { useMigrationDialog } from '../common/MigrationDialog';
// import RefreshIcon from '~icons/material-symbols/refresh';
import DevMode from './DevMode';
import Preview from './Preview';

const DISPLAY_PREVIEWS = false;
const PREVIEW_SECTION_DIV_CLASSNAME = DISPLAY_PREVIEWS ? 'w-1/2 space-y-4' : 'flex-grow space-y-4';

const manifest = chrome.runtime.getManifest();

const gitHubStatsService = new GitHubStatsService();
const includeMergedPRs = false;

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
 * Component for managing user settings and preferences.
 *
 * @returns The Settings component.
 */
export default function Settings(): JSX.Element {
    const [_enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    // const [_showTimeLocation, setShowTimeLocation] = useState<boolean>(false);
    const [highlightConflicts, setHighlightConflicts] = useState<boolean>(false);
    const [loadAllCourses, setLoadAllCourses] = useState<boolean>(false);
    const [_enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);
    const [calendarNewTab, setCalendarNewTab] = useState<boolean>(false);

    const showMigrationDialog = useMigrationDialog();

    // Toggle GitHub stats when the user presses the 'S' key
    const [showGitHubStats, setShowGitHubStats] = useState<boolean>(false);
    const [githubStats, setGitHubStats] = useState<Awaited<
        ReturnType<typeof gitHubStatsService.fetchGitHubStats>
    > | null>(null);

    const [activeSchedule] = useSchedules();
    // const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const showDialog = usePrompt();
    const handleChangelogOnClick = useChangelog();

    useEffect(() => {
        const fetchGitHubStats = async () => {
            try {
                const stats = await gitHubStatsService.fetchGitHubStats();
                setGitHubStats(stats);
            } catch (error) {
                console.warn('Error fetching GitHub stats:', error);
            }
        };

        const initAndSetSettings = async () => {
            const {
                enableCourseStatusChips,
                enableHighlightConflicts,
                enableScrollToLoad,
                enableDataRefreshing,
                alwaysOpenCalendarInNewTab,
            } = await initSettings();
            setEnableCourseStatusChips(enableCourseStatusChips);
            // setShowTimeLocation(enableTimeAndLocationInPopup);
            setHighlightConflicts(enableHighlightConflicts);
            setLoadAllCourses(enableScrollToLoad);
            setEnableDataRefreshing(enableDataRefreshing);
            setCalendarNewTab(alwaysOpenCalendarInNewTab);
        };

        fetchGitHubStats();
        initAndSetSettings();

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'S' || event.key === 's') {
                setShowGitHubStats(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        // Listen for changes in the settings
        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        // const l2 = OptionsStore.listen('enableTimeAndLocationInPopup', async ({ newValue }) => {
        //     setShowTimeLocation(newValue);
        //     // console.log('enableTimeAndLocationInPopup', newValue);
        // });

        const l2 = OptionsStore.listen('enableHighlightConflicts', async ({ newValue }) => {
            setHighlightConflicts(newValue);
            // console.log('enableHighlightConflicts', newValue);
        });

        const l3 = OptionsStore.listen('enableScrollToLoad', async ({ newValue }) => {
            setLoadAllCourses(newValue);
            // console.log('enableScrollToLoad', newValue);
        });

        const l4 = OptionsStore.listen('enableDataRefreshing', async ({ newValue }) => {
            setEnableDataRefreshing(newValue);
            // console.log('enableDataRefreshing', newValue);
        });

        const l5 = OptionsStore.listen('alwaysOpenCalendarInNewTab', async ({ newValue }) => {
            setCalendarNewTab(newValue);
            // console.log('alwaysOpenCalendarInNewTab', newValue);
        });

        // Remove listeners when the component is unmounted
        return () => {
            OptionsStore.removeListener(l1);
            OptionsStore.removeListener(l2);
            OptionsStore.removeListener(l3);
            OptionsStore.removeListener(l4);
            OptionsStore.removeListener(l5);

            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handleEraseAll = () => {
        showDialog({
            title: 'Erase All Course/Schedule Data',
            description: (
                <>
                    <p>
                        Are you sure you want to erase all schedules and courses you have? This action is permanent and
                        cannot be undone.
                    </p>
                    <br />
                    <p className='text-sm text-gray-600'>Note: This will not erase your settings and preferences.</p>
                </>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: accept => (
                <Button
                    variant='filled'
                    color='ut-burntorange'
                    onClick={() => {
                        deleteAllSchedules();
                        accept();
                    }}
                >
                    I Understand
                </Button>
            ),
        });
    };

    const handleExportClick = async (id: string) => {
        const jsonString = await exportSchedule(id);
        if (jsonString) {
            const schedules = await UserScheduleStore.get('schedules');
            const schedule = schedules.find(s => s.id === id);
            const fileName = `${schedule?.name ?? `schedule_${id}`}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            await downloadBlob(jsonString, 'JSON', fileName);
        } else {
            console.error('Error exporting schedule: jsonString is undefined');
        }
    };

    const handleImportClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async e => {
                try {
                    const result = e.target?.result as string;
                    const jsonObject = JSON.parse(result);
                    await importSchedule(jsonObject);
                } catch (error) {
                    console.error('Invalid import file!');
                }
            };
            reader.readAsText(file);
        }
    };

    // const handleAddCourseByLink = async () => {
    //     // todo: Use a proper modal instead of a prompt
    //     const link: string | null = prompt('Enter course link');
    //     // Exit if the user cancels the prompt
    //     if (link === null) return;
    //     await addCourseByUrl(link, activeSchedule);
    // };

    const [devMode, toggleDevMode] = useDevMode(10);

    if (devMode) {
        return <DevMode />;
    }

    return (
        <div>
            <header className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
                <LargeLogo />
                <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
                <Text variant='h1' className='flex-1 text-ut-burntorange normal-case!'>
                    Settings and Credits
                </Text>
                <div className='hidden flex-row items-center justify-end gap-6 screenshot:hidden lg:flex'>
                    <Button variant='minimal' color='theme-black' onClick={handleChangelogOnClick}>
                        <IconoirGitFork className='h-6 w-6 text-ut-gray' />
                        <Text variant='small' className='text-ut-gray font-normal'>
                            v{manifest.version} - {process.env.NODE_ENV}
                        </Text>
                    </Button>
                    <Button
                        variant='filled'
                        icon={CalendarDots}
                        color='ut-burntorange'
                        onClick={() => background.switchToCalendarTab({})}
                    >
                        Calendar
                    </Button>
                </div>
            </header>

            <div className='p-6 lg:flex'>
                <div className='mr-4 lg:w-1/2 xl:w-xl'>
                    {/* <section className='mb-8'>
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
                            {DISPLAY_PREVIEWS && (
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
                            )}
                        </div>
                    </section>

                    <Divider size='auto' orientation='horizontal' /> */}

                    <section className='mb-8'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>ADVANCED SETTINGS</h2>
                        <div className='flex space-x-4'>
                            <div className={PREVIEW_SECTION_DIV_CLASSNAME}>
                                {/* <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <h3 className='text-ut-burntorange font-semibold'>Refresh Data</h3>
                                        <p className='text-sm text-gray-600'>
                                            Refreshes waitlist, course status, and other info with the latest data from
                                            UT&apos;s site.
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

                                <Divider size='auto' orientation='horizontal' /> */}

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Export Current Schedule
                                        </Text>
                                        <p className='text-sm text-gray-600'>
                                            Backup your active schedule to a portable file
                                        </p>
                                    </div>
                                    <Button
                                        variant='outline'
                                        color='ut-burntorange'
                                        onClick={() => handleExportClick(activeSchedule.id)}
                                    >
                                        Export
                                    </Button>
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Import Schedule
                                        </Text>
                                        <p className='text-sm text-gray-600'>Import from a schedule file</p>
                                    </div>
                                    <FileUpload
                                        variant='filled'
                                        color='ut-burntorange'
                                        onChange={handleImportClick}
                                        accept={MIMEType.JSON}
                                    >
                                        Import Schedule
                                    </FileUpload>
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Course Conflict Highlight
                                        </Text>
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
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Load All Courses in Course Schedule
                                        </Text>
                                        <p className='text-sm text-gray-600'>
                                            Loads all courses in the Course Schedule site by scrolling, instead of using
                                            next/prev page buttons.
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
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Always Open Calendar in New Tab
                                        </Text>
                                        <p className='text-sm text-gray-600'>
                                            Always opens the calendar view in a new tab when navigating to the calendar
                                            page. May prevent issues where the calendar refuses to open.
                                        </p>
                                    </div>
                                    <SwitchButton
                                        isChecked={calendarNewTab}
                                        onChange={() => {
                                            setCalendarNewTab(!calendarNewTab);
                                            OptionsStore.set('alwaysOpenCalendarInNewTab', !calendarNewTab);
                                        }}
                                    />
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <div className='flex items-center justify-between'>
                                    <div className='max-w-xs'>
                                        <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                            Reset All Data
                                        </Text>
                                        <p className='text-sm text-gray-600'>
                                            Erases all schedules and courses you have.
                                        </p>
                                    </div>
                                    <Button variant='outline' color='theme-red' icon={Trash} onClick={handleEraseAll}>
                                        Erase All
                                    </Button>
                                </div>
                            </div>
                            {DISPLAY_PREVIEWS && (
                                <Preview>
                                    <Text
                                        variant='h2-course'
                                        className={clsx('text-center text-theme-red !font-normal', {
                                            'line-through': highlightConflicts,
                                        })}
                                    >
                                        01234 MWF 10:00 AM - 11:00 AM UTC 1.234
                                    </Text>
                                </Preview>
                            )}
                        </div>
                    </section>

                    <Divider size='auto' orientation='horizontal' />

                    <section className='my-8 space-y-4'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold' onClick={toggleDevMode}>
                            Developer Mode
                        </h2>

                        <div className='flex items-center justify-between'>
                            <div className='max-w-xs'>
                                <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                    UTRP Map
                                </Text>
                                <span className='mx-2 border border-ut-burntorange rounded px-2 py-0.5 text-xs text-ut-burntorange font-medium'>
                                    BETA
                                </span>
                                <p className='text-sm text-gray-600'>
                                    Navigate campus efficiently with our interactive map tool that integrates with your
                                    schedule
                                </p>
                            </div>
                            <Button
                                variant='outline'
                                color='ut-burntorange'
                                onClick={() => {
                                    const mapPageUrl = chrome.runtime.getURL(CRX_PAGES.MAP);
                                    background.openNewTab({ url: mapPageUrl });
                                }}
                            >
                                Try UTRP Map
                            </Button>
                        </div>

                        <Divider size='auto' orientation='horizontal' />

                        <div className='flex items-center justify-between'>
                            <div className='max-w-xs'>
                                <Text variant='h4' className='text-ut-burntorange font-semibold'>
                                    Debug Page
                                </Text>
                                <span className='mx-2 border border-ut-gray rounded px-2 py-0.5 text-xs text-ut-gray font-medium'>
                                    DEV
                                </span>
                                <p className='text-sm text-gray-600'>
                                    Open the developer debug page to view extension storage and debug logs
                                </p>
                            </div>
                            <Button
                                variant='outline'
                                color='ut-burntorange'
                                onClick={() => {
                                    const debugPageUrl = chrome.runtime.getURL(CRX_PAGES.DEBUG);
                                    background.openNewTab({ url: debugPageUrl });
                                }}
                            >
                                Open Debug Page
                            </Button>
                        </div>

                        <Divider size='auto' orientation='horizontal' />

                        <Button variant='filled' color='ut-black' onClick={() => addCourseByURL(activeSchedule)}>
                            Add course by link
                        </Button>
                        <Button variant='filled' color='ut-burntorange' onClick={showMigrationDialog}>
                            Show Migration Dialog
                        </Button>
                    </section>
                </div>

                <Divider className='lg:hidden' size='auto' orientation='horizontal' />

                <section className='my-8 lg:my-0 lg:ml-4 lg:w-1/2'>
                    <section>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>LONGHORN DEVELOPERS ADMINS</h2>
                        <div className='grid grid-cols-2 gap-4 2xl:grid-cols-4 md:grid-cols-3'>
                            {LONGHORN_DEVELOPERS_ADMINS.map(admin => (
                                <div
                                    key={admin.githubUsername}
                                    className='border border-gray-300 rounded bg-ut-gray/10 p-4'
                                >
                                    <Text
                                        variant='p'
                                        className='text-ut-burntorange font-semibold hover:cursor-pointer'
                                        onClick={() =>
                                            window.open(`https://github.com/${admin.githubUsername}`, '_blank')
                                        }
                                    >
                                        {admin.name}
                                    </Text>
                                    <p className='text-sm text-gray-600'>{admin.role}</p>
                                    {showGitHubStats && githubStats && (
                                        <div className='mt-2'>
                                            <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                            {includeMergedPRs && (
                                                <p className='text-xs'>
                                                    Merged PRS:{' '}
                                                    {githubStats.adminGitHubStats[admin.githubUsername]?.mergedPRs}
                                                </p>
                                            )}
                                            <p className='text-xs'>
                                                Commits: {githubStats.adminGitHubStats[admin.githubUsername]?.commits}
                                            </p>
                                            <p className='text-xs text-ut-green'>
                                                {githubStats.adminGitHubStats[admin.githubUsername]?.linesAdded} ++
                                            </p>
                                            <p className='text-xs text-theme-red'>
                                                {githubStats.adminGitHubStats[admin.githubUsername]?.linesDeleted} --
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className='my-8'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>UTRP CONTRIBUTORS</h2>
                        <div className='grid grid-cols-2 gap-4 2xl:grid-cols-4 md:grid-cols-3 xl:grid-cols-3'>
                            {LONGHORN_DEVELOPERS_SWE.sort(
                                (a, b) =>
                                    (githubStats?.userGitHubStats[b.githubUsername]?.commits ?? 0) -
                                    (githubStats?.userGitHubStats[a.githubUsername]?.commits ?? 0)
                            ).map(swe => (
                                <div
                                    key={swe.githubUsername}
                                    className='border border-gray-300 rounded bg-ut-gray/10 p-4'
                                >
                                    <Text
                                        variant='p'
                                        className='text-ut-burntorange font-semibold hover:cursor-pointer'
                                        onClick={() =>
                                            window.open(`https://github.com/${swe.githubUsername}`, '_blank')
                                        }
                                    >
                                        {swe.name}
                                    </Text>
                                    <p className='text-sm text-gray-600'>{swe.role}</p>
                                    {showGitHubStats && githubStats && (
                                        <div className='mt-2'>
                                            <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                            {includeMergedPRs && (
                                                <p className='text-xs'>
                                                    Merged PRS:{' '}
                                                    {githubStats.userGitHubStats[swe.githubUsername]?.mergedPRs}
                                                </p>
                                            )}
                                            <p className='text-xs'>
                                                Commits: {githubStats.userGitHubStats[swe.githubUsername]?.commits}
                                            </p>
                                            <p className='text-xs text-ut-green'>
                                                {githubStats.userGitHubStats[swe.githubUsername]?.linesAdded} ++
                                            </p>
                                            <p className='text-xs text-theme-red'>
                                                {githubStats.userGitHubStats[swe.githubUsername]?.linesDeleted} --
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {githubStats &&
                                Object.keys(githubStats.userGitHubStats)
                                    .filter(
                                        username =>
                                            !LONGHORN_DEVELOPERS_ADMINS.some(
                                                admin => admin.githubUsername === username
                                            ) && !LONGHORN_DEVELOPERS_SWE.some(swe => swe.githubUsername === username)
                                    )
                                    .sort(
                                        (a, b) =>
                                            (githubStats.userGitHubStats[b]?.commits ?? 0) -
                                            (githubStats.userGitHubStats[a]?.commits ?? 0)
                                    )
                                    .map(username => (
                                        <div
                                            key={username}
                                            className='overflow-clip border border-gray-300 rounded bg-ut-gray/10 p-4'
                                        >
                                            <Text
                                                variant='p'
                                                className='text-ut-burntorange font-semibold hover:cursor-pointer'
                                                onClick={() => window.open(`https://github.com/${username}`, '_blank')}
                                            >
                                                {githubStats.names[username]}
                                            </Text>
                                            <p className='text-sm text-gray-600'>Contributor</p>
                                            {showGitHubStats && (
                                                <div className='mt-2'>
                                                    <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                                    {includeMergedPRs && (
                                                        <p className='text-xs'>
                                                            Merged PRs:{' '}
                                                            {githubStats.userGitHubStats[username]?.mergedPRs}
                                                        </p>
                                                    )}
                                                    <p className='text-xs'>
                                                        Commits: {githubStats.userGitHubStats[username]?.commits}
                                                    </p>
                                                    <p className='text-xs text-ut-green'>
                                                        {githubStats.userGitHubStats[username]?.linesAdded} ++
                                                    </p>
                                                    <p className='text-xs text-theme-red'>
                                                        {githubStats.userGitHubStats[username]?.linesDeleted} --
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
    );
}
