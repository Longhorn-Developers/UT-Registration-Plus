import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import useSchedules from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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

        const anchorTags = Array.from(calendarElement.querySelectorAll('a')).filter(
            anchor => !anchor.href.includes('google.com')
        );

        // Make sure to remove duplicate anchorTags using set
        const uniqueAnchorTags = new Set(anchorTags.map(a => a.href));

        uniqueAnchorTags.forEach(a => {
            addCourseByURL(activeSchedule, a);
        });

        // const courses = Array.from(anchorTags).map(x => x.innerText.trim());
        // const courseIds = Array.from(anchorTags).map(({ href }) => {
        //     const segments = href.split('/').filter(Boolean); // Remove empty segments caused by trailing slashes
        //     return segments.pop();
        // }) as string[];

        // const { uniqueCourseIds, uniqueCourses } = removeDuplicates(courseIds, courses);

        // // print all the href of anchor tags
        // console.log(Array.from(anchorTags).map(x => x.href));
        // handleAddingCourses(uniqueCourses, uniqueCourseIds);
    };

    useEffect(() => {
        const targetElement = document.getElementById('kgoui_Rcontent_I3_Rsecondary');

        if (
            targetElement &&
            targetElement.classList.contains('kgoui_container_responsive_asymmetric2_column_secondary')
        ) {
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
                Add Courses to UT Registration+
            </Button>
        </ExtensionRoot>,
        container
    );
}
