import type { Meta, StoryObj } from '@storybook/react-vite';
import Calendar from '@views/components/calendar/Calendar';
import { CourseFinderProvider } from '@views/contexts/CourseFinderContext';

const meta = {
    title: 'Components/Calendar/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
    // The calendar page provides the Course Finder (see CalendarMain)
    decorators: [
        Story => (
            <CourseFinderProvider>
                <Story />
            </CourseFinderProvider>
        ),
    ],
} satisfies Meta<typeof Calendar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
