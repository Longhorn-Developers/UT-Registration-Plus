import { ImageSquare } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';
import Dropdown from '@views/components/common/Dropdown';

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

export const Primary: Story = {
    args: {
        placeholderText: 'Select an option...',
        options: Array(30)
            .fill(null)
            .map((_, i) => ({ id: `${i + 1}`, label: `Option ${i + 1}` })),
        // { id: '1', label: 'Option 1' },
        // { id: '2', label: 'Option 2' },
        // { id: '3', label: 'Option 3' },
        // ,
        selectedOption: undefined,
        icon: ImageSquare,
        disabled: false,
        className: '',
        onOptionChange: newOption => console.log(newOption),
        iconProps: {},
    },
};

export const Disabled: Story = {
    args: {
        placeholderText: 'Select an option...',
        options: [
            { id: '1', label: 'Option 1' },
            { id: '2', label: 'Option 2' },
            { id: '3', label: 'Option 3' },
        ],
        selectedOption: undefined,
        icon: ImageSquare,
        disabled: true,
        className: '',
        onOptionChange: newOption => console.log(newOption),
        iconProps: {},
    },
};

export const NoIcon: Story = {
    args: {
        placeholderText: 'Select an option...',
        options: [
            { id: '1', label: 'Option 1' },
            { id: '2', label: 'Option 2' },
            { id: '3', label: 'Option 3' },
        ],
        selectedOption: undefined,
        icon: undefined,
        disabled: false,
        className: '',
        onOptionChange: newOption => console.log(newOption),
        iconProps: {},
    },
};
