import { ScheduleHistoryStore } from '@shared/storage/ScheduleHistoryStore';
import { generateRandomId } from '@shared/util/random';
import type { Meta, StoryObj } from '@storybook/react-vite';
import ScheduleHistoryToast from '@views/components/calendar/ScheduleHistoryToast';
import { Button } from '@views/components/common/Button';
import Dialog from '@views/components/common/Dialog';
import type { JSX } from 'react';
import { Suspense } from 'react';

import { mikeScottCS314Course } from '../../injected/mocked';

/**
 * Records a removal the way the background does when a course is removed, which brings up the message. Undoing it
 * needs the background, which Storybook doesn't have.
 */
function RemoveCourseButton(): JSX.Element {
    return (
        <Button
            color='ut-burntorange'
            onClick={async () => {
                const undo = await ScheduleHistoryStore.get('undo');
                await ScheduleHistoryStore.set('undo', [
                    ...undo,
                    {
                        id: generateRandomId(),
                        type: 'remove',
                        scheduleId: 'story',
                        course: mikeScottCS314Course,
                        index: 0,
                    },
                ]);
            }}
        >
            Remove C S 314
        </Button>
    );
}

const meta = {
    title: 'Components/Calendar/ScheduleHistoryToast',
    component: ScheduleHistoryToast,
    parameters: {
        layout: 'centered',
    },
    render: () => (
        <div className='h-[60vh] flex items-start'>
            <RemoveCourseButton />
            <Suspense fallback={null}>
                <ScheduleHistoryToast />
            </Suspense>
        </div>
    ),
} satisfies Meta<typeof ScheduleHistoryToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/**
 * Removing a course from its popup leaves the popup open, and a dialog makes the rest of the page inert, so the
 * message has to be above it and still usable
 */
export const OverADialog: Story = {
    render: () => (
        <>
            <Dialog open onClose={() => {}} className='p-spacing-6'>
                <RemoveCourseButton />
            </Dialog>
            <Suspense fallback={null}>
                <ScheduleHistoryToast />
            </Suspense>
        </>
    ),
};
