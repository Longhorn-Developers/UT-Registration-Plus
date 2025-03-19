import { ImageSquare } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';
import Input from '@views/components/common/Input';

const meta = {
    title: 'Components/Common/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquare,
        value: '',
        onChange: () => {},
        disabled: false,
        className: '',
        iconProps: {},
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquare,
        value: '',
        onChange: () => {},
        disabled: true,
        className: '',
        iconProps: {},
    },
};

export const NoIcon: Story = {
    args: {
        placeholder: 'Write an input...',
        icon: undefined,
        value: '',
        onChange: () => {},
        disabled: true,
        className: '',
        iconProps: {},
    },
};
