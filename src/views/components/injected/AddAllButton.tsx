import addCourse from '@pages/background/lib/addCourse';
import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 *
 * @returns Button
 */
export default function InjectedButton(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const extractCoursesFromCalendar = () => {
        const calendarElement = document.querySelector('#kgoui_Rcontent_I3_Rprimary_I1_Rcontent_I1_Rcontent_I0_Ritems');

        if (!calendarElement) {
            console.error('Calendar element not found');
            return [];
        }

        const anchorTags = calendarElement.querySelectorAll('a');
        const courses = Array.from(anchorTags).map(x => x.innerText.trim());
    };

    const handleAddingCourses = (courses: Array<string>) => {
        Array.from(courses).map(x => addCourse(x, _));
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
            <Button variant='filled' color='ut-black'>
                Click Me
            </Button>
        </ExtensionRoot>,
        container
    );
}
