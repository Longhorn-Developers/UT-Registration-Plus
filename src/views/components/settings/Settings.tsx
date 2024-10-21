import addCourse from '@pages/background/lib/addCourse';
import { deleteAllSchedules } from '@pages/background/lib/deleteSchedule';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
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
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { GitHubStatsService, LONGHORN_DEVELOPERS_ADMINS, LONGHORN_DEVELOPERS_SWE } from '@views/lib/getGitHubStats';
import { SiteSupport } from '@views/lib/getSiteSupport';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

import IconoirGitFork from '~icons/iconoir/git-fork';
// import { ExampleCourse } from 'src/stories/components/ConflictsWithWarning.stories';
import DeleteForeverIcon from '~icons/material-symbols/delete-forever';

import { useMigrationDialog } from '../common/MigrationDialog';
// import RefreshIcon from '~icons/material-symbols/refresh';
import DevMode from './DevMode';
import Preview from './Preview';

const DISPLAY_PREVIEWS = false;
const PREVIEW_SECTION_DIV_CLASSNAME = DISPLAY_PREVIEWS ? 'w-1/2 space-y-4' : 'flex-grow space-y-4';

const manifest = chrome.runtime.getManifest();
const LDIconURL = new URL('/src/assets/LD-icon.png', import.meta.url).href;

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
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const [showTimeLocation, setShowTimeLocation] = useState<boolean>(false);
    const [highlightConflicts, setHighlightConflicts] = useState<boolean>(false);
    const [loadAllCourses, setLoadAllCourses] = useState<boolean>(false);
    const [enableDataRefreshing, setEnableDataRefreshing] = useState<boolean>(false);

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
                enableTimeAndLocationInPopup,
                enableHighlightConflicts,
                enableScrollToLoad,
                enableDataRefreshing,
            } = await initSettings();
            setEnableCourseStatusChips(enableCourseStatusChips);
            setShowTimeLocation(enableTimeAndLocationInPopup);
            setHighlightConflicts(enableHighlightConflicts);
            setLoadAllCourses(enableScrollToLoad);
            setEnableDataRefreshing(enableDataRefreshing);
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

    // todo: move into a util/shared place, rather than specifically in settings
    const handleAddCourseByUrl = async () => {
        // todo: Use a proper modal instead of a prompt
        // eslint-disable-next-line no-alert
        const link: string | null = prompt('Enter course link');

        // Exit if the user cancels the prompt
        if (link === null) return;

        try {
            let response: Response;
            try {
                response = await fetch(link);
            } catch (e) {
                alert(`Failed to fetch url '${link}'`);
                return;
            }
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');

            const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, link);
            const tableRows = getCourseTableRows(doc);
            const courses = scraper.scrape(tableRows, false);

            if (courses.length === 1) {
                const description = scraper.getDescription(doc);
                const row = courses[0]!;
                const course = row.course!;
                course.description = description;
                // console.log(course);

                if (activeSchedule.courses.every(c => c.uniqueId !== course.uniqueId)) {
                    console.log('adding course');
                    addCourse(activeSchedule.id, course);
                } else {
                    console.log('course already exists');
                }
            } else {
                console.log(courses);
            }
        } catch (error) {
            console.error('Error scraping course:', error);
        }
    };

    const [devMode, toggleDevMode] = useDevMode(10);

    if (devMode) {
        return <DevMode />;
    }

    return (
        <div>
            <header className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
                <LargeLogo />
                <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
                <Text variant='h1' className='flex-1 text-ut-burntorange'>
                    UTRP SETTINGS & CREDITS PAGE
                </Text>
                <div className='hidden flex-row items-center justify-end gap-6 screenshot:hidden lg:flex'>
                    <Button variant='single' color='theme-black' onClick={handleChangelogOnClick}>
                        <IconoirGitFork className='h-6 w-6 text-ut-gray' />
                        <Text variant='small' className='text-ut-gray font-normal'>
                            v{manifest.version} - {process.env.NODE_ENV}
                        </Text>
                    </Button>
                    <img src={LDIconURL} alt='LD Icon' className='h-10 w-10 rounded-lg' />
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
                                            Reset All Data
                                        </Text>
                                        <p className='text-sm text-gray-600'>
                                            Erases all schedules and courses you have.
                                        </p>
                                    </div>
                                    <Button
                                        variant='outline'
                                        color='ut-red'
                                        icon={DeleteForeverIcon}
                                        onClick={handleEraseAll}
                                    >
                                        Erase All
                                    </Button>
                                </div>
                            </div>
                            {DISPLAY_PREVIEWS && (
                                <Preview>
                                    <div className='inline-flex items-center self-center gap-1'>
                                        <Text variant='small' className='text-ut-gray !font-normal'>
                                            LAST UPDATED: {getUpdatedAtDateTimeString(activeSchedule.updatedAt)}
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
                            )}
                        </div>
                    </section>

                    <Divider size='auto' orientation='horizontal' />

                    <section className='my-8 space-y-4'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold' onClick={toggleDevMode}>
                            Developer Mode
                        </h2>
                        <Button variant='filled' color='ut-black' onClick={handleAddCourseByUrl}>
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
                                            <p className='text-xs text-ut-red'>
                                                {githubStats.adminGitHubStats[admin.githubUsername]?.linesDeleted} --
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className='my-8'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>UTRP CONTRIBUTERS</h2>
                        <div className='grid grid-cols-2 gap-4 2xl:grid-cols-4 md:grid-cols-3 xl:grid-cols-3'>
                            {LONGHORN_DEVELOPERS_SWE.map(swe => (
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
                                            <p className='text-xs text-ut-red'>
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
                                                @{username}
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
                                                    <p className='text-xs text-ut-red'>
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
