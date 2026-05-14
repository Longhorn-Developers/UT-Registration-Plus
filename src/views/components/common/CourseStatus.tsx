import type { StatusType } from '@shared/types/Course';
import { StatusIcon } from '@shared/util/icons';
import Text from '@views/components/common/Text/Text';
import type { JSX } from 'react';

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
    return (
        <div className='inline-flex items-center gap-1.5'>
            <div className='flex items-center justify-center rounded'>
                <StatusIcon status={status} className='size-5' />
            </div>
            <Text variant={size}>{status}</Text>
        </div>
    );
}
