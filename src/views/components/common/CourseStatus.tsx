import type { StatusType } from '@shared/types/Course';
import { StatusIcon } from '@shared/util/icons';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

type SizeType = 'small' | 'mini';

/**
 * Props for CourseStatus
 */
export interface CourseStatusProps {
    status: StatusType;
    size: SizeType;
}

/**
 * The CourseStatus component as per the Labels and Details Figma section
 *
 * @param status - The status of the course
 * @param size - The size of the component
 * @returns The CourseStatus component
 */
export default function CourseStatus({ status, size }: CourseStatusProps): JSX.Element {
    const statusIconSizeClass = clsx({
        'h-5 w-5': size === 'small',
        'h-4 w-4': size === 'mini',
    });

    return (
        <div className={`inline-flex items-center ${size === 'small' ? 'gap-2' : 'gap-1.5'}`}>
            <div className='ml-1 flex items-center justify-center rounded bg-slate-700 p-1px text-white'>
                <StatusIcon status={status} className={statusIconSizeClass} />
            </div>
            <Text variant={size}>{status}</Text>
        </div>
    );
}
