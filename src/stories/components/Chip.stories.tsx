import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@views/components/common/Chip/Chip';

const meta = {
    title: 'Components/Common/Chip',
    component: Chip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
    },
} satisfies Meta<typeof Chip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        label: 'QR',
    },
};
