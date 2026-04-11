import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { JSX, SVGProps } from 'react';
import ClockUserFillIcon from '~icons/ph/clock-user-fill';
import LockKeyFillIcon from '~icons/ph/lock-key-fill';
import ProhibitFillIcon from '~icons/ph/prohibit-fill';

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
            return <ClockUserFillIcon {...rest} />;
        case Status.CLOSED:
            return <LockKeyFillIcon {...rest} />;
        case Status.CANCELLED:
            return <ProhibitFillIcon {...rest} />;
        default:
            return null;
    }
}
