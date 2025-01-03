import type { Meta, StoryObj } from '@storybook/react';
import CalendarHeader from '@views/components/calendar/CalendarHeader';

const meta = {
    title: 'Components/Calendar/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        showSidebar: true,
    },
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
