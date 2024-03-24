import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import { useDialog } from '@views/contexts/DialogContext';
import React from 'react';

import MaterialSymbolsExpandAllRoundedIcon from '~icons/material-symbols/expand-all-rounded';

const meta = {
    title: 'Components/Common/DialogProvider',
    component: DialogProvider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {},
    argTypes: {},
} satisfies Meta<typeof DialogProvider>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { children: undefined },
    render: () => (
        <DialogProvider>
            <InnerComponent />
        </DialogProvider>
    ),
};

const InnerComponent = () => {
    const showDialog = useDialog();

    const myShow = () => {
        showDialog({
            title: <h1>Dialog Title</h1>,
            description: <p>Dialog Description</p>,
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <Button variant='outline' color='ut-red' onClick={close}>
                    Close
                </Button>
            ),
        });
    };

    return (
        <Button variant='filled' color='ut-burntorange' icon={MaterialSymbolsExpandAllRoundedIcon} onClick={myShow}>
            Open Dialog
        </Button>
    );
};
