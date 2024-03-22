import type { Meta, StoryObj } from '@storybook/react';
import Link from '@views/components/common/Link';

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
