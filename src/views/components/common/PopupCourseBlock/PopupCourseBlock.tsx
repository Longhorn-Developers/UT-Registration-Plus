import React from 'react';
import { Course, Status } from 'src/shared/types/Course';
import classNames from 'classnames';
import Text from '../Text/Text';
import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import ClosedIcon from '~icons/material-symbols/lock';
import CancelledIcon from '~icons/material-symbols/warning';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    primaryColor: string;
    secondaryColor: string;
    whiteText?: boolean;
}

function getStatusIcon(status: Status, classList = ''): React.ReactElement {
    switch (status) {
        case Status.WAITLISTED:
            return <WaitlistIcon className={classNames('h-5 w-5', classList)} />;
        case Status.CLOSED:
            return <ClosedIcon className={classNames('h-5 w-5', classList)} />;
        case Status.CANCELLED:
            return <CancelledIcon className={classNames('h-5 w-5', classList)} />;
        default:
    }
}

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({
    className,
    course,
    primaryColor,
    secondaryColor,
    whiteText,
}: PopupCourseBlockProps): JSX.Element {
    return (
        <div
            className={classNames(
                className,
                primaryColor,
                'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3'
            )}
        >
            <div
                className={classNames(
                    secondaryColor,
                    'cursor-move self-stretch px-0.5 flex items-center rounded rounded-r-0'
                )}
            >
                <DragIndicatorIcon className='h-5 w-5 text-white' />
            </div>
            <Text
                className={classNames('flex-grow p3', {
                    'text-white': whiteText,
                    'text-black': !whiteText,
                })}
                variant='h1-course'
            >
                {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}`}
            </Text>
            {course.status !== Status.OPEN &&
                getStatusIcon(course.status, `text-white justify-self-end rounded p-1px w-5 h-5 ${secondaryColor}`)}
        </div>
    );
}
