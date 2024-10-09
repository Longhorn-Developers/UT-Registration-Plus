import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import PatchNotesPopup from '@views/components/common/PatchNotesPopup';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

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
    args: {
        isOpen: true,
        onClose: () => {},
    },
    render: () => (
        <DialogProvider>
            <InnerComponent />
        </DialogProvider>
    ),
};

const InnerComponent = () => {
    const showDialog = useDialog();

    const handleOnClick = () => {
        showDialog({
            description: <PatchNotesPopup />,
        });
    };

    return (
        <Button variant='filled' color='ut-burntorange' onClick={handleOnClick}>
            Open Patch Notes Popup
        </Button>
    );
};
