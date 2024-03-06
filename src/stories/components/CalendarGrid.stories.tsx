import { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from 'src/views/components/common/CalendarGrid/CalendarGrid';

const meta = {
    title: 'Components/Common/Calendar',
    component: Calendar,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
        tags: ['autodocs'],
    },
    tags: ['autodocs'],
    argTypes: {
        saturdayClass: { control: 'boolean' },
    },
} satisfies Meta<typeof CalendarGrid>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        saturdayClass: true,
    },
};
