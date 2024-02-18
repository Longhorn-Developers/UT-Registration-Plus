import type { Meta, StoryObj } from '@storybook/react';
import Divider from 'src/views/components/common/Divider/Divider';

const meta = {
    title: 'Components/Common/Divider',
    component: Divider,
    tags: ['autodocs'],
    argTypes: {
        color: {
            control: 'color',
        },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
