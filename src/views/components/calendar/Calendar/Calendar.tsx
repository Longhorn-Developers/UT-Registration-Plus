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

/**
 * A component combining the various calendar subcomponents into one main calendar component displaying the student's schedule-related information and more
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
        if (course) setShowPopup(true);
    }, [course]);

    return (
        <div className='h-full w-full flex flex-col'>
            <CalendarHeader />
            <div className='h-full flex flex-grow overflow-hidden pl-7.5'>
                <div className='overflow-auto py-5'>
                    <CalendarSchedules />
                    <Divider orientation='horizontal' size='100%' className='my-5' />
                    <ImportantLinks />
                </div>
                <div className='flex flex-grow flex-col' ref={calendarRef}>
                    <div className='flex-grow overflow-auto px-4 pt-6.5'>
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
