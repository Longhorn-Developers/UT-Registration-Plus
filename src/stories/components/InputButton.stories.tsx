// InputButton.stories.tsx
import { colorsFlattened } from '@shared/util/themeColors';
import type { Meta, StoryObj } from '@storybook/react';
import InputButton from '@views/components/common/InputButton';
import React from 'react';

import AddIcon from '~icons/material-symbols/add';
import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import DescriptionIcon from '~icons/material-symbols/description';
import ImagePlaceholderIcon from '~icons/material-symbols/image';
import HappyFaceIcon from '~icons/material-symbols/mood';
import ReviewsIcon from '~icons/material-symbols/reviews';

/**
 * Stole this straight from Button.stories.tsx to test the input
 */
const meta = {
    title: 'Components/Common/InputButton',
    component: InputButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: {
        children: 'Upload File',
        icon: ImagePlaceholderIcon,
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
} satisfies Meta<typeof InputButton>;

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
                <InputButton {...props} variant='filled' color='ut-black' />
                <InputButton {...props} variant='outline' color='ut-black' />
                <InputButton {...props} variant='single' color='ut-black' />
            </div>

            <hr />

            <div style={{ display: 'flex', gap: '15px' }}>
                <InputButton {...props} variant='filled' color='ut-black' disabled />
                <InputButton {...props} variant='outline' color='ut-black' disabled />
                <InputButton {...props} variant='single' color='ut-black' disabled />
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
                        <InputButton {...props} variant='filled' color={color}>
                            Button
                        </InputButton>
                        <InputButton {...props} variant='outline' color={color}>
                            Button
                        </InputButton>
                        <InputButton {...props} variant='single' color={color}>
                            Button
                        </InputButton>
                    </div>
                ))}
            </div>
        );
    },
};
