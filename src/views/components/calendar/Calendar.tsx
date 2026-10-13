import { MessageListener } from '@chrome-extension-toolkit';
import importSchedule from '@pages/background/lib/importSchedule';
import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import ResourceLinks from '@views/components/calendar/ResourceLinks';
import CourseFinderPanel from '@views/components/common/CourseFinder/CourseFinderPanel';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarContext } from '@views/contexts/CalendarContext';
import {
    useCalendarSidebar,
    useCourseFinderControls,
    useCourseFinderPreview,
    useCourseFinderState,
    useSetCourseFinderPreview,
} from '@views/contexts/CourseFinderContext';
import useCourseFromUrl from '@views/hooks/useCourseFromUrl';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import useReportIssueDialog from '@views/hooks/useReportIssueDialog';
import refreshCourses from '@views/lib/refreshCourses';
import clsx from 'clsx';
import type React from 'react';
import type { ReactNode } from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';
import MagnifyingGlassIcon from '~icons/ph/magnifying-glass';
import SidebarIcon from '~icons/ph/sidebar';

import { Button } from '../common/Button';
import { LargeLogo } from '../common/LogoIcon';
import Text from '../common/Text/Text';
import CalendarFooter from './CalendarFooter';

/**
 * The Course Finder in the sidebar. It reads the Course Finder's state itself, so the rest of the sidebar doesn't
 * re-render with every keystroke and page of results.
 */
function SidebarCourseFinder() {
    const controls = useCourseFinderControls();
    const state = useCourseFinderState();
    const setPreviewCourse = useSetCourseFinderPreview();
    if (!controls || !state) return null;

    return (
        <CourseFinderPanel
            finder={state.finder}
            form={state.form}
            onClose={controls.close}
            inputRef={controls.searchInputRef}
            onPreviewChange={setPreviewCourse ?? undefined}
        />
    );
}

const CalendarSidebar = memo(function CalendarSidebar() {
    const { isSidebarShown: showSidebar, toggleSidebar } = useCalendarSidebar();
    const showReportIssueDialog = useReportIssueDialog();
    const courseFinder = useCourseFinderControls();
    const isCourseFinderOpen = courseFinder?.isOpen ?? false;
    const sidebarRef = useRef<HTMLDivElement>(null);
    const findCourseButtonRef = useRef<HTMLButtonElement>(null);

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

            {/* Looks like the search it opens, styled like the Input component. Outside the scrolling part of the
                sidebar, so it's always in reach. Hidden rather than removed while the Course Finder is open, so focus
                can go back to it afterwards. */}
            {courseFinder && (
                <div className={clsx('px-spacing-7 mt-spacing-5 mb-spacing-4', { hidden: isCourseFinderOpen })}>
                    <button
                        ref={findCourseButtonRef}
                        type='button'
                        className='h-9 w-full flex items-center gap-spacing-4 border border-ut-offwhite/50 border-rounded bg-transparent px-spacing-3 text-ut-black/80 btn-transition hover:border-ut-black/30 focusable'
                        onClick={() => courseFinder.open(findCourseButtonRef.current)}
                    >
                        <MagnifyingGlassIcon className='h-5 w-5 text-ut-black/50' />
                        <Text variant='p'>Find a course</Text>
                    </button>
                </div>
            )}

            {/* Keyed, so each view starts scrolled to the top. The scroll padding keeps what's focused out from under the sticky titles. */}
            <div
                key={isCourseFinderOpen ? 'course-finder' : 'schedules'}
                style={{
                    scrollbarGutter: 'stable',
                }}
                className='relative h-full w-full flex flex-grow flex-col gap-y-spacing-6 overflow-x-clip overflow-y-auto scroll-pt-10 pb-spacing-6 pl-spacing-7 pr-2.75'
            >
                {/* The Course Finder takes the schedules' place in the sidebar while it's open */}
                {isCourseFinderOpen ? (
                    <SidebarCourseFinder />
                ) : (
                    <>
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
                    </>
                )}
            </div>

            <CalendarFooter />
        </div>
    );
});

/**
 * Calendar page component
 */
export default function Calendar(): ReactNode {
    // The section hovered over in the Course Finder, drawn over the schedule. The calendar's hours stay stretched to fit
    // the sections previewed while the Course Finder is open.
    const previewCourse = useCourseFinderPreview();
    const isCourseFinderOpen = useCourseFinderControls()?.isOpen ?? false;
    const { courseCells, previewCells, activeSchedule, startMinutes, endMinutes } = useFlattenedCourseSchedule(
        previewCourse,
        isCourseFinderOpen
    );
    const initialCourse = useCourseFromUrl();
    const [course, setCourse] = useState<Course | null>(initialCourse);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(initialCourse !== null);
    const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
    const [isValidFileType, setIsValidFileType] = useState<boolean>(false);
    const { isSidebarShown: showSidebar, toggleSidebar } = useCalendarSidebar();

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

    const bottomBar = <CalendarBottomBar courseCells={courseCells} setCourse={openCourse} />;

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
                                'screenshot:flex-grow-0': bottomBar !== null, // html-to-image seems to have a bug with flex-grow
                            })}
                        >
                            <CalendarGrid
                                courseCells={courseCells}
                                previewCells={previewCells}
                                setCourse={openCourse}
                                startMinutes={startMinutes}
                                endMinutes={endMinutes}
                            />
                        </div>
                        {bottomBar}
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
