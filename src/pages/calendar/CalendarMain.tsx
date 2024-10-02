import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import Calendar from '@views/components/calendar/Calendar';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MessageListener } from 'chrome-extension-toolkit';
import React, { useEffect } from 'react';
import DialogProvider from 'src/views/components/common/DialogProvider/DialogProvider';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    useEffect(() => {
        const tabInfoListener = new MessageListener<TabInfoMessages>({
            getTabInfo: ({ sendResponse }) => {
                sendResponse({
                    url: window.location.href,
                    title: document.title,
                });
            },
        });

        tabInfoListener.listen();

        return () => tabInfoListener.unlisten();
    }, []);

    return (
        <ExtensionRoot className='h-full w-full'>
            <DialogProvider>
                <Calendar />
            </DialogProvider>
        </ExtensionRoot>
    );
}
