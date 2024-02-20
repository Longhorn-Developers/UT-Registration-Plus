import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CalendarHeader from 'src/views/components/calendar/CalendarHeader/CalenderHeader';

const meta = {
    title: 'Components/Common/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
