import { CalendarDots, ChatText, FileText, ImageSquare, Minus, Plus, Smiley } from '@phosphor-icons/react';
import { colorsFlattened } from '@shared/util/themeColors';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
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
        icon: ImageSquare,
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
            <Button {...props} variant='filled' color='ut-green' icon={Plus}>
                Add Course
            </Button>
            <Button {...props} variant='filled' color='theme-red' icon={Minus}>
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
            <Button {...props} variant='filled' color='ut-burntorange' icon={CalendarDots} />
            <Button {...props} variant='outline' color='ut-blue' icon={ChatText}>
                RateMyProf
            </Button>
            <Button {...props} variant='outline' color='ut-teal' icon={Smiley}>
                CES
            </Button>
            <Button {...props} variant='outline' color='ut-orange' icon={FileText}>
                Past Syllabi
            </Button>
            <Button {...props} variant='filled' color='ut-green' icon={Plus}>
                Add Course
            </Button>
        </div>
    ),
};
