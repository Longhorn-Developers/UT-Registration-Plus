import ChangelogPopup from '@views/components/common/ChangelogPopup';
import Text from '@views/components/common/Text/Text';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

import MaterialSymbolsClose from '~icons/material-symbols/close';

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
                <div className='flex items-center justify-between p-4'>
                    <Text variant='h1' className='text-theme-black'>
                        Changelog
                    </Text>
                    <button
                        onClick={close}
                        className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    >
                        <MaterialSymbolsClose className='text-2xl' />
                    </button>
                </div>
            ),
            description: <ChangelogPopup />,
        }));
    };

    return handleOnClick;
}
