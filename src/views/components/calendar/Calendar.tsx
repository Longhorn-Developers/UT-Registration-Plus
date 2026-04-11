import { MessageListener } from '@chrome-extension-toolkit';
import importSchedule from '@pages/background/lib/importSchedule';
import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import ResourceLinks from '@views/components/calendar/ResourceLinks';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarContext } from '@views/contexts/CalendarContext';
import useCourseFromUrl from '@views/hooks/useCourseFromUrl';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import useReportIssueDialog from '@views/hooks/useReportIssueDialog';
import refreshCourses from '@views/lib/refreshCourses';
import clsx from 'clsx';
import type React from 'react';
import type { ReactNode } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';
import SidebarIcon from '~icons/ph/sidebar';

import { Button } from '../common/Button';
import { LargeLogo } from '../common/LogoIcon';
import Text from '../common/Text/Text';
import CalendarFooter from './CalendarFooter';

const CalendarSidebar = memo(function CalendarSidebar() {
    const showSidebar = OptionsStore.useStore(store => store.showCalendarSidebar);
    const toggleSidebar = () => void OptionsStore.set('showCalendarSidebar', !showSidebar);
    const showReportIssueDialog = useReportIssueDialog();
    const sidebarRef = useRef<HTMLDivElement>(null);

    // TODO: Replace with JSX `inert={!showSidebar}` once React supports the inert attribute natively.
    useEffect(() => {
        if (sidebarRef.current) {
            if (showSidebar) {
                sidebarRef.current.removeAttribute('inert');
            } else {
                sidebarRef.current.setAttribute('inert', '');
            }
        }
    }, [showSidebar]);

    return (
        <div
            ref={sidebarRef}
            className={clsx(
                'py-spacing-5 relative h-full min-h-screen w-full flex flex-none flex-col justify-between overflow-clip whitespace-nowrap border-r border-ut-offwhite/50 shadow-[2px_0_10px,rgba(214_210_196_/_.1)] motion-safe:duration-300 motion-safe:ease-out-expo motion-safe:transition-[max-width] screenshot:hidden',
                {
                    'max-w-[20.3125rem] ': showSidebar,
                    'max-w-0 pointer-events-none': !showSidebar,
                }
            )}
            tabIndex={-1}
            aria-hidden={!showSidebar}
        >
            <div className='flex items-center justify-between px-spacing-7 mb-spacing-2'>
                <LargeLogo />
                <Button
                    variant='minimal'
                    size='small'
                    color='theme-black'
                    onClick={toggleSidebar}
                    className='screenshot:hidden'
                    icon={SidebarIcon}
                />
            </div>

            <div
                style={{
                    scrollbarGutter: 'stable',
                }}
                className='relative h-full w-full flex flex-grow flex-col gap-y-spacing-6 overflow-x-clip overflow-y-auto pb-spacing-6 pl-spacing-7 pr-2.75'
            >
                <CalendarSchedules />
                <Divider orientation='horizontal' size='100%' />
                <ResourceLinks />
                <Divider orientation='horizontal' size='100%' />
                <button
                    type='button'
                    onClick={showReportIssueDialog}
                    className='bg-transparent mt-auto flex items-center gap-spacing-2 text-ut-burntorange underline-offset-2 hover:underline'
                >
                    <Text variant='p'>Send us Feedback!</Text>
                    <OutwardArrowIcon className='h-4 w-4' />
                </button>
            </div>

            <CalendarFooter />
        </div>
    );
});

/**
 * Calendar page component
 */
export default function Calendar(): ReactNode {
    const { courseCells, activeSchedule, startMinutes, endMinutes } = useFlattenedCourseSchedule();
    const displayBottomBar = true;
    const initialCourse = useCourseFromUrl();
    const [course, setCourse] = useState<Course | null>(initialCourse);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(initialCourse !== null);
    const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
    const [isValidFileType, setIsValidFileType] = useState<boolean>(false);
    const showSidebar = OptionsStore.useStore(store => store.showCalendarSidebar);
    const toggleSidebar = () => void OptionsStore.set('showCalendarSidebar', !showSidebar);

    const activeScheduleRef = useRef(activeSchedule);
    activeScheduleRef.current = activeSchedule;

    // silently refreshes course data when the calendar opens or the active schedule changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: id is a trigger, not a value read
    useEffect(() => {
        void refreshCourses({ silent: true });
    }, [activeSchedule.id]);

    useEffect(() => {
        const listener = new MessageListener<CalendarTabMessages>({
            async openCoursePopup({ data, sendResponse }) {
                const course = activeScheduleRef.current.courses.find(course => course.uniqueId === data.uniqueId);
                if (course === undefined) return;

                setCourse(course);
                setIsPopupOpen(true);

                const currentTab = await chrome.tabs.getCurrent();
                if (currentTab === undefined) return;
                sendResponse(currentTab);
            },
        });

        listener.listen();

        return () => listener.unlisten();
    }, []);

    const openCourse = (course: Course) => {
        setCourse(course);
        setIsPopupOpen(true);
    };

    // --- Reset drag state when dragging leaves the window ---
    // TODO - Refactor this and FileUpload.tsx, they use similar things and it would be optimal later on to maybe extract this all somewhere
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

    return (
        <CalendarContext.Provider value>
            <div className='relative h-full w-full flex flex-col'>
                <a
                    href='#calendar-content'
                    className='sr-only focus:not-sr-only focus:absolute focus:z-100 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-ut-burntorange focus:shadow-lg'
                >
                    Skip to calendar
                </a>
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

                {/** biome-ignore lint/a11y/noStaticElementInteractions: TODO: */}
                <div
                    className='screenshot:calendar-target h-screen flex overflow-auto'
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CalendarSidebar />

                    <div
                        id='calendar-content'
                        style={
                            {
                                // scrollbarGutter: 'stable',
                            }
                        }
                        className='z-1 h-full flex flex-grow flex-col overflow-x-scroll [&>*]:px-spacing-5'
                    >
                        <CalendarHeader sidebarOpen={showSidebar} onSidebarToggle={toggleSidebar} />
                        <div
                            className={clsx('min-h-2xl min-w-5xl flex-grow gap-0 pl-spacing-3 screenshot:min-h-xl', {
                                'screenshot:flex-grow-0': displayBottomBar, // html-to-image seems to have a bug with flex-grow
                            })}
                        >
                            <CalendarGrid
                                courseCells={courseCells}
                                setCourse={openCourse}
                                startMinutes={startMinutes}
                                endMinutes={endMinutes}
                            />
                        </div>
                        <CalendarBottomBar courseCells={courseCells} setCourse={openCourse} />
                    </div>
                </div>

                {course && (
                    <CourseCatalogInjectedPopup
                        course={course}
                        onClose={() => setIsPopupOpen(false)}
                        open={isPopupOpen}
                        afterLeave={() => setCourse(null)}
                    />
                )}
            </div>
        </CalendarContext.Provider>
    );
}
