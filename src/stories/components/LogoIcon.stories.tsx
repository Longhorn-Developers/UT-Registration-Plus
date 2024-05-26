import type { Meta, StoryObj } from '@storybook/react';
import { LargeLogo, SmallLogo } from '@views/components/common/LogoIcon';
import React from 'react';

const meta = {
    title: 'Components/Common/Logo',
    component: SmallLogo,
    tags: ['autodocs'],
} satisfies Meta<typeof SmallLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};

export const Large: Story = {
    render: args => <LargeLogo {...args} />,
};
