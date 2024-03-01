import type { Meta, StoryObj } from '@storybook/react';
import Palette from '@views/components/common/Palette/Palette';

const meta: Meta<typeof Palette> = {
    title: 'Components/Common/Palette',
    component: Palette,
};

export default meta;
type Story = StoryObj<typeof Palette>;

export const Default: Story = {
    args: {},
};
