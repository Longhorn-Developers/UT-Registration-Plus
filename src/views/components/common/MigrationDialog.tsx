import migrateUTRPv1Courses, { getUTRPv1Courses } from '@background/lib/migrateUTRPv1Courses';
import Text from '@views/components/common/Text/Text';
import React, { useEffect, useState } from 'react';
import { useSentryScope } from 'src/views/contexts/SentryContext';
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
                variant='filled'
                color='ut-burntorange'
                disabled={processState > 0}
                onClick={() => {
                    setProcessState(1);
                }}
            >
                {processState == 1 ? (
                    <>
                        Migrating... <Spinner className='ml-2.75 w-4! h-4! text-current! inline-block' />
                    </>
                ) : (
                    'Migrate courses'
                )}
            </Button>
        </>
    );
}

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
                        buttons: close => <MigrationButtons close={close} />,
                    },
                    {
                        closeOnClickOutside: false,
                    }
                );
            }
        };

        checkMigration();
    }, []);
    return <></>;
}
