import { ExtensionStore } from '@shared/storage/ExtensionStore';
import useWhatsNewPopUp from '@views/hooks/useWhatsNew';
import { useEffect } from 'react';

import { ACTIVE_WHATSNEW_POPUP_VERSION_KEY, WHATSNEW_POPUP_VERSION } from './WhatsNewPopupContent';

/**
 * WhatsNewDialog component.
 *
 * This component is responsible for checking if the extension has already been updated
 * and if so, it displays the WhatsNew dialog. Then it updates the state to show that the
 * dialog has been shown.
 *
 * @returns null.
 *
 * @remarks
 * The component uses the `useWhatsNew` hook to show the WhatsNew dialog and the
 * `useEffect` hook to perform the check on component mount. It also uses the `ExtensionStore`
 * to view the state of the dialog.
 */
export function WhatsNewDialog(): null {
    const showPopUp = useWhatsNewPopUp();

    // biome-ignore lint/correctness/useExhaustiveDependencies: This is on purpose
    useEffect(() => {
        const checkUpdate = async () => {
            const [version, sessionStorage] = await Promise.all([
                ExtensionStore.get('lastWhatsNewPopupVersion'),
                chrome.storage.session.get(ACTIVE_WHATSNEW_POPUP_VERSION_KEY),
            ]);
            const activeVersion = sessionStorage[ACTIVE_WHATSNEW_POPUP_VERSION_KEY];
            if (version !== WHATSNEW_POPUP_VERSION && activeVersion !== WHATSNEW_POPUP_VERSION) {
                await chrome.storage.session.set({
                    [ACTIVE_WHATSNEW_POPUP_VERSION_KEY]: WHATSNEW_POPUP_VERSION,
                });
                showPopUp({
                    onClose: async () => {
                        await Promise.all([
                            ExtensionStore.set('lastWhatsNewPopupVersion', WHATSNEW_POPUP_VERSION),
                            chrome.storage.session.remove(ACTIVE_WHATSNEW_POPUP_VERSION_KEY),
                        ]);
                    },
                });
            }
        };

        void checkUpdate();

        // This is on purpose
    }, []);

    return null;
}
