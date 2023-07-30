import type { Meta, StoryObj } from '@storybook/react';

import Text from './Text';

const meta = {
    component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
