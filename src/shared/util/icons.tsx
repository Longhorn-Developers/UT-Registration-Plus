import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { SVGProps } from 'react';
import React from 'react';

import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';

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
            return <WaitlistIcon {...rest} />;
        case Status.CLOSED:
            return <ClosedIcon {...rest} />;
        case Status.CANCELLED:
            return <CancelledIcon {...rest} />;
        default:
            return null;
    }
}
