// Calendar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import CalendarCell from 'src/views/components/calendar/CalendarGridCell/CalendarGridCell';

const meta = {
    title: 'Components/Calendar/CalendarGridCell',
    component: CalendarCell,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
        tags: ['autodocs'],
    },
} satisfies Meta<typeof CalendarCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
