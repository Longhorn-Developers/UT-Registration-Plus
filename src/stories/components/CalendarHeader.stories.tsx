import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CalendarHeader from '@views/components/common/CalendarHeader/CalenderHeader';

const meta = {
    title: 'Components/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
