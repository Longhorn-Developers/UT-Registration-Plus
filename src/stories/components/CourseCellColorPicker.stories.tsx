import type { Meta, StoryObj } from '@storybook/react';
import CourseCellColorPicker from '@views/components/common/CourseCellColorPicker/CourseCellColorPicker';
import React, { useState } from 'react';
import type { ThemeColor } from 'src/shared/util/themeColors';

const meta: Meta<typeof CourseCellColorPicker> = {
    title: 'Components/Common/CourseCellColorPicker',
    component: CourseCellColorPicker,
};

export default meta;
type Story = StoryObj<typeof CourseCellColorPicker>;

export const Default: Story = {
    render: () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unused-vars
        const [selectedColor, setSelectedColor] = useState<ThemeColor | null>(null);
        return <CourseCellColorPicker setSelectedColor={setSelectedColor} />;
    },
};
