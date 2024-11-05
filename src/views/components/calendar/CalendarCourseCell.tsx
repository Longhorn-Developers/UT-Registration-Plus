import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import type { StatusType } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import { hexToRGB, pickFontColor } from '@shared/util/colors';
import Text from '@views/components/common/Text/Text';
import { useColorPickerContext } from '@views/contexts/ColorPickerContext';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import ClosedIcon from '~icons/material-symbols/lock';
import PaletteIcon from '~icons/material-symbols/palette';
import WaitlistIcon from '~icons/material-symbols/timelapse';
import CancelledIcon from '~icons/material-symbols/warning';

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
 * @component
 * @param {CalendarCourseCellProps} props - The component props.
 * @param {string} props.courseDeptAndInstr - The course department and instructor.
 * @param {string} props.timeAndLocation - The time and location of the course.
 * @param {StatusType} props.status - The status of the course.
 * @param {Colors} props.colors - The colors for styling the cell.
 * @param {string} props.className - Additional CSS class name for the cell.
 * @param {boolean} props.isInvertColorsToggled - Flag to indicate if colors should be inverted.
 * @returns {JSX.Element} The rendered component.
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
            rightIcon = <WaitlistIcon className='h-5 w-5' />;
        } else if (status === Status.CLOSED) {
            rightIcon = <ClosedIcon className='h-5 w-5' />;
        } else if (status === Status.CANCELLED) {
            rightIcon = <CancelledIcon className='h-5 w-5' />;
        }
    }

    // text-white or text-black based on secondaryColor
    const fontColor = pickFontColor(colors.primaryColor);
    // Note that overflow-hidden is the duct tape holding this all together

    // This function is used to determine the position of the color picker depending on the position of the cell
    const getPositionClass = () => {
        if (startIndex < 21) {
            return 'top-2 flex-col';
        }
        if (!selectedBlock) {
            return 'flex-col-reverse top-2';
        }
        return 'flex-col-reverse bottom-26'; // If the cell is near the bottom of the screen
    };

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
                    <Text variant='h3-course' as='p'>
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
                ref={colorPickerRef}
                onClick={e => {
                    e.stopPropagation();
                }}
                className={clsx(
                    'flex absolute text-black transition-all ease-in-out',
                    'group-focus-within:pointer-events-auto group-hover:pointer-events-auto group-focus-within:opacity-100 group-hover:opacity-100 gap-y-0.75',
                    dayIndex === 4 ? 'left-0 -translate-x-full pr-0.75 items-end' : 'right-0 translate-x-full pl-0.75', // If the cell is on the right side of the screen
                    selectedBlock ? 'opacity-100 pointer-events-auto' : 'opacity-0   pointer-events-none',
                    getPositionClass()
                )}
                style={{
                    // Prevents from button from appear on top of color picker
                    zIndex: selectedBlock ? 30 : 29,
                }}
            >
                <Button
                    onClick={() => {
                        if (selectedBlock) {
                            handleCloseColorPicker();
                        } else {
                            setSelectedCourse(courseID, dayIndex, startIndex);
                        }
                    }}
                    icon={PaletteIcon}
                    variant='filled'
                    className={clsx('size-8 border border-white rounded-full !p-1')}
                    color='ut-gray'
                    style={{
                        color: colors.secondaryColor,
                        backgroundColor: selectedCourse
                            ? (selectedColor ?? colors.primaryColor)
                            : `rgba(${hexToRGB(`${colors.primaryColor}`)}, var(--un-bg-opacity))`,
                    }}
                />

                {selectedBlock && <CourseCellColorPicker defaultColor={colors.primaryColor} />}
            </div>
        </div>
    );
}
