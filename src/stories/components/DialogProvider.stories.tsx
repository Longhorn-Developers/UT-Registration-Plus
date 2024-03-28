import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import Text from '@views/components/common/Text/Text';
import { useDialog } from '@views/contexts/DialogContext';
import React, { useState } from 'react';

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

export const FiveDialogs: Story = {
    args: { children: undefined },
    render: () => (
        <DialogProvider>
            <Text variant='p'>They&apos;ll open with 100ms delay</Text>
            <FiveDialogsInnerComponent />
        </DialogProvider>
    ),
};

const FiveDialogsInnerComponent = () => {
    const showDialog = useDialog();

    const myShow = () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(
                () =>
                    showDialog({
                        title: <h1>Dialog #{i}</h1>,
                        description: <p>Dialog Description</p>,
                        // eslint-disable-next-line react/no-unstable-nested-components
                        buttons: close => (
                            <Button variant='outline' color='ut-red' onClick={close}>
                                Close
                            </Button>
                        ),
                    }),
                100 * i
            );
        }
    };

    return (
        <Button variant='filled' color='ut-burntorange' icon={MaterialSymbolsExpandAllRoundedIcon} onClick={myShow}>
            Open Dialogs
        </Button>
    );
};

export const NestedDialogs: Story = {
    args: { children: undefined },
    render: () => (
        <DialogProvider>
            <NestedDialogsInnerComponent />
        </DialogProvider>
    ),
};

const NestedDialogsInnerComponent = () => {
    const showDialog = useDialog();

    const myShow = () => {
        showDialog({
            title: <h1>Dialog Title</h1>,
            description: <p>Dialog Description</p>,
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <>
                    <NestedDialogsInnerComponent />
                    <Button variant='outline' color='ut-red' onClick={close}>
                        Close
                    </Button>
                </>
            ),
            showFocus: true,
        });
    };

    return (
        <Button variant='filled' color='ut-burntorange' icon={MaterialSymbolsExpandAllRoundedIcon} onClick={myShow}>
            Open Next Dialog
        </Button>
    );
};

export const DialogWithOnClose: Story = {
    args: { children: undefined },
    render: () => (
        <DialogProvider>
            <DialogWithOnCloseInnerComponent />
        </DialogProvider>
    ),
};

const DialogWithOnCloseInnerComponent = () => {
    const showDialog = useDialog();
    const [timesClosed, setTimesClosed] = useState(0);

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
            onClose: () => {
                setTimesClosed(prev => prev + 1);
            },
        });
    };

    return (
        <>
            <h1>
                You closed the button below {timesClosed} {timesClosed === 1 ? 'time' : 'times'}
            </h1>
            <Button variant='filled' color='ut-burntorange' icon={MaterialSymbolsExpandAllRoundedIcon} onClick={myShow}>
                Open Dialog
            </Button>
        </>
    );
};
