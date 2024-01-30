import Link from 'src/views/components/common/Link/Link';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Components/Common/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'color',
    },
  },
  args: {
    children: 'Link',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
