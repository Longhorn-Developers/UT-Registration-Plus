// ScheduleActions.tsx
import { MenuItem } from '@headlessui/react';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Text from '@views/components/common/Text/Text';
import React from 'react';

import { Button } from '../Button';
import { usePrompt } from './DialogProvider';

/**
 * ConfirmDelete Component
 * Displays a confirmation dialog before deleting a schedule.
 * This is a reusable utility component.
 */
export const ConfirmDelete = ({ schedule }: { schedule: UserSchedule }) => {
    const showDialog = usePrompt();

    const handleDelete = () => {
        showDialog({
            title: `Are you sure you want to delete ${schedule.name}?`,
            description: `Deleting "${schedule.name}" will remove it from your schedules list permanently.`,
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <>
                    <Button variant='outline' color='ut-red' onClick={() => deleteSchedule(schedule.id)}>
                        Yes
                    </Button>
                    <Button variant='outline' color='ut-burntorange' onClick={close}>
                        No
                    </Button>
                </>
            ),
        });
    };

    return (
        <MenuItem as='div' onClick={handleDelete}>
            {({ focus }) => (
                <Text className={`block px-4 py-1 ${focus ? 'bg-gray-100 text-red-600' : 'text-red-600'}`}>Delete</Text>
            )}
        </MenuItem>
    );
};

/**
 * DeleteActiveScheduleError Component
 * Displays an error dialog if the user tries to delete the active schedule.
 * This is a reusable utility component.
 */
export const DeleteActiveScheduleError = ({ schedule }: { schedule: UserSchedule }) => {
    const showDialog = usePrompt();

    const showError = () => {
        showDialog({
            title: `Unable to delete active schedule.`,
            description: `Deleting active schedule "${schedule.name}" is not allowed. If possible, switch to another schedule and try again.`,
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <Button variant='outline' color='ut-burntorange' onClick={close}>
                    Close
                </Button>
            ),
        });
    };

    return (
        <MenuItem as='div' onClick={showError}>
            {({ focus }) => (
                <Text className={`block px-4 py-1 ${focus ? 'bg-gray-100 text-red-600' : 'text-red-600'}`}>Delete</Text>
            )}
        </MenuItem>
    );
};
