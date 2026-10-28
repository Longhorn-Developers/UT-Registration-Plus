import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';

const meta = {
    title: 'Components/Calendar/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    render: args => (
        <div className='w-3xl max-w-[90vw]'>
            <CalendarHeader {...args} />
        </div>
    ),
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
