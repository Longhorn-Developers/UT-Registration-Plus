import { background } from '@shared/messages';
import React from 'react';

import useSchedules from '../hooks/useSchedules';
import { Button } from './common/Button/Button';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';

/**
 * Represents the main component of the popup.
 * This component displays a button to clear courses from the active schedule.
 */
export default function PopupMain() {
    const [activeSchedule, schedules] = useSchedules();

    // TODO: Add a button to to switch the active schedule

    return (
        <ExtensionRoot>
            <Button
                onClick={() => {
                    if (!activeSchedule) return;
                    background.clearCourses({ scheduleName: activeSchedule?.name });
                }}
            >
                Clear Courses
            </Button>
        </ExtensionRoot>
    );
}
