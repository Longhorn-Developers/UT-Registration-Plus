import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import { Button } from '../Button';
import { usePrompt } from './DialogProvider';

const SCHEDULE_LIMIT = 10;

/**
 * Hook that checks if currently over the schedule limit
 * @returns
 */
export function useEnforceScheduleLimit(): () => boolean {
    const [, schedules] = useSchedules();
    const showDialog = usePrompt();

    return () => {
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

            return false;
        }
        return true;
    };
}
