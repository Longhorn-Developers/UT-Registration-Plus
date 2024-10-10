import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { background } from 'src/shared/messages';
import useSchedules from 'src/views/hooks/useSchedules';

const { openNewTab, addCourse, removeCourse, openCESPage } = background;

/**
 * @todo Inject the button into page https://my.utexas.edu/student/student/index
 * @todo figure out how to get ActiveSchedule in here
 */

/**
 *
 * @returns Button
 */
export default function InjectedButton(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [activeSchedule, _] = useSchedules();

    const extractCoursesFromCalendar = () => {
        const calendarElement = document.querySelector('#kgoui_Rcontent_I3_Rprimary_I1_Rcontent_I1_Rcontent_I0_Ritems');

        if (!calendarElement) {
            console.error('Calendar element not found');
            return [];
        }

        const anchorTags = calendarElement.querySelectorAll('a');
        const courses = Array.from(anchorTags).map(x => x.innerText.trim());
        handleAddingCourses(courses);
    };

    const handleAddingCourses = (courses: Array<string>) => {
        Array.from(courses).map(x => addCourse({ x, scheduleId: activeSchedule.id }));
    };

    useEffect(() => {
        const targetElement = document.getElementById('kgoui_Rcontent_I3_Rsecondary');

        if (targetElement) {
            const buttonContainer = document.createElement('div');
            targetElement.appendChild(buttonContainer);
            setContainer(buttonContainer);

            return () => {
                buttonContainer.remove();
            };
        }
    }, []);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <ExtensionRoot>
            <Button variant='filled' color='ut-burntorange' onClick={extractCoursesFromCalendar}>
                Add Courses to Schedule
            </Button>
        </ExtensionRoot>,
        container
    );
}
