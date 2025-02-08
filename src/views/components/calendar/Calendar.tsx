import { Sidebar } from '@phosphor-icons/react';
import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import { CRX_PAGES } from '@shared/types/CRXPages';
import { openReportWindow } from '@shared/util/openReportWindow';
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
import { MessageListener } from 'chrome-extension-toolkit';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';

import { Button } from '../common/Button';
import { LargeLogo } from '../common/LogoIcon';
import Text from '../common/Text/Text';
import CalendarFooter from './CalendarFooter';

/**
 * Calendar page component
 */
export default function Calendar(): JSX.Element {
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();

    const [course, setCourse] = useState<Course | null>(useCourseFromUrl());

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);

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

    return (
        <CalendarContext.Provider value>
            <div className='h-full w-full flex flex-col'>
                <div className='h-screen flex overflow-auto'>
                    <div
                        className={clsx(
                            'py-spacing-6 relative h-full min-h-screen w-full flex flex-none flex-col justify-between overflow-clip whitespace-nowrap border-r border-theme-offwhite/50 shadow-[2px_0_10px,rgba(214_210_196_/_.1)] motion-safe:duration-300 motion-safe:ease-out-expo motion-safe:transition-[max-width] screenshot:hidden',
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
                                color='theme-black'
                                onClick={() => {
                                    setShowSidebar(!showSidebar);
                                }}
                                className='h-fit screenshot:hidden !p-0'
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
                            <Divider orientation='horizontal' size='100%' />
                            {/* <TeamLinks /> */}
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
                        </div>

                        <CalendarFooter />
                    </div>

                    <div
                        style={
                            {
                                // scrollbarGutter: 'stable',
                            }
                        }
                        className='h-full flex flex-grow flex-col overflow-x-scroll px-spacing-5'
                    >
                        <CalendarHeader
                            sidebarOpen={showSidebar}
                            onSidebarToggle={() => {
                                setShowSidebar(!showSidebar);
                            }}
                        />
                        <div className='min-h-2xl min-w-5xl flex-grow overflow-auto pl-spacing-3 pt-spacing-3 screenshot:min-h-xl'>
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
