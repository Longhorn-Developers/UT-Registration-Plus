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
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from './Button';
import { SortableListDragHandle } from './SortableListDragHandle';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    colors: CourseColors;
}

const IS_STORYBOOK = import.meta.env.STORYBOOK;

const CourseMeeting = memo(
    ({ meeting, fontColor }: { meeting: Course['schedule']['meetings'][0]; fontColor: string }) => {
        const dateString = meeting.getDaysString({ format: 'short' });
        return (
            <Text key={dateString} className={clsx('flex-1 truncate select-none', fontColor)} variant='h3-course'>
                {`${dateString} ${meeting.getTimeString({ separator: '-' })}${
                    meeting.location ? `, ${meeting.location.building} ${meeting.location.room}` : ''
                }`}
            </Text>
        );
    }
);

/**
 * The "course block" to be used in the extension popup.
 *
 * @param className - The class name to apply to the component.
 * @param course - The course object to display.
 * @param colors - The colors to use for the course block.
 * @param dragHandleProps - The drag handle props for the course block.
 * @returns The rendered PopupCourseBlock component.
 */
export default function PopupCourseBlock({ className, course, colors }: PopupCourseBlockProps): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);

    const [isCopied, setIsCopied] = useState<boolean>(false);
    const lastCopyTime = useRef<number>(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initAllSettings = async () => {
            const { enableCourseStatusChips } = await initSettings();
            setEnableCourseStatusChips(enableCourseStatusChips);
        };

        initAllSettings();

        const l1 = OptionsStore.listen('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
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
        if (now - lastCopyTime.current < 500) {
            return;
        }

        lastCopyTime.current = now;
        await navigator.clipboard.writeText(formattedUniqueId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 500);
    };

    const meetings = useMemo(
        () =>
            course.schedule.meetings.map(meeting => (
                <CourseMeeting
                    key={meeting.getDaysString({ format: 'short' })}
                    meeting={meeting}
                    fontColor={fontColor}
                />
            )),
        [course.schedule.meetings, fontColor]
    );

    return (
        <div
            style={{
                backgroundColor: colors.primaryColor,
            }}
            className={clsx(
                'w-full inline-flex items-center justify-center gap-1 rounded focusable cursor-pointer text-left hover:shadow-md ease-out group-[.is-dragging]:shadow-md min-h-[55px]',
                className
            )}
            onClick={handleClick}
            ref={ref}
        >
            {IS_STORYBOOK ? (
                <div
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                    className='flex cursor-move items-center self-stretch rounded rounded-r-0 px-spacing-2'
                >
                    <DotsSixVertical weight='bold' className='h-6 w-6 cursor-move text-white' />
                </div>
            ) : (
                <SortableListDragHandle
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                    className='flex cursor-move items-center self-stretch rounded rounded-r-0 px-spacing-2'
                >
                    <DotsSixVertical weight='bold' className='h-6 w-6 cursor-move text-white' />
                </SortableListDragHandle>
            )}
            <div className='h-full flex flex-1 justify-center gap-spacing-3 p-spacing-3'>
                <div className='flex flex-1 flex-col justify-center gap-spacing-1'>
                    <Text
                        className={clsx(
                            `truncate select-none justify-center ${meetings.length > 0 ? 'mb-auto' : 'my-auto'}`,
                            fontColor
                        )}
                        variant='h1-course'
                    >
                        {course.department} {course.number}
                        {course.instructors.length > 0 ? <> &ndash; </> : ''}
                        {course.instructors.map(v => v.toString({ format: 'last' })).join('; ')}
                    </Text>
                    <div className='flex flex-col'>{meetings}</div>
                </div>
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
                <div className='flex flex-col justify-center'>
                    <Button
                        color='ut-gray'
                        onClick={handleCopy}
                        className='h-full max-h-[30px] max-w-fit gap-spacing-2 rounded text-white px-spacing-3! py-spacing-2!'
                        style={{
                            backgroundColor: colors.secondaryColor,
                        }}
                    >
                        <div className='relative h-[21px] w-[21px]'>
                            <Check
                                className={clsx(
                                    'absolute size-full inset-0 text-white transition-all duration-250 ease-in-out',
                                    isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                )}
                            />
                            <Copy
                                weight='fill'
                                className={clsx(
                                    'absolute size-full inset-0 text-white transition-all duration-250 ease-in-out select-none',
                                    isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                                )}
                            />
                        </div>
                        <Text variant='h2' className='select-none text-base!'>
                            {formattedUniqueId}
                        </Text>
                    </Button>
                </div>
            </div>
        </div>
    );
}
