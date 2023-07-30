import type { Meta, StoryObj } from '@storybook/react';

import Divider from './Divider';

const meta = {
    component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
    args: {
        type: 'solid',
    },
};

export const Dashed: Story = {
    args: {
        type: 'dashed',
    },
};

export const Dotted: Story = {
    args: {
        type: 'dotted',
    },
};
