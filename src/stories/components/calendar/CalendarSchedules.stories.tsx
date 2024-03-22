import type { Meta, StoryObj } from '@storybook/react';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';

const meta = {
    title: 'Components/Calendar/CalendarSchedules',
    component: CalendarSchedules,
    parameters: {
        layout: 'centered',
        tags: ['autodocs'],
    },
} satisfies Meta<typeof CalendarSchedules>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
