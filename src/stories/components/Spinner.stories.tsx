import type { Meta, StoryObj } from '@storybook/react';
import Spinner from '@views/components/common/Spinner';

const meta = {
    title: 'Components/Common/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
