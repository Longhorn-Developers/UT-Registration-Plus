import { MessageListener } from '@chrome-extension-toolkit';
import { background } from '@shared/messages';
import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import Calendar from '@views/components/calendar/Calendar';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import { WhatsNewDialog } from '@views/components/common/WhatsNewPopup';
import { Suspense, useEffect } from 'react';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    useEffect(() => {
        const registerCalendarTab = () => {
            void background.registerCalendarTab();
        };

        registerCalendarTab();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                registerCalendarTab();
            }
        };

        window.addEventListener('focus', registerCalendarTab);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', registerCalendarTab);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

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
                <MigrationDialog />
                <WhatsNewDialog />
                <Suspense fallback={null}>
                    <CalendarBootstrap />
                </Suspense>
            </DialogProvider>
        </ExtensionRoot>
    );
}

function CalendarBootstrap() {
    suspendUntilStoresReady([UserScheduleStore, OptionsStore]);

    return <Calendar />;
}
