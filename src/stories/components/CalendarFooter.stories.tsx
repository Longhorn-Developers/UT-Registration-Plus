import type { Meta, StoryObj } from '@storybook/react';
import CalendarFooter from '@views/components/calendar/CalendarFooter';

const meta = {
    title: 'Components/Calendar/CalendarFooter',
    component: CalendarFooter,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CalendarFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
