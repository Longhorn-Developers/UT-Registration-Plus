import { DevStore } from '@shared/storage/DevStore';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Settings from '@views/components/settings/Settings';
import { Suspense } from 'react';
import { suspendUntilStoresReady } from 'src/lib/chrome-extension-toolkit/storage/createStore';

/**
 * Renders the settings page for the UTRP (UT Registration Plus) extension.
 * Allows customization options and displays credits for the development team.
 *
 * @returns The JSX element representing the settings page.
 */
export default function SettingsPage() {
    return (
        <ExtensionRoot>
            <DialogProvider>
                <Suspense fallback={null}>
                    <SettingsBootstrap />
                </Suspense>
            </DialogProvider>
        </ExtensionRoot>
    );
}

function SettingsBootstrap() {
    suspendUntilStoresReady([UserScheduleStore, OptionsStore, DevStore]);

    return <Settings />;
}
