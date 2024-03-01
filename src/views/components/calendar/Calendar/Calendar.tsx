import type { Course } from '@shared/types/Course';
import { CalendarBottomBar } from '@views/components/calendar/CalendarBottomBar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid/CalendarGrid';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalenderHeader';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules/CalendarSchedules';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import React from 'react';
import { ExampleCourse } from 'src/stories/components/PopupCourseBlock.stories';

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
        <div className='flex flex-col'>
            <CalendarHeader
                totalHours={activeSchedule.hours}
                scheduleName={activeSchedule.name}
                totalCourses={activeSchedule?.courses.length}
            />
            <div className='h-screen w-full flex flex-col md:flex-row'>
                <div className='min-h-[30%] flex flex-col items-start gap-2.5 p-5 pl-7'>
                    <div className='min-h-[30%]'>
                        <CalendarSchedules />
                    </div>
                    <ImportantLinks />
                </div>
                <div className='flex flex-grow flex-col gap-4 overflow-hidden pr-12'>
                    <div className='flex-grow overflow-auto'>
                        <CalendarGrid courseCells={courseCells} setCourse={setCourse} />
                    </div>
                    <div>
                        <CalendarBottomBar />
                    </div>
                </div>
            </div>
            {/* TODO: Doesn't work when exampleCourse is replaced with an actual course through setCourse. 
                Check CalendarGrid.tsx and AccountForCourseConflicts for an example */}
            {course ? (
                <CourseCatalogInjectedPopup
                    course={ExampleCourse}
                    activeSchedule={activeSchedule}
                    onClose={() => setCourse(null)}
                />
            ) : null}
        </div>
    );
}
