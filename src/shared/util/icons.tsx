import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { SVGProps } from 'react';
import React from 'react';

import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';

/**
 * Get Icon component based on status
 * @param props.status status
 * @returns JSX.Element | undefined - the icon component
 */
export function StatusIcon(props: SVGProps<SVGSVGElement> & { status: StatusType }): JSX.Element | undefined {
    const { status, ...rest } = props;

    switch (props.status) {
        case Status.WAITLISTED:
            return <WaitlistIcon {...rest} />;
        case Status.CLOSED:
            return <ClosedIcon {...rest} />;
        case Status.CANCELLED:
            return <CancelledIcon {...rest} />;
        default:
            return undefined;
    }
}
