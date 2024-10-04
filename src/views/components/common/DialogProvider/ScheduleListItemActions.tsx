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
            title: `Are you sure?`,
            description: (
                <>
                    <Text>Deleting</Text>
                    <Text className='text-ut-burntorange'> {schedule.name} </Text>
                    <Text>is permanent and will remove all added courses from that schedule.</Text>
                </>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <>
                    <Button variant='single' color='ut-black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        variant='filled'
                        color='ut-red'
                        onClick={() => {
                            deleteSchedule(schedule.id);
                        }}
                    >
                        Delete Permanently
                    </Button>
                </>
            ),
        });
    };

    return (
        <MenuItem as='div' onClick={handleDelete}>
            {({ focus }) => (
                <Text
                    variant='small'
                    className={`block px-2 py-2 ${focus ? 'bg-gray-100 text-red-600 rounded' : 'text-red-600'}`}
                >
                    Delete
                </Text>
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

            description: (
                <>
                    <Text>Deleting the active schedule</Text>
                    <Text className='text-ut-burntorange'> {schedule.name} </Text>
                    <Text>is not allowed. Please switch to another schedule and try again.</Text>
                </>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            buttons: close => (
                <Button variant='filled' color='ut-burntorange' onClick={close}>
                    I Understand
                </Button>
            ),
        });
    };

    return (
        <MenuItem as='div' onClick={showError}>
            {({ focus }) => (
                <Text
                    variant='small'
                    className={`block px-2 py-2 ${focus ? 'bg-gray-100 text-red-600 rounded' : 'text-red-600'}`}
                >
                    Delete
                </Text>
            )}
        </MenuItem>
    );
};
