import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarHeader from '@views/components/calendar/CalendarHeader/CalendarHeader';
import { CourseFinderProvider } from '@views/contexts/CourseFinderContext';

const meta = {
    title: 'Components/Calendar/CalendarHeader',
    component: CalendarHeader,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    // On the calendar page, Quick Add in the header also links to the Course Finder
    render: args => (
        <CourseFinderProvider>
            <div className='w-3xl max-w-[90vw]'>
                <CalendarHeader {...args} />
            </div>
        </CourseFinderProvider>
    ),
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
