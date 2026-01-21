import importSchedule from '@pages/background/lib/importSchedule';
import { Sidebar } from '@phosphor-icons/react';
import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import { background } from '@shared/messages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import { CRX_PAGES } from '@shared/types/CRXPages';
import { openReportWindow } from '@shared/util/openReportWindow';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import ResourceLinks from '@views/components/calendar/ResourceLinks';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarContext } from '@views/contexts/CalendarContext';
import { useUndo } from '@views/contexts/UndoContext';
import useCourseFromUrl from '@views/hooks/useCourseFromUrl';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';
import { MessageListener } from 'chrome-extension-toolkit';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';

import { Button } from '../common/Button';
import { LargeLogo } from '../common/LogoIcon';
import Text from '../common/Text/Text';
import CalendarFooter from './CalendarFooter';
import DiningAppPromo from './DiningAppPromo';

/**
 * Calendar page component
 */
export default function Calendar(): ReactNode {
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();
    const asyncCourseCells = courseCells.filter(block => block.async);
    const displayBottomBar = asyncCourseCells && asyncCourseCells.length > 0;

    const [course, setCourse] = useState<Course | null>(useCourseFromUrl());

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const showWhatsNewDialog = useWhatsNewPopUp();

    const [showUTDiningPromo, setShowUTDiningPromo] = useState<boolean>(false);
    const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
    const [isValidFileType, setIsValidFileType] = useState<boolean>(false);

    const { removedCourses, clearRemovedCourses, popLastRemovedCourse } = useUndo();

    const queryClient = useQueryClient();
    const { data: showSidebar, isPending: isSidebarStatePending } = useQuery({
        queryKey: ['settings', 'showCalendarSidebar'],
        queryFn: () => OptionsStore.get('showCalendarSidebar'),
        staleTime: Infinity, // Prevent loading state on refocus
    });

    const { mutate: setShowSidebar } = useMutation({
        mutationKey: ['settings', 'showCalendarSidebar'],
        mutationFn: async (showSidebar: boolean) => {
            OptionsStore.set('showCalendarSidebar', showSidebar);
        },
        onSuccess: (_, showSidebar) => {
            queryClient.setQueryData(['settings', 'showCalendarSidebar'], showSidebar);
        },
    });

    useEffect(() => {
        const listener = new MessageListener<CalendarTabMessages>({
            async openCoursePopup({ data, sendResponse }) {
                const course = activeSchedule.courses.find(course => course.uniqueId === data.uniqueId);
                if (course === undefined) return;

                setCourse(course);
                setShowPopup(true);

                const currentTab = await chrome.tabs.getCurrent();
                if (currentTab === undefined) return;
                sendResponse(currentTab);
            },
        });

        listener.listen();

        return () => listener.unlisten();
    }, [activeSchedule]);

    useEffect(() => {
        if (course) setShowPopup(true);
    }, [course]);

    // --- Clear undo state when schedule changes ---
    useEffect(() => {
        clearRemovedCourses();
    }, [activeSchedule.id, clearRemovedCourses]);

    useEffect(() => {
        // Load the user's preference for the promo
        OptionsStore.get('showUTDiningPromo').then(show => {
            setShowUTDiningPromo(show);
        });
    }, []);

    // --- Undo functionality: listen for Cmd+Z / Ctrl+Z ---
    useEffect(() => {
        const handleUndo = async (event: KeyboardEvent) => {
            // Check for Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
            if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
                // Prevent default browser undo behavior
                event.preventDefault();
                event.stopPropagation();

                // Only restore if we have removed courses and we're not in an input field
                if (
                    removedCourses.length > 0 &&
                    event.target instanceof HTMLElement &&
                    event.target.tagName !== 'INPUT' &&
                    event.target.tagName !== 'TEXTAREA'
                ) {
                    // Get the most recently removed course from the stack
                    const lastRemovedCourse = popLastRemovedCourse();
                    if (lastRemovedCourse) {
                        // Restore the course
                        background.addCourse({
                            course: lastRemovedCourse.course,
                            scheduleId: lastRemovedCourse.scheduleId,
                            hasColor: true, // Preserve original colors
                        });
                    }
                }
            }
        };

        document.addEventListener('keydown', handleUndo);
        return () => {
            document.removeEventListener('keydown', handleUndo);
        };
    }, [removedCourses.length, popLastRemovedCourse]);

    // --- Reset drag state when dragging leaves the window ---
    useEffect(() => {
        const handleGlobalDragLeave = (e: DragEvent) => {
            // Reset drag state when leaving the window entirely
            if (e.clientX === 0 && e.clientY === 0) {
                setIsDraggingFile(false);
                setIsValidFileType(false);
            }
        };

        document.addEventListener('dragleave', handleGlobalDragLeave);
        return () => {
            document.removeEventListener('dragleave', handleGlobalDragLeave);
        };
    }, []);

    // --- Drag and drop handlers for calendar page ---
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const { items } = event.dataTransfer;
        if (items && items.length > 0) {
            const item = items[0];
            if (item) {
                // Check if it's a file and either has a JSON MIME type or no MIME type (we'll validate extension on drop)
                const isValid =
                    item.kind === 'file' &&
                    (item.type === 'application/json' || item.type === 'text/json' || item.type === '');
                setIsValidFileType(isValid);
                setIsDraggingFile(true);
            }
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        // Only reset if we're actually leaving the calendar area
        const relatedTarget = event.relatedTarget as HTMLElement;
        if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
            setIsDraggingFile(false);
            setIsValidFileType(false);
        }
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDraggingFile(false);
        setIsValidFileType(false);

        const file = event.dataTransfer.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.json') && file.type !== 'application/json' && file.type !== 'text/json') {
            alert('Please drop a valid JSON schedule file.');
            return;
        }

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            await importSchedule(data);
            alert('Schedule imported successfully.');
        } catch (error) {
            console.error('Error importing schedule:', error);
            alert('Failed to import schedule. Make sure the file is a valid .json format.');
        }
    };
    // --------------------------------------------------

    if (isSidebarStatePending) return null;

    return (
        <CalendarContext.Provider value>
            <div className='relative h-full w-full flex flex-col'>
                {/* Orange drag overlay indicator */}
                {isDraggingFile && isValidFileType && (
                    <div
                        className='pointer-events-none absolute inset-0 z-50 flex items-center justify-center border-4 border-ut-burntorange border-dashed bg-ut-burntorange/20'
                        style={{
                            backgroundColor: 'rgba(191, 87, 0, 0.1)',
                        }}
                    >
                        <div className='border-2 border-ut-burntorange rounded-lg bg-white/90 px-8 py-4 shadow-lg'>
                            <Text variant='h2' className='text-center text-ut-burntorange font-semibold'>
                                Drop schedule file here
                            </Text>
                        </div>
                    </div>
                )}

                <div
                    className='screenshot:calendar-target h-screen flex overflow-auto'
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        className={clsx(
                            'py-spacing-6 relative h-full min-h-screen w-full flex flex-none flex-col justify-between overflow-clip whitespace-nowrap border-r border-ut-offwhite/50 shadow-[2px_0_10px,rgba(214_210_196_/_.1)] motion-safe:duration-300 motion-safe:ease-out-expo motion-safe:transition-[max-width] screenshot:hidden',
                            {
                                'max-w-[20.3125rem] ': showSidebar,
                                'max-w-0 pointer-events-none': !showSidebar,
                            }
                        )}
                        tabIndex={showSidebar ? 0 : -1}
                        aria-hidden={!showSidebar}
                        {...{ inert: !showSidebar }}
                    >
                        <div className='sticky top-0 z-50 w-full flex items-center justify-between gap-x-3xl bg-white px-spacing-8 pb-spacing-6'>
                            <LargeLogo />
                            <Button
                                variant='minimal'
                                size='small'
                                color='theme-black'
                                onClick={() => {
                                    setShowSidebar(!showSidebar);
                                }}
                                className='screenshot:hidden'
                                icon={Sidebar}
                            />
                        </div>

                        <div
                            style={{
                                scrollbarGutter: 'stable',
                            }}
                            className='relative h-full w-full flex grow flex-col gap-y-spacing-6 overflow-x-clip overflow-y-auto pb-spacing-6 pl-spacing-8 pr-4.5'
                        >
                            <CalendarSchedules />
                            <Divider orientation='horizontal' size='100%' />
                            <ResourceLinks />
                            {/* <TeamLinks /> */}
                            <Divider orientation='horizontal' size='100%' />
                            {showUTDiningPromo && (
                                <DiningAppPromo
                                    onClose={() => {
                                        setShowUTDiningPromo(false);
                                        OptionsStore.set('showUTDiningPromo', false);
                                    }}
                                />
                            )}
                            <div className='flex flex-col gap-spacing-3'>
                                <a
                                    href={CRX_PAGES.REPORT}
                                    className='flex items-center gap-spacing-2 text-ut-burntorange underline-offset-2 hover:underline'
                                    target='_blank'
                                    rel='noreferrer'
                                    onClick={event => {
                                        event.preventDefault();
                                        openReportWindow();
                                    }}
                                >
                                    <Text variant='p'>Send us Feedback!</Text>
                                    <OutwardArrowIcon className='h-4 w-4' />
                                </a>
                                <a
                                    href=''
                                    className='flex items-center gap-spacing-2 text-ut-burntorange underline-offset-2 hover:underline'
                                    target='_blank'
                                    rel='noreferrer'
                                    onClick={event => {
                                        event.preventDefault();
                                        showWhatsNewDialog();
                                    }}
                                >
                                    <Text variant='p'>What&apos;s New!</Text>
                                    <OutwardArrowIcon className='h-4 w-4' />
                                </a>
                            </div>
                        </div>

                        <CalendarFooter />
                    </div>

                    <div
                        style={
                            {
                                // scrollbarGutter: 'stable',
                            }
                        }
                        className='z-1 h-full flex flex-grow flex-col overflow-x-scroll [&>*]:px-spacing-5'
                    >
                        <CalendarHeader
                            sidebarOpen={showSidebar}
                            onSidebarToggle={() => {
                                setShowSidebar(!showSidebar);
                            }}
                        />
                        <div
                            className={clsx('min-h-2xl min-w-5xl flex-grow gap-0 pl-spacing-3 screenshot:min-h-xl', {
                                'screenshot:flex-grow-0': displayBottomBar, // html-to-image seems to have a bug with flex-grow
                            })}
                        >
                            <CalendarGrid courseCells={courseCells} setCourse={setCourse} />
                        </div>
                        <CalendarBottomBar courseCells={courseCells} setCourse={setCourse} />
                    </div>
                </div>

                <CourseCatalogInjectedPopup
                    // Ideally let's not use ! here, but it's fine since we know course is always defined when showPopup is true
                    // Let's try to refactor this
                    course={course!} // always defined when showPopup is true
                    onClose={() => setShowPopup(false)}
                    open={showPopup}
                    afterLeave={() => setCourse(null)}
                />
            </div>
        </CalendarContext.Provider>
    );
}
