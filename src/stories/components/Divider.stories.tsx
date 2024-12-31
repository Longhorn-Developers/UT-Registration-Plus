import { CalendarDots, ChatText, FileText, Plus, Smiley } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import React from 'react';

const meta = {
    title: 'Components/Common/Divider',
    component: Divider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Divider>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
    args: {
        size: '2.5rem',
        orientation: 'vertical',
    },
    render: props => <Divider {...props} />,
};

export const Horizontal: Story = {
    args: {
        size: '2.5rem',
        orientation: 'horizontal',
    },
    render: props => <Divider {...props} />,
};

export const IGotHorizontalIGotVerticalWhatYouWant: Story = {
    args: {
        size: '2.5rem',
        orientation: 'vertical',
    },

    render: props => (
        <div className='grid grid-cols-7 grid-rows-3 items-center justify-items-center gap-3.75'>
            {Array.from({ length: 21 }).map((_, i) => (
                <Divider {...props} orientation={i % 2 === 0 ? 'horizontal' : 'vertical'} />
            ))}
        </div>
    ),
};

export const CourseCatalogActionButtons: Story = {
    args: {
        size: '1.75rem',
        orientation: 'vertical',
    },
    render: props => (
        <div className='flex items-center gap-3.75'>
            <Button variant='filled' color='ut-burntorange' icon={CalendarDots} />
            <Divider {...props} />
            <Button variant='outline' color='ut-blue' icon={ChatText}>
                RateMyProf
            </Button>
            <Button variant='outline' color='ut-teal' icon={Smiley}>
                CES
            </Button>
            <Button variant='outline' color='ut-orange' icon={FileText}>
                Past Syllabi
            </Button>
            <Button variant='filled' color='ut-green' icon={Plus}>
                Add Course
            </Button>
        </div>
    ),
};
