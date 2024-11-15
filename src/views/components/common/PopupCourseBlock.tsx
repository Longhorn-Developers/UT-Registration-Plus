import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { background } from '@shared/messages';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type { CourseColors } from '@shared/types/ThemeColors';
import { pickFontColor } from '@shared/util/colors';
import { StatusIcon } from '@shared/util/icons';
import Text from '@views/components/common/Text/Text';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    colors: CourseColors;
    dragHandleProps?: DraggableProvidedDragHandleProps;
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
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips }) => setEnableCourseStatusChips(enableCourseStatusChips));

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        return () => {
            OptionsStore.removeListener(l1);
        };
    }, []);

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    const formattedUniqueId = course.uniqueId.toString().padStart(5, '0');

    const handleClick = async () => {
        await background.switchToCalendarTab({ uniqueId: course.uniqueId });
        window.close();
    };

    return (
        <div
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx(
                'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3 focusable cursor-pointer text-left',
                className
            )}
            onClick={handleClick}
        >
            <div
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
                className='flex items-center self-stretch rounded rounded-r-0 cursor-move!'
                {...dragHandleProps}
            >
                <DragIndicatorIcon className='h-6 w-6 text-white' />
            </div>
            <Text className={clsx('flex-1 py-3.5 truncate', fontColor)} variant='h1-course'>
                <span className='px-0.5 font-450'>{formattedUniqueId}</span> {course.department} {course.number}
                {course.instructors.length > 0 ? <> &ndash; </> : ''}
                {course.instructors.map(v => v.toString({ format: 'last', case: 'capitalize' })).join('; ')}
            </Text>
            {enableCourseStatusChips && course.status !== Status.OPEN && (
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
