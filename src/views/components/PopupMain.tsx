import React from 'react';
import { bMessenger } from 'src/shared/messages';
import useSchedules from '../hooks/useSchedules';
import { Button } from './common/Button/Button';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';

const { clearCourses } = bMessenger;
export default function PopupMain() {
    const [activeSchedule, schedules] = useSchedules();

    // TODO: Add a button to to switch the active schedule

    return (
        <ExtensionRoot>
            <Button
                onClick={() => {
                    if (!activeSchedule) return;
                    clearCourses({ scheduleName: activeSchedule?.name });
                }}
            >
                Clear Courses
            </Button>
        </ExtensionRoot>
    );
}
