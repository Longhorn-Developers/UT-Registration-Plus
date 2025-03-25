import { ImageSquare } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from '@views/components/common/Dropdown';
import React, { type ComponentProps, useState } from 'react';

const meta = {
    title: 'Components/Common/QuickAddDropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const InnerComponent = (args: React.ComponentProps<typeof Dropdown>) => {
    const [option, setOption] = useState(args.selectedOption);

    return (
        <Dropdown
            {...args}
            selectedOption={option}
            onOptionChange={newOption => {
                setOption(newOption);
                args.onOptionChange?.(newOption);
            }}
        />
    );
};

export const Primary: Story = {
    render: (args: ComponentProps<typeof Dropdown>) => <InnerComponent {...args} />,
    args: {
        placeholderText: 'Select an option...',
        options: Array(10)
            .fill(null)
            .map((_, i) => ({ id: `${i + 1}`, label: `Option ${i + 1}` })),
        selectedOption: null,
        icon: ImageSquare,
        disabled: false,
    },
};

export const Disabled: Story = {
    render: (args: ComponentProps<typeof Dropdown>) => <InnerComponent {...args} />,
    args: {
        placeholderText: 'Select an option...',
        options: [
            { id: '1', label: 'Option 1' },
            { id: '2', label: 'Option 2' },
            { id: '3', label: 'Option 3' },
        ],
        selectedOption: null,
        icon: ImageSquare,
        disabled: true,
    },
};

export const NoIcon: Story = {
    render: (args: ComponentProps<typeof Dropdown>) => <InnerComponent {...args} />,
    args: {
        placeholderText: 'Select an option...',
        options: [
            { id: '1', label: 'Option 1' },
            { id: '2', label: 'Option 2' },
            { id: '3', label: 'Option 3' },
        ],
        selectedOption: null,
    },
};
