import classNames from 'classnames';
import React from 'react';
import { Status } from '../types/Course';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import ClosedIcon from '~icons/material-symbols/lock';
import CancelledIcon from '~icons/material-symbols/warning';

/**
 * Get Icon component based on status
 * @param status status
 * @param className className string
 * @returns React.ReactElement - the icon component
 */
export function getStatusIcon(status: Status, className = ''): React.ReactElement {
    switch (status) {
        case Status.WAITLISTED:
            return <WaitlistIcon className={classNames('h-5 w-5', className)} />;
        case Status.CLOSED:
            return <ClosedIcon className={classNames('h-5 w-5', className)} />;
        case Status.CANCELLED:
            return <CancelledIcon className={classNames('h-5 w-5', className)} />;
        default:
    }
}
