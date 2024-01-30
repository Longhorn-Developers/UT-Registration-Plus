import Spinner from 'src/views/components/common/Spinner/Spinner';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Common/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
