import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import WhatsNewPopup from '@views/components/common/WhatsNewPopup';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

import { LogoIcon } from '../components/common/LogoIcon';
import useChangelog from './useChangelog';
import useVersion from './useVersion';

/**
 * Custom hook that provides a function to display a what's new dialog.
 *
 * @returns A function that, when called, shows a dialog with the changelog.
 */
export default function useWhatsNew(): () => void {
    const showDialog = useDialog();
    const showChangeLog = useChangelog();
    const version = useVersion() || 'v2.1.0';

    const handleOnClick = () => {
        showDialog(close => ({
            className: 'w-[830px] flex flex-col items-center gap-spacing-7 p-spacing-8',
            title: (
                <div className='flex items-center justify-between gap-4'>
                    <LogoIcon width='48' height='48' />
                    <Text variant='h1' className='text-theme-black'>
                        What&apos;s New in UT Registration Plus
                    </Text>
                </div>
            ),
            description: <WhatsNewPopup />,
            buttons: (
                <>
                    <Button onClick={showChangeLog} variant='minimal' color='ut-black'>
                        Read Changelog {version}
                    </Button>
                    <Button onClick={close} color='ut-burntorange'>
                        Get started
                    </Button>
                </>
            ),
        }));
    };

    return handleOnClick;
}
