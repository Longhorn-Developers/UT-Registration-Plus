import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
    component: Button,
    args: {
        disabled: false,
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        type: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        type: 'secondary',
    },
};

export const Tertiary: Story = {
    args: {
        type: 'tertiary',
    },
};

export const Danger: Story = {
    args: {
        type: 'danger',
    },
};

export const Warning: Story = {
    args: {
        type: 'warning',
    },
};

export const Success: Story = {
    args: {
        type: 'success',
    },
};

export const Info: Story = {
    args: {
        type: 'info',
    },
};
