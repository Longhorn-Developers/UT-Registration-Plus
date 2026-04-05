import { MessageListener } from '@chrome-extension-toolkit';
import { background } from '@shared/messages';
import type TabInfoMessages from '@shared/messages/TabInfoMessages';
import { initSettings } from '@shared/storage/OptionsStore';
import Calendar from '@views/components/calendar/Calendar';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { MigrationDialog } from '@views/components/common/MigrationDialog';
import { WhatsNewDialog } from '@views/components/common/WhatsNewPopup';
import SentryProvider from '@views/contexts/SentryContext';
import { initSchedules } from '@views/hooks/useSchedules';
import { useEffect, useState } from 'react';

/**
 * Calendar page
 * @returns entire page
 */
export default function CalendarMain() {
    const [initialShowSidebar, setInitialShowSidebar] = useState<boolean | null>(null);

    useEffect(() => {
        let mounted = true;

        void Promise.all([initSchedules(), initSettings()]).then(([, settings]) => {
            if (!mounted) {
                return;
            }

            setInitialShowSidebar(settings.showCalendarSidebar);
        });

        return () => {
            mounted = false;
        };
    }, []);

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

    if (initialShowSidebar === null) {
        return null;
    }

    return (
        <SentryProvider fullInit>
            <ExtensionRoot className='h-full w-full'>
                <DialogProvider>
                    <MigrationDialog />
                    <WhatsNewDialog />
                    <Calendar initialShowSidebar={initialShowSidebar} />
                </DialogProvider>
            </ExtensionRoot>
        </SentryProvider>
    );
}
