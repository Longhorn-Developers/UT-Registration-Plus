import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { background } from '@shared/messages';
import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import useSchedules from '@views/hooks/useSchedules';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * InjectedButton component renders a button that adds courses to UTRP from official MyUT calendar
 * and adds the courses to the active schedule.
 *
 * @returns The rendered button component or null if the container is not found.
 */
export default function InjectedButton(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [activeSchedule, _] = useSchedules();

    const extractCoursesFromCalendar = async () => {
        const calendarElement = document.querySelector('#kgoui_Rcontent_I3_Rprimary_I1_Rcontent_I1_Rcontent_I0_Ritems');

        if (!calendarElement) {
            console.error('Calendar element not found');
            return [];
        }

        const anchorTags = Array.from(calendarElement.querySelectorAll('a')).filter(
            anchor => !anchor.href.includes('google.com')
        );

        // Make sure to remove duplicate anchorTags using set
        const uniqueAnchorTags = Array.from(new Set(anchorTags.map(a => a.href)));

        // Make sure user is logged in
        const loggedInToUT = await background.validateLoginStatus({
            url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/',
        });

        if (loggedInToUT) {
            for (const a of uniqueAnchorTags) {
                // eslint-disable-next-line no-await-in-loop
                await addCourseByURL(activeSchedule, a);
            }
        } else {
            // We'll allow the alert for this WIP feature
            // eslint-disable-next-line no-alert
            window.alert('Logged into UT Registrar.');
        }
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
