import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Settings from '@views/components/settings/Settings';
import React from 'react';

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
                <Settings />
            </DialogProvider>
        </ExtensionRoot>
    );
}
