import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';

const meta = {
    title: 'Components/Calendar/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    // The dialog provider is for Export's "Add to Google Calendar", which shows how to import the schedule
    render: args => (
        <DialogProvider>
            <div className='w-3xl max-w-[90vw]'>
                <CalendarHeader {...args} />
            </div>
        </DialogProvider>
    ),
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
