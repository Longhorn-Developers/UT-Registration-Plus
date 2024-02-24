import React from 'react';
import { Course } from 'src/shared/types/Course';
import { exampleCourse } from 'src/stories/components/PopupCourseBlock.stories';
import CalendarHeader from 'src/views/components/calendar/CalendarHeader/CalenderHeader';
import { useFlattenedCourseSchedule } from 'src/views/hooks/useFlattenedCourseSchedule';
import { UserSchedule } from 'src/shared/types/UserSchedule';
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
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();
    const [course, setCourse] = React.useState<Course | null>(null);

    return (
        <div className = 'flex flex-col'>
            <CalendarHeader totalHours={activeSchedule.hours} scheduleName={activeSchedule.name} totalCourses={activeSchedule?.courses.length}/>
            <div className='h-screen w-full flex flex-col md:flex-row'>
                <div className='min-h-[30%] flex flex-col items-start gap-2.5 p-5 pl-7'>
                    <div className='min-h-[30%]'>
                        <CalendarSchedules />
                    </div>
                    <ImportantLinks />
                </div>
                <div className='flex flex-grow flex-col gap-4 overflow-hidden pr-12'>
                    <div className='flex-grow overflow-auto'>
                        <CalendarGrid courseCells = {courseCells} setCourse={setCourse}/>
                    </div>
                    <div>
                        <CalendarBottomBar />
                    </div>
                </div>
            </div>
            {/* TODO: Doesn't work when exampleCourse is replaced with an actual course through setCourse. 
                Check CalendarGrid.tsx and AccountForCourseConflicts for an example */}
            {course ? <CourseCatalogInjectedPopup course = {exampleCourse} activeSchedule = {activeSchedule} onClose={() => setCourse(null)}/> : null}
        </div>
    );
}
