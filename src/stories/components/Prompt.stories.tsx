import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button/Button';
import type { PromptDialogProps } from '@views/components/common/Prompt/Prompt';
import PromptDialog from '@views/components/common/Prompt/Prompt';
import Text from '@views/components/common/Text/Text';
import React from 'react';

const meta: Meta<typeof PromptDialog> = {
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
};
export default meta;

// Define a new component for use in the story to comply with React's rules of hooks
const PromptDialogWithButton = (args: PromptDialogProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <Button variant='filled' color='ut-burntorange' onClick={handleOpen}>
                Open Prompt
            </Button>
            <PromptDialog {...args} isOpen={isOpen} onClose={handleClose} />
        </div>
    );
};

export const Default: StoryObj<PromptDialogProps> = {
    render: args => <PromptDialogWithButton {...args} />, // Use the new component here
    args: {
        title: <Text variant='h2'>Are you sure?</Text>,
        content: (
            <Text variant='p'>
                Deleting Main Schedule is permanent and will remove all added courses and schedules.
            </Text>
        ),
        children: [
            <Button key='yes' variant='single' color='ut-burntorange' onClick={() => {}}>
                Yes
            </Button>,
            <Button key='no' variant='single' color='ut-black' onClick={() => {}}>
                No
            </Button>,
        ],
    },
};
