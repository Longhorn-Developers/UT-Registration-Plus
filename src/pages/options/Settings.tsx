import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Settings from '@views/components/settings/Settings';
import SentryProvider from '@views/contexts/SentryContext';
import useKC_DABR_WASM from 'kc-dabr-wasm';
import React from 'react';

/**
 * Renders the settings page for the UTRP (UT Registration Plus) extension.
 * Allows customization options and displays credits for the development team.
 *
 * @returns The JSX element representing the settings page.
 */
export default function SettingsPage() {
    useKC_DABR_WASM();
    return (
        <SentryProvider fullInit>
            <ExtensionRoot>
                <DialogProvider>
                    <Settings />
                </DialogProvider>
            </ExtensionRoot>
        </SentryProvider>
    );
}
