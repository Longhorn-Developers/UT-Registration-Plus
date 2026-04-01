import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import CalendarDotsIcon from '~icons/ph/calendar-dots';
import ChatTextIcon from '~icons/ph/chat-text';
import FileTextIcon from '~icons/ph/file-text';
import PlusIcon from '~icons/ph/plus';
import SmileyIcon from '~icons/ph/smiley';

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
                // biome-ignore lint/correctness/useJsxKeyInIterable: TODO:
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
            <Button variant='filled' color='ut-burntorange' icon={CalendarDotsIcon} />
            <Divider {...props} />
            <Button variant='outline' color='ut-blue' icon={ChatTextIcon}>
                RateMyProf
            </Button>
            <Button variant='outline' color='ut-teal' icon={SmileyIcon}>
                CES
            </Button>
            <Button variant='outline' color='ut-orange' icon={FileTextIcon}>
                Past Syllabi
            </Button>
            <Button variant='filled' color='ut-green' icon={PlusIcon}>
                Add Course
            </Button>
        </div>
    ),
};
