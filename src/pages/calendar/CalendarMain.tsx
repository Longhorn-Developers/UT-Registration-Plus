import Calendar from '@views/components/calendar/Calendar/Calendar';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import React from 'react';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    return (
        <ExtensionRoot className='h-full w-full'>
            <Calendar />
        </ExtensionRoot>
    );
}
