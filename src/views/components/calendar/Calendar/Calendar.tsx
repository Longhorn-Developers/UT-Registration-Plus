import { CalendarBottomBar } from '@views/components/calendar/CalendarBottomBar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalenderHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules/CalendarSchedules';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { exampleCourse } from 'src/stories/components/PopupCourseBlock.stories';
import CalendarHeader from 'src/views/components/calendar/CalendarHeader/CalenderHeader';
import { useFlattenedCourseSchedule } from 'src/views/hooks/useFlattenedCourseSchedule';

import CourseCatalogInjectedPopup from '../../injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { CalendarBottomBar } from '../CalendarBottomBar/CalendarBottomBar';
import CalendarGrid from '../CalendarGrid/CalendarGrid';
import { CalendarSchedules } from '../CalendarSchedules/CalendarSchedules';
import ImportantLinks from '../ImportantLinks';

export const flags = ['WR', 'QR', 'GC', 'CD', 'E', 'II'];

interface Props {
    label: string;
}

/**
 * A reusable chip component that follows the design system of the extension.
 * @returns
 */
export function Calendar(): JSX.Element {
    const courseCells = useFlattenedCourseSchedule();
    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    return (
        <>
            <CalendarHeader />
            <div className='h-screen w-full flex flex-col md:flex-row'>
                <div className='min-h-[30%] flex flex-col items-start gap-2.5 p-5 pl-7'>
                    <div className='min-h-[30%]'>
                        <CalendarSchedules />
                    </div>
                    <ImportantLinks />
                </div>
                <div className='flex flex-grow flex-col gap-4 overflow-hidden'>
                    <div className='flex-grow overflow-auto'>
                        <CalendarGrid courseCells = {courseCells} setShowPopup={setShowPopup}/>
                    </div>
                    <div>
                        <CalendarBottomBar />
                    </div>
                </div>
            </div>
            {showPopup ? <CourseCatalogInjectedPopup course = {exampleCourse } onClose={() => setShowPopup(false)}/> : null}
        </>
    );
}
