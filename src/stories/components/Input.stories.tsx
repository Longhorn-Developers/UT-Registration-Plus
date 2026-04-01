import type { Meta, StoryObj } from '@storybook/react';
import Input from '@views/components/common/Input';
import { type ChangeEvent, type ComponentProps, useState } from 'react';
import ImageSquareIcon from '~icons/ph/image-square';

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
    const [value, setValue] = useState(String(args.value ?? ''));

    return <Input {...args} value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} />;
};

export const Primary: Story = {
    render: (args: ComponentProps<typeof Input>) => <InnerComponent {...args} />,
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquareIcon,
        value: '',
    },
};

export const Disabled: Story = {
    render: (args: ComponentProps<typeof Input>) => <InnerComponent {...args} />,
    args: {
        placeholder: 'Write an input...',
        icon: ImageSquareIcon,
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
