import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { ArrowsClockwise, Check } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import { Button } from '@views/components/common/Button';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { getScheduleById, switchSchedule } from '@views/hooks/useSchedules';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import createSchedule from 'src/pages/background/lib/createSchedule';

/**
 * InjectedButton component renders a button that adds courses to UTRP from official MyUT calendar
 * and adds the courses to the active schedule.
 *
 * @returns The rendered button component or null if the container is not found.
 */
export default function InjectedButton(): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'complete'>('idle');

    const extractCoursesFromCalendar = async () => {
        setImportStatus('loading');

        const tableElements = document.querySelectorAll('table');
        const calendarElement = Array.from(tableElements).find(el => el.textContent?.includes('12PM'));

        if (!calendarElement) {
            console.error('Calendar element not found');
            setImportStatus('idle');
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

        try {
            if (loggedInToUT) {
                const scheduleId = await createSchedule('Imported Schedule');
                switchSchedule(scheduleId);
                const newSchedule = await getScheduleById(scheduleId);
                if (!newSchedule) {
                    throw new Error('Failed to retrieve new schedule');
                }

                for (const a of uniqueAnchorTags) {
                    await addCourseByURL(newSchedule, a);
                }

                setImportStatus('complete');
                return;
            }

            // We'll allow the alert for this WIP feature
            window.alert('Logged into UT Registrar.');
        } catch (error) {
            console.error('Failed to import courses from calendar', error);
        }

        setImportStatus('idle');
    };

    const buttonText =
        importStatus === 'loading'
            ? 'Importing...'
            : importStatus === 'complete'
              ? 'Imported!'
              : 'Add Courses to UT Registration+';

    const buttonIcon = importStatus === 'loading' ? ArrowsClockwise : importStatus === 'complete' ? Check : undefined;

    const buttonIconProps =
        importStatus === 'loading'
            ? {
                  className: 'animate-spin animate-duration-800',
              }
            : undefined;

    useEffect(() => {
        const targetElements = document.querySelectorAll(
            'div.kgoui_object_region.kgoui_container_responsive_asymmetric2_column_secondary'
        );
        const targetElement = Array.from(targetElements).find(el => el.textContent?.includes('My Information'));

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
            <Button
                variant='filled'
                color='ut-burntorange'
                className='flex!'
                onClick={extractCoursesFromCalendar}
                disabled={importStatus !== 'idle'}
                icon={buttonIcon}
                iconProps={buttonIconProps}
            >
                {buttonText}
            </Button>
        </ExtensionRoot>,
        container
    );
}
