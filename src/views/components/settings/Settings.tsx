// Pages
import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { deleteAllSchedules } from '@pages/background/lib/deleteSchedule';
import importSchedule from '@pages/background/lib/importSchedule';
// Shared
import { background } from '@shared/messages';
import { DevStore } from '@shared/storage/DevStore';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { CRX_PAGES } from '@shared/types/CRXPages';
import Particles from '@tsparticles/react';
import { Button } from '@views/components/common/Button';
import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
// Views
import Divider from '@views/components/common/Divider';
import { LargeLogo } from '@views/components/common/LogoIcon';
import Text from '@views/components/common/Text/Text';
// Hooks
import useChangelog from '@views/hooks/useChangelog';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import {
    GitHubStatsService,
    LONGHORN_DEVELOPERS_ADMINS,
    LONGHORN_DEVELOPERS_SWE,
    UTRP_ALUMNI,
    UTRP_LEADS,
} from '@views/lib/getGitHubStats';
// Misc
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CalendarDotsIcon from '~icons/ph/calendar-dots';
// Icons
import GitMergeIcon from '~icons/ph/git-merge';

import { useMigrationDialog } from '../common/MigrationDialog';
import { AdvancedSettings } from './AdvancedSettings';
import { ContributorCard } from './ContributorCard';
import { ContributorCardSkeleton } from './ContributorCardSkeleton';
import { DEV_MODE_CLICK_TARGET, INCLUDE_MERGED_PRS, STATS_TOGGLE_KEY } from './constants';
import DevMode from './DevMode';
import { useBirthdayCelebration } from './useBirthdayCelebration';
import { useDevMode } from './useDevMode';

const manifest = chrome.runtime.getManifest();

/**
 * Main Settings Component for managing user settings and preferences.
 *
 * @returns The Settings component.
 */
export default function Settings(): React.JSX.Element {
    const gitHubStatsService = useMemo(() => new GitHubStatsService(), []);
    const calendarPageUrl = chrome.runtime.getURL(CRX_PAGES.CALENDAR);

    const getPersonalWebsite = (member: unknown): string | undefined => {
        if (typeof member !== 'object' || member === null) return undefined;
        const maybeWebsite = (member as { personalWebsite?: unknown }).personalWebsite;
        return typeof maybeWebsite === 'string' ? maybeWebsite : undefined;
    };

    // State
    const [showGitHubStats, setShowGitHubStats] = useState(false);
    const [githubStats, setGitHubStats] = useState<Awaited<
        ReturnType<typeof gitHubStatsService.fetchGitHubStats>
    > | null>(null);
    const options = OptionsStore.useStore();
    const enableDataRefreshing = options.enableDataRefreshing;
    const enableCourseStatusChips = options.enableCourseStatusChips;
    const isDeveloper = DevStore.useStore(store => store.isDeveloper);

    const activeSchedule = useActiveSchedule();
    const showDialog = usePrompt();
    const handleChangelogOnClick = useChangelog();
    const showMigrationDialog = useMigrationDialog();

    const [devMode, toggleDevMode] = useDevMode(DEV_MODE_CLICK_TARGET);
    const { showParticles, particlesInit, particlesOptions, triggerCelebration, isBirthday } = useBirthdayCelebration();

    // Stable skeleton ids to avoid using array index as keys
    const skeletonIdsRef = useRef<string[]>(Array.from({ length: 8 }, (_, i) => `skeleton-${i}`));

    // Initialize settings and listeners
    useEffect(() => {
        const fetchGitHubStats = async () => {
            try {
                const stats = await gitHubStatsService.fetchGitHubStats();
                setGitHubStats(stats);
            } catch (error) {
                console.warn('Error fetching GitHub stats:', error);
            }
        };

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === STATS_TOGGLE_KEY || event.key === STATS_TOGGLE_KEY.toUpperCase()) {
                setShowGitHubStats(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        fetchGitHubStats();

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [gitHubStatsService]);

    const handleEraseAll = useCallback(() => {
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
    }, [showDialog]);

    const handleImportClick = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            await importSchedule(data);
            alert('Schedule imported successfully.');
        } catch (error) {
            console.error('Error importing schedule:', error);
            alert('Failed to import schedule. Make sure the file is a valid .json format.');
        }
    }, []);

    const sortedContributors = useMemo(() => {
        const base = [...LONGHORN_DEVELOPERS_SWE, ...UTRP_LEADS, ...UTRP_ALUMNI];
        if (!githubStats) return base;
        return [...base].sort(
            (a, b) =>
                (githubStats.userGitHubStats[b.githubUsername]?.commits ?? 0) -
                (githubStats.userGitHubStats[a.githubUsername]?.commits ?? 0)
        );
    }, [githubStats]);

    const additionalContributors = useMemo(() => {
        if (!githubStats) return [];
        const knownUsernames = new Set<string>([
            ...LONGHORN_DEVELOPERS_ADMINS.map(a => a.githubUsername),
            ...LONGHORN_DEVELOPERS_SWE.map(s => s.githubUsername),
            ...UTRP_LEADS.map(l => l.githubUsername),
            ...UTRP_ALUMNI.map(a => a.githubUsername),
        ]);
        return Object.keys(githubStats.userGitHubStats)
            .filter(username => !knownUsernames.has(username))
            .sort(
                (a, b) =>
                    (githubStats.userGitHubStats[b]?.commits ?? 0) - (githubStats.userGitHubStats[a]?.commits ?? 0)
            );
    }, [githubStats]);

    if (devMode) {
        DevStore.set('isDeveloper', true);
        return <DevMode />;
    }

    return (
        <div className='relative'>
            {particlesInit && showParticles && (
                <Particles
                    id='birthday-particles'
                    options={particlesOptions}
                    className='pointer-events-none absolute inset-0 z-50'
                />
            )}

            <header className='flex items-center gap-5 overflow-x-auto overflow-y-hidden border-b border-ut-offwhite px-7 py-4 md:overflow-x-hidden'>
                <a
                    href={calendarPageUrl}
                    title='Back to Calendar'
                    onClick={event => {
                        event.preventDefault();
                        background.switchToCalendarTab({});
                    }}
                >
                    <LargeLogo />
                </a>
                <Divider className='mx-2 self-center md:mx-4' size='2.5rem' orientation='vertical' />
                <div className='flex flex-1 items-center gap-2'>
                    <Text variant='h1' className='text-ut-burntorange normal-case'>
                        Settings
                    </Text>
                    {isBirthday && (
                        <button
                            type='button'
                            onClick={triggerCelebration}
                            className='bg-transparent px-4 text-sm text-ut-burntorange transition-transform hover:scale-110'
                            title='Click to celebrate!'
                        >
                            🎉 Happy Birthday LHD! 🎉
                        </button>
                    )}
                </div>
                <div className='hidden flex-row items-center justify-end gap-spacing-7 screenshot:hidden lg:flex'>
                    <Button
                        variant='minimal'
                        size='small'
                        color='theme-black'
                        title='Read Changelog'
                        onClick={handleChangelogOnClick}
                    >
                        <GitMergeIcon className='h-6 w-6 text-ut-gray' />
                        <span className='text-ut-black'>
                            v{manifest.version}
                            {import.meta.env.DEV ? '-dev' : ''}
                        </span>
                    </Button>
                    <Button
                        variant='minimal'
                        size='small'
                        icon={CalendarDotsIcon}
                        color='ut-black'
                        title='Open Calendar'
                        onClick={() => background.switchToCalendarTab({})}
                    >
                        Calendar
                    </Button>
                </div>
            </header>

            <div className='p-6 lg:flex'>
                <div className='mr-4 lg:w-1/2 xl:w-xl'>
                    {options && (
                        <AdvancedSettings
                            highlightConflicts={options.enableHighlightConflicts}
                            loadAllCourses={options.enableScrollToLoad}
                            increaseScheduleLimit={options.allowMoreSchedules}
                            calendarNewTab={options.alwaysOpenCalendarInNewTab}
                            enableDataRefreshing={enableDataRefreshing}
                            enableCourseStatusChips={enableCourseStatusChips}
                            activeSchedule={activeSchedule}
                            handleEraseAll={handleEraseAll}
                            handleImportClick={handleImportClick}
                        />
                    )}

                    <Divider size='auto' orientation='horizontal' />

                    <section className='my-8 space-y-4'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>
                            <button
                                type='button'
                                onClick={toggleDevMode}
                                className='bg-transparent text-inherit text-xl font-semibold'
                            >
                                Developer Mode
                            </button>
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

                        {isDeveloper && (
                            <>
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
                                            background.openNewTab({
                                                url: debugPageUrl,
                                            });
                                        }}
                                    >
                                        Open Debug Page
                                    </Button>
                                </div>

                                <Divider size='auto' orientation='horizontal' />

                                <Button
                                    variant='filled'
                                    color='ut-black'
                                    onClick={() => addCourseByURL(activeSchedule)}
                                >
                                    Add course by link
                                </Button>
                                <Button variant='filled' color='ut-burntorange' onClick={showMigrationDialog}>
                                    Show Migration Dialog
                                </Button>
                            </>
                        )}
                    </section>
                </div>

                <Divider className='lg:hidden' size='auto' orientation='horizontal' />

                <section className='my-8 lg:my-0 lg:ml-4 lg:w-1/2'>
                    <section>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>
                            LONGHORN DEVELOPERS (LHD) EXECUTIVE BOARD
                        </h2>
                        <div className='grid grid-cols-2 gap-4 2xl:grid-cols-4 md:grid-cols-3'>
                            {LONGHORN_DEVELOPERS_ADMINS.map(admin => (
                                <ContributorCard
                                    key={admin.githubUsername}
                                    name={admin.name}
                                    githubUsername={admin.githubUsername}
                                    personalWebsite={getPersonalWebsite(admin)}
                                    roles={admin.role}
                                    stats={githubStats?.adminGitHubStats[admin.githubUsername]}
                                    showStats={showGitHubStats}
                                    includeMergedPRs={INCLUDE_MERGED_PRS}
                                />
                            ))}
                        </div>
                    </section>
                    <section className='my-8'>
                        <h2 className='mb-4 text-xl text-ut-black font-semibold'>UTRP CONTRIBUTORS</h2>
                        <div className='grid grid-cols-2 gap-4 2xl:grid-cols-4 md:grid-cols-3 xl:grid-cols-3'>
                            {sortedContributors.map(swe => (
                                <ContributorCard
                                    key={swe.githubUsername}
                                    name={swe.name}
                                    githubUsername={swe.githubUsername}
                                    personalWebsite={getPersonalWebsite(swe)}
                                    roles={swe.role}
                                    stats={githubStats?.userGitHubStats[swe.githubUsername]}
                                    showStats={showGitHubStats}
                                    includeMergedPRs={INCLUDE_MERGED_PRS}
                                />
                            ))}
                            {githubStats === null
                                ? skeletonIdsRef.current.slice(0, 8).map(id => <ContributorCardSkeleton key={id} />)
                                : additionalContributors.map(username => (
                                      <ContributorCard
                                          key={username}
                                          name={githubStats?.names[username] || username}
                                          githubUsername={username}
                                          roles={['Contributor']}
                                          stats={githubStats?.userGitHubStats[username]}
                                          showStats={showGitHubStats}
                                          includeMergedPRs={INCLUDE_MERGED_PRS}
                                      />
                                  ))}
                        </div>
                    </section>
                </section>
            </div>
        </div>
    );
}
