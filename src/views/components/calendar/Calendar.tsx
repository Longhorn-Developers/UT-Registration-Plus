import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import { CRX_PAGES } from '@shared/types/CRXPages';
import { openReportWindow } from '@shared/util/openReportWindow';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader';
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
import MenuIcon from '~icons/material-symbols/menu';

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
                            'gap-y-spacing6 py-spacing5 relative h-full min-h-screen w-full flex flex-none flex-col justify-between overflow-clip whitespace-nowrap border-r border-ut-offwhite/75 shadow-[2px_0_10px,rgba(214_210_196_/_.1)] duration-300 ease-out-expo transition-property-max-width screenshot:hidden',
                            {
                                'max-w-[20.3125rem] ': showSidebar,
                                'max-w-0 pointer-events-none': !showSidebar,
                            }
                        )}
                        tabIndex={showSidebar ? 0 : -1}
                        aria-hidden={!showSidebar}
                        {...{ inert: !showSidebar ? '' : undefined }}
                    >
                        <div className='px-spacing7 sticky top-0 z-50 w-full flex items-center justify-between gap-x-3xl bg-white'>
                            <LargeLogo />
                            <Button
                                variant='single'
                                color='theme-black'
                                onClick={() => {
                                    setShowSidebar(!showSidebar);
                                }}
                                className='h-fit screenshot:hidden !p-0'
                                icon={MenuIcon}
                            />
                        </div>

                        <div className='gap-y-spacing5 py-spacing5 px-spacing7 relative h-full w-full flex grow flex-col overflow-x-clip overflow-y-auto'>
                            <CalendarSchedules />
                            <Divider orientation='horizontal' size='100%' />
                            <ResourceLinks />
                            <Divider orientation='horizontal' size='100%' />
                            {/* <TeamLinks /> */}
                            <a
                                href={CRX_PAGES.REPORT}
                                className='gap-spacing1 flex items-center text-ut-burntorange underline-offset-2 hover:underline'
                                target='_blank'
                                rel='noreferrer'
                                onClick={event => {
                                    event.preventDefault();
                                    openReportWindow();
                                }}
                            >
                                <Text variant='p'>Send us Feedback!</Text>
                                <OutwardArrowIcon className='h-3 w-3' />
                            </a>
                        </div>

                        <CalendarFooter />
                    </div>

                    <div className='h-full min-w-5xl flex flex-grow flex-col overflow-y-auto'>
                        <CalendarHeader
                            sidebarOpen={showSidebar}
                            onSidebarToggle={() => {
                                setShowSidebar(!showSidebar);
                            }}
                        />
                        <div className='min-h-2xl flex-grow overflow-auto pl-2 pr-4 pt-6 screenshot:min-h-xl'>
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
