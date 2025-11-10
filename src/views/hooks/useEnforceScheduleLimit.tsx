import { background } from '@shared/messages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { CRX_PAGES } from '@shared/types/CRXPages';
import useSchedules from '@views/hooks/useSchedules';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../components/common/Button';
import { usePrompt } from '../components/common/DialogProvider/DialogProvider';

const SCHEDULE_LIMIT = 10;

/**
 * Hook that creates a function that enforces a maximum amount of schedules
 *
 * If a new schedule can be created without exceeding the limit, the function returns true
 * Otherwise, display a prompt explaining the limit, and returns false
 *
 * @returns a callback function that enforces the schedule limit via a dialog
 */
export function useEnforceScheduleLimit(): () => boolean {
    const [, schedules] = useSchedules();
    const showDialog = usePrompt();
    const [allowMoreSchedules, setAllowMoreSchedules] = useState<boolean>(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const val = await OptionsStore.get('allowMoreSchedules');
                if (mounted) setAllowMoreSchedules(val ?? false);
            } catch (err) {
                    console.error('Failed to read allowMoreSchedules from OptionsStore:', err);
            }
        })();

        const listener = OptionsStore.listen('allowMoreSchedules', async ({ newValue }) => {
            setAllowMoreSchedules(newValue);
        });

        return () => {
            mounted = false;
            OptionsStore.removeListener(listener);
        };
    }, []);

    return useCallback(() => {
        // If user has enabled bypass, allow creating more schedules
        if (allowMoreSchedules) return true;

        if (schedules.length >= SCHEDULE_LIMIT) {
            showDialog({
                title: `You have too many schedules!`,

                description: (
                    <>
                        To encourage organization,{' '}
                        <span className='text-ut-burntorange'>please consider deleting any unused schedules</span> you
                        may have. You can increase the limit in the settings if it’s really necessary.
                    </>
                ),

                buttons: close => (
                    <>
                        <Button
                            variant='outline'
                            color='ut-black'
                            onClick={() => {
                                close();
                                // open options/settings page so user can enable bypass if they are advising staff
                                const url = chrome.runtime.getURL(CRX_PAGES.OPTIONS);
                                background.openNewTab({ url });
                            }}
                        >
                            Open Settings
                        </Button>
                        <Button variant='filled' color='ut-burntorange' onClick={close}>
                            I understand
                        </Button>
                    </>
                ),
            });

            return false;
        }
        return true;
    }, [schedules, showDialog, allowMoreSchedules]);
}
