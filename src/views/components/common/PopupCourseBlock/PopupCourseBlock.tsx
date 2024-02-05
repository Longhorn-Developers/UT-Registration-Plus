import React from 'react';
import { Course, Status } from 'src/shared/types/Course';
import classNames from 'classnames';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';

const conversion = {
    WAITLISTED: 'timelapse',
    CLOSED: 'lock',
    CANCELLED: 'warning',
    CONFLICT: 'error',
};

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
            <div className={classNames(secondaryColor, 'h-full px-2px flex items-center rounded rounded-r-0')}>
                <Icon className='' name='drag_indicator' color='white' />
            </div>
            <Text className={classNames(whiteText ? 'text-white' : 'text-black', 'flex-grow p3')} variant='h1-course'>
                {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}`}
            </Text>
            {course.status !== Status.OPEN && (
                <Icon
                    className={classNames(secondaryColor, 'justify-self-end rounded p-1px')}
                    name={conversion[course.status] as any} // should probably fix this "as any" later on
                    color='white'
                />
            )}
        </div>
    );
}
