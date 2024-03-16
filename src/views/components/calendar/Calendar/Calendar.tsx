import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalenderHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules/CalendarSchedules';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import Divider from '@views/components/common/Divider/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import { MessageListener } from 'chrome-extension-toolkit';
import React, { useEffect, useRef, useState } from 'react';

import styles from './Calendar.module.scss';
/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */
export default function Calendar(): JSX.Element {
    const calendarRef = useRef<HTMLDivElement>(null);
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();
    const [course, setCourse] = useState<Course | null>((): Course | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const uniqueIdRaw = urlParams.get('uniqueId');
        if (uniqueIdRaw === null) return null;
        const uniqueId = Number(uniqueIdRaw);
        const course = activeSchedule.courses.find(course => course.uniqueId === uniqueId);
        if (course === undefined) return null;
        urlParams.delete('uniqueId');
        const newUrl = `${window.location.pathname}?${urlParams}`.replace(/\?$/, '');
        window.history.replaceState({}, '', newUrl);
        return course;
    });

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const [sidebarWidth, setSidebarWidth] = useState('20%');
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const listener = new MessageListener<CalendarTabMessages>({
            async openCoursePopup({ data, sendResponse }) {
                const course = activeSchedule.courses.find(course => course.uniqueId === data.uniqueId);
                if (course === undefined) return;
                setCourse(course);
                setShowPopup(true);
                sendResponse(await chrome.tabs.getCurrent());
            },
        });

        listener.listen();

        return () => listener.unlisten();
    }, [activeSchedule.courses]);

    useEffect(() => {
        const adjustLayout = () => {
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            const desiredCalendarHeight = 760;
            const minSidebarWidthPixels = 230;

            const scale = Math.min(1, windowHeight / desiredCalendarHeight);

            const sidebarWidthPixels = Math.max(
                windowWidth * scale - windowWidth + minSidebarWidthPixels,
                minSidebarWidthPixels
            );
            const newSidebarWidth = `${(sidebarWidthPixels / windowWidth) * 100}%`;

            setScale(scale);
            setSidebarWidth(newSidebarWidth);
        };

        adjustLayout();

        window.addEventListener('resize', adjustLayout);
        return () => window.removeEventListener('resize', adjustLayout);
    }, []);

    useEffect(() => {
        if (course) setShowPopup(true);
    }, [course]);

    const calendarContainerStyle = {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        marginTop: '-20px',
    };

    return (
        <div className='h-screen flex flex-col' style={{ width: 'calc(100% - 1rem)' }}>
            <div className='pl-5'>
                <CalendarHeader />
            </div>
            <div className={`flex flex-grow flex-row overflow-hidden pl-4 ${styles.scrollableSchedules}`}>
                <div className='sidebar-style' style={{ width: sidebarWidth, padding: '10px 15px 5px 5px' }}>
                    <div className={`mb-4 ${styles.scrollableLimit}`}>
                        <CalendarSchedules />
                    </div>
                    <Divider orientation='horizontal' size='100%' />
                    <div className='mt-4'>
                        <ImportantLinks />
                    </div>
                </div>
                <div className='flex flex-grow flex-col' style={calendarContainerStyle} ref={calendarRef}>
                    <div className='flex-grow overflow-auto'>
                        <CalendarGrid courseCells={courseCells} setCourse={setCourse} />
                    </div>
                    <CalendarBottomBar calendarRef={calendarRef} />
                </div>
            </div>

            <CourseCatalogInjectedPopup
                course={course}
                onClose={() => setShowPopup(false)}
                open={showPopup}
                afterLeave={() => setCourse(null)}
            />
        </div>
    );
}
