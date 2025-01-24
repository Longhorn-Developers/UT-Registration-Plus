import type { Meta, StoryObj } from '@storybook/react';
import CourseCellColorPicker from '@views/components/calendar/CalendarCourseCellColorPicker/CourseCellColorPicker';
import React from 'react';

const meta = {
    title: 'Components/Calendar/CourseCellColorPicker',
    component: CourseCellColorPicker,
} satisfies Meta<typeof CourseCellColorPicker>;

export default meta;
type Story = StoryObj<typeof CourseCellColorPicker>;

function CourseCellColorPickerWithState() {
    return <CourseCellColorPicker defaultColor='#000000' />;
}

export const Default: Story = {
    render: CourseCellColorPickerWithState,
};
