import { ImageSquare } from '@phosphor-icons/react';
import { colorsFlattened } from '@shared/util/themeColors';
import type { Meta, StoryObj } from '@storybook/react';
import FileUpload from '@views/components/common/FileUpload';
import React from 'react';

/**
 * Stole this straight from Button.stories.tsx to test the input
 */
const meta = {
    title: 'Components/Common/FileUpload',
    component: FileUpload,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        children: 'Upload File',
        icon: ImageSquare,
    },
    argTypes: {
        children: { control: 'text' },
        color: {
            control: 'select',
            options: Object.keys(colorsFlattened),
        },
        variant: {
            control: 'select',
            options: ['filled', 'outline', 'single'],
        },
        disabled: {
            control: 'boolean',
        },
        onChange: { action: 'file selected' }, // action to show when file is selected
    },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        variant: 'filled',
        color: 'ut-black', // Default theme color
    },
};

export const Disabled: Story = {
    args: {
        variant: 'filled',
        color: 'ut-black',
        disabled: true,
    },
};

// @ts-ignore
export const Grid: Story = {
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <FileUpload {...props} variant='filled' color='ut-black' />
                <FileUpload {...props} variant='outline' color='ut-black' />
                <FileUpload {...props} variant='single' color='ut-black' />
            </div>

            <hr />

            <div style={{ display: 'flex', gap: '15px' }}>
                <FileUpload {...props} variant='filled' color='ut-black' disabled />
                <FileUpload {...props} variant='outline' color='ut-black' disabled />
                <FileUpload {...props} variant='single' color='ut-black' disabled />
            </div>
        </div>
    ),
};

export const PrettyColors: Story = {
    // @ts-ignore
    args: {
        children: '',
    },
    render: props => {
        const colorsNames = Object.keys(colorsFlattened) as (keyof typeof colorsFlattened)[];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {colorsNames.map(color => (
                    <div style={{ display: 'flex', gap: '15px' }} key={color}>
                        <FileUpload {...props} variant='filled' color={color}>
                            Button
                        </FileUpload>
                        <FileUpload {...props} variant='outline' color={color}>
                            Button
                        </FileUpload>
                        <FileUpload {...props} variant='single' color={color}>
                            Button
                        </FileUpload>
                    </div>
                ))}
            </div>
        );
    },
};
