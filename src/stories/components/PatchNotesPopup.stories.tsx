import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import PatchNotesPopup from '@views/components/common/PatchNotesPopup';
import Text from '@views/components/common/Text/Text';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

import MaterialSymbolsClose from '~icons/material-symbols/close';

const meta = {
    title: 'Components/Common/PatchNotesPopup',
    component: PatchNotesPopup,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof PatchNotesPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => (
        <DialogProvider>
            <InnerComponent />
        </DialogProvider>
    ),
};

const InnerComponent = () => {
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
            description: <PatchNotesPopup />,
        }));
    };

    return (
        <Button variant='filled' color='ut-burntorange' onClick={handleOnClick}>
            Open Patch Notes Popup
        </Button>
    );
};
