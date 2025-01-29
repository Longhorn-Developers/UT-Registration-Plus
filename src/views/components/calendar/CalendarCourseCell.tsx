import { ClockUser, LockKey, Palette, Prohibit } from '@phosphor-icons/react';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import { hexToRGB, pickFontColor } from '@shared/util/colors';
import Text from '@views/components/common/Text/Text';
import { useColorPickerContext } from '@views/contexts/ColorPickerContext';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '../common/Button';
import CourseCellColorPicker from './CalendarCourseCellColorPicker/CourseCellColorPicker';

/**
 * Props for the CalendarCourseCell component.
 */
export interface CalendarCourseCellProps {
    courseDeptAndInstr: string;
    timeAndLocation?: string;
    status: StatusType;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    blockData: CalendarGridCourse;
    className?: string;
}

/**
 * Renders a cell for a calendar course.
 *
 * @param courseDeptAndInstr - The course department and instructor.
 * @param timeAndLocation - The time and location of the course.
 * @param status - The status of the course.
 * @param colors - The colors for styling the cell.
 * @param className - Additional CSS class name for the cell.
 * @returns The rendered component.
 */
export default function CalendarCourseCell({
    courseDeptAndInstr,
    timeAndLocation,
    status,
    onClick,
    blockData,
    className,
}: CalendarCourseCellProps): JSX.Element {
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const { selectedColor, setSelectedCourse, handleCloseColorPicker, isSelectedBlock, isSelectedCourse } =
        useColorPickerContext();

    const { colors, uniqueId: courseID } = blockData.course;
    const { dayIndex, startIndex } = blockData.calendarGridPoint;

    let selectedCourse = false;
    let selectedBlock = false;

    if (isSelectedCourse && isSelectedBlock) {
        selectedCourse = isSelectedCourse(courseID);
        selectedBlock = isSelectedBlock(courseID, dayIndex, startIndex);
    }

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (selectedBlock && colorPickerRef.current) {
                const path = event.composedPath();
                const isClickOutside = !path.some(
                    element => (element as HTMLElement).classList === colorPickerRef.current?.classList
                );

                if (isClickOutside) {
                    handleCloseColorPicker();
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleCloseColorPicker, selectedBlock]);

    let rightIcon: React.ReactNode | null = null;
    if (enableCourseStatusChips) {
        if (status === Status.WAITLISTED) {
            rightIcon = <ClockUser weight='fill' className='h-5 w-5' />;
        } else if (status === Status.CLOSED) {
            rightIcon = <LockKey weight='fill' className='h-5 w-5' />;
        } else if (status === Status.CANCELLED) {
            rightIcon = <Prohibit weight='fill' className='h-5 w-5' />;
        }
    }

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    // Note that overflow-hidden is the duct tape holding this all together

    return (
        <div
            className={clsx(
                'h-full w-0 flex group relative justify-center rounded p-x-2 p-y-1.2 cursor-pointer screenshot:p-1.5 hover:shadow-md transition-shadow-100 ease-out',
                {
                    'min-w-full': timeAndLocation,
                    'w-full': !timeAndLocation,
                },
                fontColor,
                className
            )}
            style={{
                backgroundColor: colors.primaryColor,
            }}
            onClick={onClick}
        >
            <div className={clsx('flex flex-1 flex-col gap-0.25 overflow-hidden max-h-full')}>
                <Text
                    variant='h1-course'
                    as='p'
                    className={clsx('leading-tight! truncate overflow-clip!', {
                        '-mb-0.2': timeAndLocation,
                        'text-wrap': !timeAndLocation,
                    })}
                >
                    {courseDeptAndInstr}
                </Text>
                {timeAndLocation && (
                    <Text variant='h3-course' as='p' className='whitespace-pre-line'>
                        {timeAndLocation}
                    </Text>
                )}
            </div>
            {rightIcon && (
                <div
                    className='h-fit flex items-center justify-center justify-self-start rounded p-0.5 text-white screenshot:hidden'
                    style={{
                        backgroundColor: colors.secondaryColor,
                    }}
                >
                    {rightIcon}
                </div>
            )}

            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className={clsx(
                    'absolute screenshot:opacity-0! text-black transition-all ease-in-out group-focus-within:pointer-events-auto group-hover:pointer-events-auto group-focus-within:opacity-100 group-hover:opacity-100 gap-y-0.75',
                    dayIndex === 4 ? 'left-0 -translate-x-full pr-0.75 items-end' : 'right-0 translate-x-full pl-0.75', // If the cell is on the right side of the screen
                    selectedBlock ? 'opacity-100 pointer-events-auto' : 'opacity-0   pointer-events-none'
                )}
                style={{
                    // Prevents from button from appear on top of color picker
                    zIndex: selectedBlock ? 30 : 29,
                }}
            >
                <div className={clsx('relative', dayIndex === 4 && 'flex flex-col items-end')}>
                    <Button
                        onClick={() => {
                            if (selectedBlock) {
                                handleCloseColorPicker();
                            } else {
                                setSelectedCourse(courseID, dayIndex, startIndex);
                            }
                        }}
                        icon={Palette}
                        iconProps={{
                            fill: colors.secondaryColor,
                            weight: 'fill',
                        }}
                        variant='outline'
                        className={clsx(
                            'size-8.5! border border-white rounded-full !p-1 bg-opacity-100 !hover:enabled:bg-opacity-100 rounded-full shadow-lg shadow-black/20'
                        )}
                        color='ut-gray'
                        style={{
                            color: colors.secondaryColor,
                            backgroundColor: selectedCourse
                                ? (selectedColor ?? colors.primaryColor)
                                : `rgba(${hexToRGB(`${colors.primaryColor}`)}, var(--un-bg-opacity))`,
                        }}
                    />

                    {selectedBlock && (
                        <div
                            ref={colorPickerRef}
                            className={
                                startIndex < 21 && !blockData.async
                                    ? 'relative top-0.75 w-max'
                                    : 'absolute bottom-full mb-0.75 w-max'
                            }
                        >
                            <CourseCellColorPicker defaultColor={colors.primaryColor} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
