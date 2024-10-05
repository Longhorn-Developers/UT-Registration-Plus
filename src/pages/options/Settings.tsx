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
import useSchedules from '@views/hooks/useSchedules';
import { getUpdatedAtDateTimeString } from '@views/lib/getUpdatedAtDateTimeString';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { ExampleCourse } from 'src/stories/components/ConflictsWithWarning.stories';

import DeleteForeverIcon from '~icons/material-symbols/delete-forever';
import RefreshIcon from '~icons/material-symbols/refresh';

import App from './DevMode';
import Preview from './Preview';

type TeamMember = {
    name: string;
    role: string;
    githubUsername: string;
};

type GitHubStats = {
    commits: number;
    linesAdded: number;
    linesDeleted: number;
    mergedPRs: number;
};

type UserStat = {
    author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    };
    total: number;
    weeks: {
        w: number;
        a: number;
        d: number;
        c: number;
    }[];
};

const teamMembers = [
    { name: 'Sriram Hariharan', role: 'Founder', githubUsername: 'sghsri' },
    { name: 'Elie Soloveichik', role: 'Senior Software Engineer', githubUsername: 'Razboy20' },
    { name: 'Diego Perez', role: 'Senior Software Engineer', githubUsername: 'doprz' },
    { name: 'Lukas Zenick', role: 'Senior Software Engineer', githubUsername: 'Lukas-Zenick' },
    { name: 'Isaiah Rodriguez', role: 'Chief Design Officer', githubUsername: 'IsaDavRod' },
] as const satisfies TeamMember[];

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

    const [showGitHubStats, setShowGitHubStats] = useState<boolean>(true);
    const [githubStats, setGithubStats] = useState<Record<string, GitHubStats>>({});

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

    useEffect(() => {
        if (showGitHubStats) {
            // Fetch GitHub stats for each team member
            const fetchStats = async () => {
                const stats: Record<string, GitHubStats> = {};
                for (const member of teamMembers) {
                    try {
                        // eslint-disable-next-line no-await-in-loop
                        const response = await fetch(
                            `https://api.github.com/repos/Longhorn-Developers/UT-Registration-Plus/stats/contributors`
                        );
                        // eslint-disable-next-line no-await-in-loop
                        const data = await response.json();
                        const userStats = data.find((stat: UserStat) => stat.author.login === member.githubUsername);
                        if (userStats) {
                            // Calculate total lines added and deleted
                            const totalLinesAdded = userStats.weeks.reduce(
                                (total: number, week: { a: number }) => total + week.a,
                                0
                            );
                            const totalLinesDeleted = userStats.weeks.reduce(
                                (total: number, week: { d: number }) => total + week.d,
                                0
                            );

                            // Fetch merged PRs for the member
                            // eslint-disable-next-line no-await-in-loop
                            const prResponse = await fetch(
                                `https://api.github.com/search/issues?q=org:Longhorn-Developers%20author:${member.githubUsername}%20type:pr%20is:merged`
                            );
                            // eslint-disable-next-line no-await-in-loop
                            const prData = await prResponse.json();

                            // Store the stats for the member
                            stats[member.githubUsername] = {
                                commits: userStats.total,
                                linesAdded: totalLinesAdded,
                                linesDeleted: totalLinesDeleted,
                                mergedPRs: prData.total_count,
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching stats for ${member.name}:`, error);
                    }
                }
                setGithubStats(stats);
            };
            fetchStats();
        }
    }, [showGitHubStats]);

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
                                {teamMembers.map(member => (
                                    <div key={member.githubUsername} className='rounded-lg bg-gray-100 p-4 shadow-md'>
                                        <h3 className='text-ut-burntorange font-semibold'>{member.name}</h3>
                                        <p className='text-sm text-gray-600'>{member.role}</p>
                                        {showGitHubStats && githubStats[member.githubUsername] && (
                                            <div className='mt-2'>
                                                <p className='text-xs text-gray-500'>GitHub Stats (UTRP repo):</p>
                                                <p className='text-xs'>
                                                    Merged PRs: {githubStats[member.githubUsername]?.mergedPRs}
                                                </p>
                                                <p className='text-xs'>
                                                    Commits: {githubStats[member.githubUsername]?.commits}
                                                </p>
                                                <p className='text-xs text-ut-green'>
                                                    {githubStats[member.githubUsername]?.linesAdded} ++
                                                </p>
                                                <p className='text-xs text-ut-red'>
                                                    {githubStats[member.githubUsername]?.linesDeleted} --
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
