import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { Check, Copy, DotsSixVertical } from '@phosphor-icons/react';
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

import { Button } from './Button';

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
    const [isCopied, setIsCopied] = useState(false);
    const lastCopyTime = useRef<number>(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips }) => setEnableCourseStatusChips(enableCourseStatusChips));

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
            // console.log('enableCourseStatusChips', newValue);
        });

        // adds transition for shadow hover after three frames
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (ref.current) {
                        ref.current.classList.add('transition-shadow-100');
                    }
                });
            });
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

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        const now = Date.now();
        if (now - lastCopyTime.current < 1500) {
            return;
        }

        lastCopyTime.current = now;
        await navigator.clipboard.writeText(course.uniqueId.toString().padStart(5, '0'));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1500);
    };

    return (
        <div
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx(
                'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-2 focusable cursor-pointer text-left hover:shadow-md ease-out group-[.is-dragging]:shadow-md',
                className
            )}
            onClick={handleClick}
            ref={ref}
        >
            <div
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
                className='flex items-center self-stretch rounded rounded-r-0 cursor-move!'
                {...dragHandleProps}
            >
                <DotsSixVertical weight='bold' className='h-6 w-6 text-white' />
            </div>
            <Text className={clsx('flex-1 py-spacing-5 truncate ml-spacing-3', fontColor)} variant='h1-course'>
                {course.department} {course.number}
                {course.instructors.length > 0 ? <> &ndash; </> : ''}
                {course.instructors.map(v => v.toString({ format: 'last' })).join('; ')}
            </Text>
            {enableCourseStatusChips && course.status !== Status.OPEN && (
                <div
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                    className='ml-1 flex items-center justify-center justify-self-end rounded p-[3px] text-white'
                >
                    <StatusIcon status={course.status} className='h-6 w-6' />
                </div>
            )}

            <Button
                color='ut-gray'
                onClick={handleCopy}
                className='h-full max-h-[30px] w-fit gap-spacing-2 rounded py-spacing-2 text-white px-spacing-3!'
                style={{
                    backgroundColor: colors.secondaryColor,
                }}
            >
                <div className='relative h-5.5 w-5.5'>
                    <Check
                        className={clsx(
                            'absolute size-full  inset-0 text-white transition-all duration-250 ease-in-out',
                            isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                        )}
                    />
                    <Copy
                        weight='fill'
                        className={clsx(
                            'absolute size-full inset-0 text-white transition-all duration-250 ease-in-out',
                            isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                        )}
                    />
                </div>
                <Text variant='h2' className='text-base!'>
                    {course.uniqueId.toString().padStart(5, '0')}
                </Text>
            </Button>
        </div>
    );
}
