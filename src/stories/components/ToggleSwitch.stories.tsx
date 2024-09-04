import type { Meta, StoryObj } from '@storybook/react';
import SwitchButton from '@views/components/common/SwitchButton';

const meta = {
    title: 'Components/Common/SwitchButton',
    component: SwitchButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof SwitchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        isChecked: true,
    },
};
