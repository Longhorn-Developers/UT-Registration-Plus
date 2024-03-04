import type { Meta, StoryObj } from '@storybook/react';
import CourseCellColorPicker from '@views/components/common/CourseCellColorPicker/CourseCellColorPicker';
import React, { useState } from 'react';
import type { ThemeColor } from 'src/shared/util/themeColors';

const meta = {
    title: 'Components/Common/CourseCellColorPicker',
    component: CourseCellColorPicker,
} satisfies Meta<typeof CourseCellColorPicker>;

export default meta;
type Story = StoryObj<typeof CourseCellColorPicker>;

export const Default: Story = {
    render: () => {
        const [selectedColor, setSelectedColor] = useState<ThemeColor | null>(null);
        return <CourseCellColorPicker setSelectedColor={setSelectedColor} />;
    },
};
