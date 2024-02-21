import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Divider from '@views/components/common/Divider/Divider';
import { Button } from '@views/components/common/Button/Button';
import AddIcon from '~icons/material-symbols/add';
import CalendarMonthIcon from '~icons/material-symbols/calendar-month';
import DescriptionIcon from '~icons/material-symbols/description';
import HappyFaceIcon from '~icons/material-symbols/mood';
import ReviewsIcon from '~icons/material-symbols/reviews';

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
        variant: 'vertical',
    },
    render: props => <Divider {...props} />,
};

export const Horizontal: Story = {
    args: {
        size: '2.5rem',
        variant: 'horizontal',
    },
    render: props => <Divider {...props} />,
};

export const IGotHorizontalIGotVerticalWhatYouWant: Story = {
    args: {
        size: '2.5rem',
        variant: 'vertical',
    },

    render: props => (
        <div className='grid grid-cols-7 grid-rows-3 items-center justify-items-center gap-3.75'>
            {Array.from({ length: 21 }).map((_, i) => (
                <Divider {...props} variant={i % 2 === 0 ? 'horizontal' : 'vertical'} />
            ))}
        </div>
    ),
};

export const CourseCatalogActionButtons: Story = {
    args: {
        size: '1.75rem',
        variant: 'vertical',
    },
    render: props => (
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Button variant='filled' color='ut-burntorange' icon={CalendarMonthIcon} />
            <Divider {...props} />
            <Button variant='outline' color='ut-blue' icon={ReviewsIcon}>
                RateMyProf
            </Button>
            <Button variant='outline' color='ut-teal' icon={HappyFaceIcon}>
                CES
            </Button>
            <Button variant='outline' color='ut-orange' icon={DescriptionIcon}>
                Past Syllabi
            </Button>
            <Button variant='filled' color='ut-green' icon={AddIcon}>
                Add Course
            </Button>
        </div>
    ),
};
