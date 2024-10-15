import { colorsFlattened } from '@shared/util/themeColors';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import React from 'react';

import AddIcon from '~icons/material-symbols/add';
import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import DescriptionIcon from '~icons/material-symbols/description';
import ImagePlaceholderIcon from '~icons/material-symbols/image';
import HappyFaceIcon from '~icons/material-symbols/mood';
import RemoveIcon from '~icons/material-symbols/remove';
import ReviewsIcon from '~icons/material-symbols/reviews';

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
        icon: ImagePlaceholderIcon,
    },
    argTypes: {
        children: { control: 'text' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        variant: 'filled',
        color: 'ut-black',
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
                <Button {...props} variant='filled' color='ut-black' />
                <Button {...props} variant='outline' color='ut-black' />
                <Button {...props} variant='single' color='ut-black' />
            </div>

            <hr />

            <div style={{ display: 'flex', gap: '15px' }}>
                <Button {...props} variant='filled' color='ut-black' disabled />
                <Button {...props} variant='outline' color='ut-black' disabled />
                <Button {...props} variant='single' color='ut-black' disabled />
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
                        <Button {...props} variant='filled' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='outline' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='single' color={color}>
                            Button
                        </Button>
                        <Button {...props} variant='filled' color={color} />
                        <Button {...props} variant='outline' color={color} />
                        <Button {...props} variant='single' color={color} />
                    </div>
                ))}
            </div>
        );
    },
};

// @ts-ignore
export const CourseButtons: Story = {
    render: props => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <Button {...props} variant='filled' color='ut-green' icon={AddIcon}>
                Remove Course
            </Button>
            <Button {...props} variant='filled' color='theme-red' icon={RemoveIcon}>
                Remove Course
            </Button>
        </div>
    ),
    parameters: {
        design: {
            type: 'figma',
            url: 'https://www.figma.com/file/8tsCay2FRqctrdcZ3r9Ahw/UTRP?type=design&node-id=324-389&mode=design&t=BoS5xBrpSsjgQXqv-4',
        },
    },
};

export const CourseCatalogActionButtons: Story = {
    // @ts-ignore
    args: {
        children: '',
    },
    render: props => (
        <div style={{ display: 'flex', gap: '15px' }}>
            <Button {...props} variant='filled' color='ut-burntorange' icon={CalendarMonthIcon} />
            <Button {...props} variant='outline' color='ut-blue' icon={ReviewsIcon}>
                RateMyProf
            </Button>
            <Button {...props} variant='outline' color='ut-teal' icon={HappyFaceIcon}>
                CES
            </Button>
            <Button {...props} variant='outline' color='ut-orange' icon={DescriptionIcon}>
                Past Syllabi
            </Button>
            <Button {...props} variant='filled' color='ut-green' icon={AddIcon}>
                Add Course
            </Button>
        </div>
    ),
};
