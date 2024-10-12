import type { Meta, StoryObj } from '@storybook/react';
import UpdateText, { UpdateTextProps } from 'src/views/components/common/UpdateText';
import React from 'react';

const meta = {
    title: 'Components/Common/UpdateText',
    component: UpdateText,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        courses: { control: 'object' },
    },
} satisfies Meta<typeof UpdateText>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = (args: React.JSX.IntrinsicAttributes & UpdateTextProps) => <UpdateText {...args} />;

export const Default: Story = {
    render: Template,
    args: {
        courses: ['12345', '23456', '34567', '45678', '56789'],
    },
};
Default.args = {
    courses: ['12345', '23456', '34567', '45678', '56789'],
};
