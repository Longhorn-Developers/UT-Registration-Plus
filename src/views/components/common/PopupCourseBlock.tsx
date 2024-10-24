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

import Copy from '~icons/material-symbols/content-copy';
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
    const [isCopied, setIsCopied] = useState<boolean>(false); // Add state to track if copied

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips }) => setEnableCourseStatusChips(enableCourseStatusChips));

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
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

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedUniqueId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
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
            <div
                onClick={handleClick}
                className={clsx(
                    'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3 focusable cursor-pointer text-left',
                    className
                )}
            >
                <Text className={clsx('flex-1 py-3.5 truncate', fontColor)} variant='h1-course'>
                    {course.department} {course.number} &ndash;{' '}
                    {course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}
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

            <button
                className='bg-transparent px-2 py-0.25 text-white btn'
                color={colors.secondaryColor}
                onClick={handleCopy}
                style={{ display: 'flex', backgroundColor: colors.secondaryColor, color: 'text-white' }}
            >
                <Copy className='h-5 w-5 text-white' />
                {isCopied ? 'Copied!' : formattedUniqueId}
            </button>
        </div>
    );
}
