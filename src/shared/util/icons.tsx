import { ClockUser, LockKey, Prohibit } from '@phosphor-icons/react';
import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { SVGProps } from 'react';
import React from 'react';

interface StatusIconProps extends SVGProps<SVGSVGElement> {
    status: StatusType;
}

/**
 * Get Icon component based on status
 *
 * @param props - The props for the StatusIcon component
 * @returns The rendered icon component
 */
export function StatusIcon(props: StatusIconProps): JSX.Element | null {
    const { status, ...rest } = props;

    switch (status) {
        case Status.WAITLISTED:
            return <ClockUser weight='fill' {...rest} />;
        case Status.CLOSED:
            return <LockKey weight='fill' {...rest} />;
        case Status.CANCELLED:
            return <Prohibit weight='fill' {...rest} />;
        default:
            return null;
    }
}
