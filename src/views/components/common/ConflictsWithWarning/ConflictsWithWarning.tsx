import React from 'react';
import { Course } from 'src/shared/types/Course';
import clsx from 'clsx';
import Text from '../Text/Text';

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
 * @param props ConflictsWithWarningProps
 */
export default function ConflictsWithWarning({ className, conflicts }: ConflictsWithWarningProps): JSX.Element {
    return (
        <Text
            variant='mini'
            className={clsx(
                className,
                'min-w-21 w-21 flex flex-col items-start gap-2.5 rounded bg-[#AF2E2D] p-2.5 text-white'
            )}
        >
            <div>Conflicts With:</div>
            {conflicts.map(course => (
                <div>
                    {`${course.department} ${course.number} (${course.uniqueId})`}
                </div>
            ))}
        </Text>
    );
}
