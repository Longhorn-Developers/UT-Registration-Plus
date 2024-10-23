import createSchedule from '@pages/background/lib/createSchedule';
import duplicateSchedule from '@pages/background/lib/duplicateSchedule';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import { Button } from '../Button';
import { usePrompt } from './DialogProvider';

const SCHEDULE_LIMIT = 10;

/**
 * Hook that attempts to add a schedule, enforcing a schedule limit if necessary
 * @param scheduleName      The name of the schedule to be added
 */
export function useAddSchedule(): (scheduleName?: string) => void {
    const [, schedules] = useSchedules();
    const showDialog = usePrompt();

    return (scheduleName: string = 'New Schedule') => {
        if (schedules.length >= SCHEDULE_LIMIT) {
            showDialog({
                title: `You have ${SCHEDULE_LIMIT} active schedules!`,

                description: (
                    <>
                        To encourage organization,{' '}
                        <span className='text-ut-burntorange'>please consider removing some unused schedules</span> you
                        may have.
                    </>
                ),

                buttons: close => (
                    <Button variant='filled' color='ut-burntorange' onClick={close}>
                        I Understand
                    </Button>
                ),
            });

            return;
        }

        createSchedule(scheduleName);
    };
}

/**
 * Hook that attempts to add a schedule, enforcing a schedule limit if necessary
 * @param scheduleName      The name of the schedule to be added
 */
export function useDuplicateSchedule(): (scheduleId: string) => void {
    const [, schedules] = useSchedules();
    const showDialog = usePrompt();

    return (scheduleId: string) => {
        if (schedules.length >= SCHEDULE_LIMIT) {
            showDialog({
                title: `You have ${SCHEDULE_LIMIT} active schedules!`,

                description: (
                    <>
                        To encourage organization,{' '}
                        <span className='text-ut-burntorange'>please consider removing some unused schedules</span> you
                        may have.
                    </>
                ),

                buttons: close => (
                    <Button variant='filled' color='ut-burntorange' onClick={close}>
                        I Understand
                    </Button>
                ),
            });

            return;
        }

        duplicateSchedule(scheduleId);
    };
}
