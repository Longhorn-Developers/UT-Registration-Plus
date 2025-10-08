import { UT_DINING_APP_STORE_URL } from '@shared/util/appUrls';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import WhatsNewPopupContent from '@views/components/common/WhatsNewPopup';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

// import useChangelog from './useChangelog';

const LDIconURL = new URL('/src/assets/LD-icon-new.png', import.meta.url).href;

/**
 * Custom hook that provides a function to display a what's new dialog.
 *
 * @returns A function that, when called, shows a dialog with the changelog.
 */
export default function useWhatsNewPopUp(): () => void {
    const showDialog = useDialog();
    // const showChangeLog = useChangelog();
    // const { version } = chrome.runtime.getManifest();

    const showPopUp = () => {
        showDialog(close => ({
            className: 'w-[830px] flex flex-col items-center gap-spacing-7 p-spacing-8',
            title: (
                <div className='flex items-center justify-between gap-4'>
                    <img src={LDIconURL} alt='LD Icon' className='h-12 w-12 rounded-lg' />
                    <Text variant='h1' className='text-theme-black'>
                        Download our new UT Dining app!
                    </Text>
                </div>
            ),
            description: <WhatsNewPopupContent />,
            buttons: (
                <div className='flex flex-row items-end gap-spacing-4'>
                    <Button
                        onClick={() => {
                            window.open(UT_DINING_APP_STORE_URL, '_blank');
                        }}
                        variant='minimal'
                        color='ut-black'
                    >
                        Download UT Dining on iOS
                    </Button>
                    <Button onClick={close} color='ut-burntorange'>
                        Close
                    </Button>
                </div>
            ),
        }));
    };

    return showPopUp;
}
