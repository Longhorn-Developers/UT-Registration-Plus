import type { Meta, StoryObj } from '@storybook/react-vite';
import GoogleCalendarImportGuide from '@views/components/calendar/GoogleCalendarImportGuide';
import { Button } from '@views/components/common/Button';
import DialogProvider from '@views/components/common/DialogProvider/DialogProvider';
import useGoogleCalendarImport from '@views/hooks/useGoogleCalendarImport';
import type { JSX } from 'react';

const meta = {
    title: 'Components/Calendar/GoogleCalendarImportGuide',
    component: GoogleCalendarImportGuide,
    parameters: {
        layout: 'centered',
    },
    args: {
        onSaveAgain: () => {},
    },
    render: args => (
        <div className='w-[440px] border border-divider rounded bg-surface-raised p-6.25'>
            <GoogleCalendarImportGuide {...args} />
        </div>
    ),
} satisfies Meta<typeof GoogleCalendarImportGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function OpenDialogButton(): JSX.Element {
    const addToGoogleCalendar = useGoogleCalendarImport();

    return (
        <Button color='ut-burntorange' onClick={() => void addToGoogleCalendar()}>
            Add to Google Calendar
        </Button>
    );
}

/**
 * The whole dialog, as the Export menu's "Add to Google Calendar" opens it (which also downloads schedule.ics)
 */
export const InDialog: Story = {
    render: () => (
        <DialogProvider>
            <OpenDialogButton />
        </DialogProvider>
    ),
};
