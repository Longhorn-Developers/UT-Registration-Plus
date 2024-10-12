import type { Meta, StoryObj } from '@storybook/react';
import UpdateText, { DividerProps } from 'src/views/components/common/UpdateText';
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
