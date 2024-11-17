import type { Course } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

/**
 * Props for ConflictWithWarningProps
 */
export interface ConflictsWithWarningProps {
    className?: string;
    conflicts: Course[];
}

/**
 * The ConflictsWithWarning component is used to display a warning message when a course conflicts
 * with another course as part of the labels and details section
 *
 * @param className - The class name for the component
 * @param conflicts - The courses that conflict with the current course
 * @returns The ConflictsWithWarning component
 */
export default function ConflictsWithWarning({ className, conflicts }: ConflictsWithWarningProps): JSX.Element {
    return (
        <Text
            variant='mini'
            className={clsx(
                className,
                'min-w-21 w-21 flex flex-col items-start gap-2.5 rounded bg-theme-red p-2.5 text-white'
            )}
        >
            <div>Conflicts With:</div>
            {conflicts.map(course => (
                <div>
                    <Text as='strong' variant='mini' className='font-bold!'>
                        {course.department} {course.number}
                    </Text>{' '}
                    ({course.uniqueId})
                </div>
            ))}
        </Text>
    );
}
