import useSchedules from '@views/hooks/useSchedules';
import React, { useCallback } from 'react';

import { Button } from '../components/common/Button';
import { usePrompt } from '../components/common/DialogProvider/DialogProvider';

const SCHEDULE_LIMIT = 10;

/**
 * Hook that creates a function that enforces a maximum amount of schedules
 *
 * If a new schedule can be created without exceeding the limit, the function returns true
 * Otherwise, display a prompt explaining the limit, and returns false
 *
 * @returns a function, () => boolean
 */
export function useEnforceScheduleLimit(): () => boolean {
    const [, schedules] = useSchedules();
    const showDialog = usePrompt();

    return useCallback(() => {
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
    }, [schedules, showDialog]);
}
