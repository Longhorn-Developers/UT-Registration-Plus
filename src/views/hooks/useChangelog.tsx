import { X } from '@phosphor-icons/react';
import ChangelogPopup from '@views/components/common/ChangelogPopup';
import Text from '@views/components/common/Text/Text';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

import { Button } from '../components/common/Button';

/**
 * Custom hook that provides a function to display a changelog dialog.
 *
 * @returns A function that, when called, shows a dialog with the changelog.
 */
export default function useChangelog(): () => void {
    const showDialog = useDialog();

    const handleOnClick = () => {
        showDialog(close => ({
            title: (
                <div className='sticky top-0 flex items-center justify-between bg-white p-4'>
                    <Text variant='h1' className='text-theme-black'>
                        Changelog
                    </Text>
                    <Button variant='minimal' onClick={close} color='theme-black' className='p-1 text-gray-700'>
                        <X className='h-6 w-6' />
                    </Button>
                </div>
            ),
            description: <ChangelogPopup />,
        }));
    };

    return handleOnClick;
}
