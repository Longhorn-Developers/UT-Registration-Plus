import { Button } from 'src/views/components/common/Button/Button';
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
                <Button {...props} type='filled' />
                <Button {...props} type='outline' />
                <Button {...props} type='single' />
            </div>
            <div style={{ display: 'flex' }}>
                <Button {...props} type='filled' disabled />
                <Button {...props} type='outline' disabled />
                <Button {...props} type='single' disabled />
            </div>
        </div>
    ),
};

// TODO: Actually show the buttons as they appear in the design
export const CourseButtons: Story = {
    args: {
        children: 'Add Course',
    },
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
                <Button {...props} type='filled' />
                <Button {...props} type='outline' />
                <Button {...props} type='single' />
            </div>
            <div style={{ display: 'flex' }}>
                <Button {...props} type='filled' disabled />
                <Button {...props} type='outline' disabled />
                <Button {...props} type='single' disabled />
            </div>
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=324-389&mode=design&t=BoS5xBrpSsjgQXqv-4',
        },
    },
};
