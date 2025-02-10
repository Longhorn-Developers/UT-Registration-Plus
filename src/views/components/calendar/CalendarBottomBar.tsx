import type { Course } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import { ColorPickerProvider } from '@views/contexts/ColorPickerContext';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import React from 'react';

import CalendarCourseBlock from './CalendarCourseCell';

type CalendarBottomBarProps = {
    courseCells?: CalendarGridCourse[];
    setCourse: React.Dispatch<React.SetStateAction<Course | null>>;
};

/**
 * Renders the bottom bar of the calendar component.
 *
 * @param courses - The list of courses to display in the calendar.
 * @returns The rendered bottom bar component.
 */
export default function CalendarBottomBar({ courseCells, setCourse }: CalendarBottomBarProps): JSX.Element {
    const asyncCourseCells = courseCells?.filter(block => block.async);
    const displayCourses = asyncCourseCells && asyncCourseCells.length > 0;

    return (
        <div className='w-full flex py-1.25 pl-7.5 pr-6.25'>
            <div
                className={clsx('flex flex-grow items-center gap-3.75 text-nowrap', {
                    'py-7.5': !displayCourses,
                })}
            >
                {displayCourses && (
                    <>
                        <Text variant='p' className='text-ut-black'>
                            ASYNC / OTHER
                        </Text>
                        <Text variant='h4' className='text-gray-300'>
                            —
                        </Text>
                        <div className='inline-flex gap-2.5'>
                            <ColorPickerProvider>
                                {asyncCourseCells.map(block => {
                                    const { courseDeptAndInstr, status, className } = block.componentProps;
                                    return (
                                        <CalendarCourseBlock
                                            courseDeptAndInstr={courseDeptAndInstr}
                                            status={status}
                                            key={courseDeptAndInstr}
                                            className={clsx(className, 'w-35! h-15!')}
                                            onClick={() => setCourse(block.course)}
                                            blockData={block}
                                        />
                                    );
                                })}
                            </ColorPickerProvider>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
