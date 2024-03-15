import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseColors } from '@shared/util/colors';
import { pickFontColor } from '@shared/util/colors';
import { StatusIcon } from '@shared/util/icons';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    colors: CourseColors;
    dragHandleProps?: any;
}

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({
    className,
    course,
    colors,
    dragHandleProps,
}: PopupCourseBlockProps): JSX.Element {
    // whiteText based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    const formattedUniqueId = course.uniqueId.toString().padStart(5, '0');

    return (
        <div
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx('h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3', className)}
        >
            <div
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
                className='flex cursor-move items-center self-stretch rounded rounded-r-0'
                {...dragHandleProps}
            >
                <DragIndicatorIcon className='h-6 w-6 text-white' />
            </div>
            <Text className={clsx('flex-1 py-3.5 truncate', fontColor)} variant='h1-course'>
                <span className='px-0.5 font-450'>{formattedUniqueId}</span> {course.department} {course.number} &ndash;{' '}
                {course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}
            </Text>
            {course.status !== Status.OPEN && (
                <div
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                    className='ml-1 flex items-center justify-center justify-self-end rounded p-1px text-white'
                >
                    <StatusIcon status={course.status} className='h-5 w-5' />
                </div>
            )}
        </div>
    );
}
