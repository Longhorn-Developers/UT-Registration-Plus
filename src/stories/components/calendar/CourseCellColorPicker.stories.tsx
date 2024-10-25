import type { ThemeColor } from '@shared/types/ThemeColors';
import type { Meta, StoryObj } from '@storybook/react';
import CourseCellColorPicker from '@views/components/calendar/CalendarCourseCellColorPicker/CourseCellColorPicker';
import React, { useState } from 'react';

const meta = {
    title: 'Components/Calendar/CourseCellColorPicker',
    component: CourseCellColorPicker,
} satisfies Meta<typeof CourseCellColorPicker>;

export default meta;
type Story = StoryObj<typeof CourseCellColorPicker>;

function CourseCellColorPickerWithState() {
    const [, setSelectedColor] = useState<ThemeColor | null>(null);
    const [isInvertColorsToggled, setIsInvertColorsToggled] = useState<boolean>(false);
    return (
        <CourseCellColorPicker
            setSelectedColor={setSelectedColor}
            isInvertColorsToggled={isInvertColorsToggled}
            setIsInvertColorsToggled={setIsInvertColorsToggled}
            defaultColor='#000000'
            updateCourseColor={() => {}}
        />
    );
}

export const Default: Story = {
    render: CourseCellColorPickerWithState,
};
