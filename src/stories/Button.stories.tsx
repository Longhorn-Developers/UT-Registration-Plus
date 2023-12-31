import { Button } from '@src/views/components/common/Button/Button';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Common/Button',
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    args: {
        children: 'Button',
    },
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const Grid: Story = {
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
                <Button {...props} type='primary' />
                <Button {...props} type='secondary' />
                <Button {...props} type='tertiary' />
                <Button {...props} type='danger' />
                <Button {...props} type='warning' />
                <Button {...props} type='success' />
                <Button {...props} type='info' />
            </div>
            <div style={{ display: 'flex' }}>
                <Button {...props} type='primary' disabled />
                <Button {...props} type='secondary' disabled />
                <Button {...props} type='tertiary' disabled />
                <Button {...props} type='danger' disabled />
                <Button {...props} type='warning' disabled />
                <Button {...props} type='success' disabled />
                <Button {...props} type='info' disabled />
            </div>
        </div>
    ),
};
