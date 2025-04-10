import { ImageSquare } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';
import Input from '@views/components/common/Input';
import React, { type ChangeEvent, type ComponentProps, useState } from 'react';

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

const InnerComponent = (args: ComponentProps<typeof Input>) => {
    const [value, setValue] = useState<string>(args.value);

    return <Input {...args} value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />;
};

export const Primary: Story = {
    render: (args: ComponentProps<typeof Input>) => <InnerComponent {...args} />,
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquare,
        value: '',
    },
};

export const Disabled: Story = {
    render: (args: ComponentProps<typeof Input>) => <InnerComponent {...args} />,
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquare,
        value: '',
        disabled: true,
    },
};

export const NoIcon: Story = {
    render: (args: ComponentProps<typeof Input>) => <InnerComponent {...args} />,
    args: {
        placeholder: 'Write an input...',
        value: '',
        disabled: false,
    },
};
