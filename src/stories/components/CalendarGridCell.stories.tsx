// Calendar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import CalendarCell from '@views/components/common/CalendarGridCell/CalendarGridCell';

const meta = {
    title: 'Components/Common/CalendarGridCell',
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
