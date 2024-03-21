import type { Meta, StoryObj } from '@storybook/react';
import Calendar from '@views/components/calendar/Calendar';

const meta = {
    title: 'Components/Calendar/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
} satisfies Meta<typeof Calendar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
