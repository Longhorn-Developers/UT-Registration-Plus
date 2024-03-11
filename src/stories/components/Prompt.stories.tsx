import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button/Button';
import PromptDialog from '@views/components/common/Prompt/Prompt';
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
        title: { control: 'text' },
        content: { control: 'text' },
        children: { control: 'object' },
    },
} satisfies Meta<typeof PromptDialog>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isOpen: true,
        onClose: () => {},
        title: 'Are you sure?',
        content: 'This will delete all of your courses and schedules. Are you sure you want to continue?',
        children: [
            <Button key='yes' variant='filled' color='ut-burntorange' onClick={() => {}}>
                Yes
            </Button>,
            <Button key='no' variant='outline' color='ut-black' onClick={() => {}}>
                No
            </Button>,
        ],
    },
};
