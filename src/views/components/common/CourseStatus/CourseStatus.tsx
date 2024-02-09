import React from 'react';
import { Status } from '@shared/types/Course';
import { StatusIcon } from '@shared/util/icons';
import clsx from 'clsx';
import Text from '../Text/Text';

type SizeType = 'small' | 'mini';


  

/**
 * Props for CourseStatus
 */
export interface CourseStatusProps {
    status: Status,
    size: SizeType
}

/**
 * The CourseStatus component as per the Labels and Details Figma section
 *
 * @param props CourseStatusProps
 */
export default function CourseStatus({ status, size }: CourseStatusProps): JSX.Element {
    const statusIconSizeClass = clsx({
        'h-5 w-5': size === 'small', 
        'h-4 w-4': size === 'mini',  
    });

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
            }}
        >
            <StatusIcon status={status} className={statusIconSizeClass} />
            <Text
                variant={size}
            >
                {status}
            </Text>                
        </div>
    );
}
