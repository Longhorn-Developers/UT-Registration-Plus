import { Meta, StoryObj } from '@storybook/react';
import CalendarGrid from 'src/views/components/common/CalendarGrid/CalendarGrid';

const meta = {
    title: 'Components/Common/CalendarGrid',
    component: CalendarGrid,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        saturday: { control: 'text' },
        sunday: { control: 'text' },
    },
} satisfies Meta<typeof CalendarGrid>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        saturday: true,
        sunday: true,
    },
};