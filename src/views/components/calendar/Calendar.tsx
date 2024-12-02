import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarContext } from '@views/contexts/CalendarContext';
import useCourseFromUrl from '@views/hooks/useCourseFromUrl';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import useInitialWidth from '@views/hooks/useInitialWidth';
import { MessageListener } from 'chrome-extension-toolkit';
import React, { useEffect, useState } from 'react';

import CalendarFooter from './CalendarFooter';
import TeamLinks from './TeamLinks';

/**
 * Calendar page component
 */
export default function Calendar(): JSX.Element {
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();

    const [course, setCourse] = useState<Course | null>(useCourseFromUrl());

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);
    const { width, elementRef: sidebarRef } = useInitialWidth<HTMLDivElement>();

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

    const getSidebarWidth = () => {
        if (showSidebar) {
            return width > 0 ? width : 'auto';
        }

        return 0;
    };

    return (
        <CalendarContext.Provider value>
            <div className='h-full w-full flex flex-col'>
                <CalendarHeader
                    onSidebarToggle={() => {
                        setShowSidebar(!showSidebar);
                    }}
                />
                <div className='h-full flex overflow-auto pl-3'>
                    <div
                        ref={sidebarRef}
                        style={{ width: getSidebarWidth() }}
                        className='h-full flex flex-none flex-col justify-between whitespace-nowrap pb-5 transition-all duration-300 ease-out-expo screenshot:hidden'
                    >
                        <div
                            tabIndex={showSidebar ? 0 : -1}
                            className={`${showSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity ease-out-expo mb-3 h-full w-fit flex flex-col overflow-auto pb-2 pl-4.5 pr-4 pt-5`}
                        >
                            <CalendarSchedules />
                            <Divider orientation='horizontal' size='100%' className='my-5' />
                            <ImportantLinks />
                            <Divider orientation='horizontal' size='100%' className='my-5' />
                            <TeamLinks />
                        </div>

                        <CalendarFooter
                            socialIconClassNames={`${showSidebar ? 'translate-y-0 delay-50' : 'translate-y-6.75'} transition-transform ease-out-expo duration-500`}
                            sublineClassNames={`${showSidebar ? 'opacity-100 delay-75' : 'opacity-0'} duration-300 transition-opacity ease-out-expo`}
                        />
                    </div>
                    <div className='h-full min-w-5xl flex flex-grow flex-col overflow-y-auto'>
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
