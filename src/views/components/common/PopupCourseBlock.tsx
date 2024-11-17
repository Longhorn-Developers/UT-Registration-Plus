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
import React, { useEffect, useRef, useState } from 'react';

import CheckIcon from '~icons/material-symbols/check';
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
 * @param className - The class name to apply to the component.
 * @param course - The course object to display.
 * @param colors - The colors to use for the course block.
 * @param dragHandleProps - The drag handle props for the course block.
 * @returns The rendered PopupCourseBlock component.
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
        });

        return () => {
            OptionsStore.removeListener(l1);
        };
    }, []);

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    const formattedUniqueId = course.uniqueId.toString().padStart(5, '0');
    const [copyWait, setCopyWait] = useState<NodeJS.Timeout | undefined>(undefined);
    const copyTimeoutIdRef = useRef(0);

    const handleClick = async () => {
        await background.switchToCalendarTab({ uniqueId: course.uniqueId });
        window.close();
    };

    const handleCopy = (event: React.MouseEvent<HTMLElement>) => {
        if (copyWait !== undefined) {
            clearTimeout(copyWait);
        }

        event.preventDefault();
        navigator.clipboard.writeText(formattedUniqueId);
        copyTimeoutIdRef.current += 250;

        const newTimeoutId = setTimeout(() => {
            setCopyWait(undefined);
        }, copyTimeoutIdRef.current);
        setCopyWait(newTimeoutId);
    };


    return (
        <div
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx(
                'h-full min-h-[50px] w-full inline-flex items-center justify-center gap-1 rounded pr-3 focusable cursor-pointer text-left',
                className
            )}
        >
            <div
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
                className='flex items-center self-stretch rounded rounded-r-0 cursor-move!'
                {...dragHandleProps}
                onClick={handleClick}
            >
                <DragIndicatorIcon className='h-6 w-6 text-white' />
            </div>
            <Text className={clsx('flex-1 pl-[10px] py-3.5 truncate', fontColor)} variant='h1-course'>
                {course.department} {course.number}
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

            <button
                className='flex bg-transparent px-2 py-0.25 text-white btn'
                onClick={handleCopy}
                style={{ backgroundColor: colors.secondaryColor }}
            >
                {copyWait !== undefined ? (
                    <CheckIcon className='h-5 w-5 text-white' />
                ) : (
                    <Copy className='h-5 w-5 text-white' />
                )}
                {formattedUniqueId}
            </button>
        </div>
    );
}
