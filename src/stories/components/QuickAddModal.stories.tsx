import type { Meta, StoryObj } from '@storybook/react';
import QuickAddModal from '@views/components/common/QuickAddModal';
import React from 'react';

const meta = {
    title: 'Components/Common/QuickAddModal',
    component: QuickAddModal,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
} satisfies Meta<typeof QuickAddModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    render: () => <InnerComponent />,
};

const InnerComponent = () => <QuickAddModal />;
