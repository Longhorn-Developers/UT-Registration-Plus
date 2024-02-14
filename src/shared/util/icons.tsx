import React, { SVGProps } from 'react';
import ClosedIcon from '~icons/material-symbols/lock';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';
import { Status } from '../types/Course';

/**
 * Get Icon component based on status
 * @param props.status status
 * @returns React.ReactElement - the icon component
 */
export function StatusIcon(props: SVGProps<SVGSVGElement> & { status: Status }): React.ReactElement {
    const { status, ...rest } = props;

    switch (props.status) {
        case Status.WAITLISTED:
            return <WaitlistIcon {...rest} />;
        case Status.CLOSED:
            return <ClosedIcon {...rest} />;
        case Status.CANCELLED:
            return <CancelledIcon {...rest} />;
        default:
    }
}
