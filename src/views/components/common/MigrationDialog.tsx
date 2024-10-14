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
                    await migrateUTRPv1Courses();
                } catch (error) {
                    console.error(error);
                    const sentryId = sentryScope.captureException(error);
                    setError(sentryId);
                    return;
                }
                setProcessState(2);
                close();
            }
        };

        handleMigration();
    }, [processState, close, sentryScope]);

    return (
        <>
            {error && (
                <Text variant='p' className='text-ut-red'>
                    An error occurred while migrating your courses. Please try again later in settings. (
                    {error.substring(0, 8)})
                </Text>
            )}
            <Button
                variant='filled'
                color='ut-burntorange'
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
 * MigrationDialog component.
 *
 * This component checks if there are any courses from UTRP v1 and, if so, displays a dialog
 * prompting the user to migrate their old courses. The dialog includes a title, description,
 * and buttons for the migration process.
 *
 * @returns An empty JSX element.
 */
export function MigrationDialog(): JSX.Element {
    const showDialog = usePrompt();

    useEffect(() => {
        const checkMigration = async () => {
            if ((await getUTRPv1Courses()).length > 0) {
                showDialog(
                    {
                        title: (
                            <Text variant='h4' className='text-ut-burntorange font-bold'>
                                This extension has been updated!
                            </Text>
                        ),
                        description:
                            'You may have already began planning your Spring 2025 schedule. Use the button below to migrate your old UTRP v1 courses.',
                        // eslint-disable-next-line react/no-unstable-nested-components
                        buttons: close => <MigrationButtons close={close} />,
                    },
                    {
                        closeOnClickOutside: false,
                    }
                );
            }
        };

        checkMigration();
    }, [showDialog]);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
}
