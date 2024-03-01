import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';
import { Calendar } from 'src/views/components/calendar/Calendar/Calendar';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    return (
        <ExtensionRoot>
            <Calendar />
        </ExtensionRoot>
    );
}
