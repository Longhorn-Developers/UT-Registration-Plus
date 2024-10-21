import migrateUTRPv1Courses, { getUTRPv1Courses } from '@background/lib/migrateUTRPv1Courses';
import Text from '@views/components/common/Text/Text';
import { useSentryScope } from '@views/contexts/SentryContext';
import React, { useEffect, useState } from 'react';

import { Button } from './Button';
import { usePrompt } from './DialogProvider/DialogProvider';
import Spinner from './Spinner';

function MigrationButtons({ close }: { close: () => void }): JSX.Element {
    const [processState, setProcessState] = useState(0);
    const [error, setError] = useState<string | undefined>(undefined);

    const [sentryScope] = useSentryScope();

    useEffect(() => {
        const handleMigration = async () => {
            if (processState === 1) {
                try {
                    await chrome.storage.session.set({ pendingMigration: true });
                    const successful = await migrateUTRPv1Courses();
                    if (successful) {
                        await chrome.storage.local.set({ finishedMigration: true });
                        await chrome.storage.session.remove('pendingMigration');
                    }
                } catch (error) {
                    console.error(error);
                    const sentryId = sentryScope.captureException(error);
                    setError(sentryId);
                    await chrome.storage.session.remove('pendingMigration');
                    return;
                }
                setProcessState(2);
                close();
            } else if (processState === 0) {
                const { pendingMigration } = await chrome.storage.session.get('pendingMigration');
                if (pendingMigration) setProcessState(1);
            }
        };

        handleMigration();

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processState]);

    return (
        <>
            {error && (
                <Text variant='p' className='text-ut-red'>
                    An error occurred while migrating your courses. Please try again later in settings. (
                    {error.substring(0, 8)})
                </Text>
            )}
            <Button
                variant='single'
                color='ut-black'
                onClick={() => {
                    close();
                    if (!error) {
                        chrome.storage.local.set({ finishedMigration: true });
                    }
                }}
            >
                Cancel
            </Button>
            <Button
                variant='filled'
                color='ut-green'
                disabled={processState > 0}
                onClick={() => {
                    setProcessState(1);
                }}
            >
                {processState === 1 ? (
                    <>
                        Migrating... <Spinner className='ml-2.75 inline-block h-4! w-4! text-current!' />
                    </>
                ) : (
                    'Migrate courses'
                )}
            </Button>
        </>
    );
}

/**
 * Custom hook that provides a function to show a migration dialog.
 *
 * The dialog prompts the user to migrate their saved schedules if there are any courses
 * available to migrate. If there are no courses to migrate, it informs the user that
 * migration has already been completed.
 *
 * @returns A function that, when called, checks for courses to migrate and shows the appropriate dialog.
 */
export function useMigrationDialog() {
    const showDialog = usePrompt();

    return async () => {
        if ((await getUTRPv1Courses()).length > 0) {
            showDialog(
                {
                    title: 'This extension has updated!',
                    description:
                        "You may have already began planning your Spring '25 schedule. Click the button below to transfer your saved schedules into a new schedule. (You may be required to login to the UT Registrar)",

                    buttons: close => <MigrationButtons close={close} />,
                },
                {
                    closeOnClickOutside: false,
                }
            );
        } else {
            showDialog({
                title: 'Already migrated!',
                description:
                    'There are no courses to migrate. If you have any issues, please submit a feedback report by clicking the flag at the top right of the extension popup.',

                buttons: close => (
                    <Button variant='filled' color='ut-burntorange' onClick={close}>
                        I Understand
                    </Button>
                ),
            });
        }
    };
}

/**
 * MigrationDialog component.
 *
 * This component is responsible for checking if a migration has already been attempted
 * and if there are any courses from UTRPv1 that need to be migrated. If migration is needed,
 * it triggers the migration dialog.
 *
 * @returns An empty fragment.
 *
 * @remarks
 * The component uses the `useMigrationDialog` hook to show the migration dialog and the
 * `useEffect` hook to perform the migration check on component mount.
 */
export function MigrationDialog(): JSX.Element {
    const showMigrationDialog = useMigrationDialog();

    useEffect(() => {
        const checkMigration = async () => {
            // check if migration was already attempted
            if ((await chrome.storage.local.get('finishedMigration')).finishedMigration) return;

            if ((await getUTRPv1Courses()).length > 0) showMigrationDialog();
        };

        checkMigration();

        // This is on purpose
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // (not actually a useless fragment)
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
}
