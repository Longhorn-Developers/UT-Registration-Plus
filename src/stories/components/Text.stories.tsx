import type { Meta, StoryObj } from '@storybook/react';
import Text from '@views/components/common/Text/Text';
import React from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Components/Common/Text',
    component: Text,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    args: {
        children: 'The quick brown fox jumps over the lazy dog.',
    },
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {},
};

export const AllVariants: Story = {
    args: {
        children: 'The quick brown fox jumps over the lazy dog.',
    },
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Text {...props} variant='mini' />
            <Text {...props} variant='small' />
            <Text {...props} variant='p' />
            <Text {...props} variant='h4' />
            <Text {...props} variant='h3-course' />
            <Text {...props} variant='h3' />
            <Text {...props} variant='h2-course' />
            <Text {...props} variant='h2' />
            <Text {...props} variant='h1-course' />
            <Text {...props} variant='h1' />
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=324-389&mode=design&t=BoS5xBrpSsjgQXqv-4',
        },
    },
};
