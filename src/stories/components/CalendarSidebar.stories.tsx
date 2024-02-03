import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CalendarSidebar from 'src/views/components/common/CalendarSidebar/CalendarSidebar';

const meta = {
    title: 'Components/Common/CalendarSidebar',
    component: CalendarSidebar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CalendarSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};