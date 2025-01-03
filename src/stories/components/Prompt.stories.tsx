import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import type { PromptDialogProps } from '@views/components/common/Prompt';
import PromptDialog from '@views/components/common/Prompt';
import Text from '@views/components/common/Text/Text';
import React from 'react';

const meta = {
    title: 'Components/Common/Prompt',
    component: PromptDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: { control: 'boolean' },
        title: { control: 'object' },
        content: { control: 'object' },
        children: { control: 'object' },
    },
} satisfies Meta<typeof PromptDialog>;
export default meta;

const PromptDialogWithButton = ({ children, ...args }: PromptDialogProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const { title, content } = args;

    const childrenWithHandleClose: React.ReactElement[] = (children ?? []).map(child => {
        if (child.type === Button) {
            return React.cloneElement(child, { onClick: () => handleClose() } as React.HTMLAttributes<HTMLElement>);
        }
        return child;
    });

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <Button variant='filled' color='ut-burntorange' onClick={handleOpen}>
                Open Prompt
            </Button>
            <PromptDialog {...args} isOpen={isOpen} onClose={handleClose} title={title} content={content}>
                {childrenWithHandleClose}
            </PromptDialog>
        </div>
    );
};

export const AreYouSure: StoryObj<PromptDialogProps> = {
    render: args => <PromptDialogWithButton {...args} />,
    args: {
        title: <Text variant='h2'>Are you sure?</Text>,
        content: (
            <Text variant='p'>
                Deleting Main Schedule is permanent and will remove all added courses and schedules.
            </Text>
        ),
        children: [
            <Button key='yes' variant='minimal' color='ut-burntorange'>
                Yes
            </Button>,
            <Button key='no' variant='minimal' color='ut-black'>
                No
            </Button>,
        ],
    },
};

export const YouHave10ActiveSchedules: StoryObj<PromptDialogProps> = {
    render: args => <PromptDialogWithButton {...args} />,
    args: {
        title: <Text variant='h2'>You have 10 active schedules!</Text>,
        content: (
            <Text variant='p'>
                To encourage organization, please consider removing some unused schedules you may have.
            </Text>
        ),
        children: [
            <Button key='yes' variant='minimal' color='ut-black'>
                I understand
            </Button>,
        ],
    },
};

export const WelcomeToUTRPV2: StoryObj<PromptDialogProps> = {
    render: args => <PromptDialogWithButton {...args} />,
    args: {
        title: <Text variant='h2'>Welcome to UTRP V2!</Text>,
        content: (
            <Text variant='p'>
                You may have already began planning your Summer or Fall schedule. To migrate your courses into v2.0
                please select “Migrate,” or start fresh.
            </Text>
        ),
        children: [
            <Button key='migrate' variant='minimal' color='ut-black'>
                Don&apos;t Migrate
            </Button>,
            <Button key='start-fresh' variant='minimal' color='ut-burntorange'>
                Migrate
            </Button>,
        ],
    },
};
