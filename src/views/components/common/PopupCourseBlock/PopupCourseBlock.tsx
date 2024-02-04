import React from 'react';
import { Course } from 'src/shared/types/Course';
import classNames from 'classnames';
import Text from '../Text/Text';
import Icon from '../Icon/Icon';

type PopupCourseBlockProps = {
    className?: string;
    course: Course;
};

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({ className, course }: PopupCourseBlockProps): JSX.Element {
    return (
        // <div className={classNames(className, 'w-full bg-emerald-300')} style={style}>
        <div
            className={classNames(
                className,
                'h-full w-full inline-flex items-center justify-center gap-1 rounded bg-emerald-300 pr-2'
            )}
        >
            <div className='h-full flex items-center rounded rounded-r-0 bg-emerald-800'>
                <Icon className='' name='drag_indicator' color='white' />
            </div>
            <Text className='flex-grow p2' variant='h1-course'>
                {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}`}
            </Text>
            <Icon className='justify-self-end rounded bg-emerald-800 p-1px' name='timelapse' color='white' />
        </div>
    );
}
