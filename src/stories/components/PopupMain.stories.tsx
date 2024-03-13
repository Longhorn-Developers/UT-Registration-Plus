import type { Meta, StoryObj } from '@storybook/react';
import PopupMain from '@views/components/PopupMain';
import React from 'react';

const meta = {
    title: 'Components/Common/PopupMain',
    component: PopupMain,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {},
    argTypes: {},
    render: () => (
        <div
            style={{ width: '360px', height: '540px' }}
            className='border-2 border-gray-300/40 shadow-gray/20 shadow-lg'
        >
            <PopupMain />
        </div>
    ),
} satisfies Meta<typeof PopupMain>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
