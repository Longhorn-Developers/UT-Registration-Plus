// Calendar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import CalendarCell from '@views/components/calendar/CalendarGridCell';

const meta = {
    title: 'Components/Calendar/CalendarGridCell',
    component: CalendarCell,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
        tags: ['autodocs'],
    },
    args: {
        row: 0,
        col: 0,
    },
} satisfies Meta<typeof CalendarCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
