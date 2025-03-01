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
        <div className='w-full flex pl-spacing-7 pr-spacing-3 pt-spacing-4'>
            <div
                className={clsx('flex flex-grow items-center gap-1 text-nowrap', {
                    'py-7.5': !displayCourses,
                })}
            >
                {displayCourses && (
                    <>
                        <Text variant='p' className='text-ut-black uppercase'>
                            Async / Other
                        </Text>
                        <Text variant='h4' className='text-theme-offwhite/50'>
                            —
                        </Text>
                        <div className='inline-flex gap-2.5'>
                            <ColorPickerProvider>
                                {asyncCourseCells.map(block => {
                                    const { courseDeptAndInstr, status, className } = block.componentProps;
                                    return (
                                        <CalendarCourseBlock
                                            key={block.course.uniqueId}
                                            courseDeptAndInstr={courseDeptAndInstr}
                                            status={status}
                                            className={clsx(className, 'w-35! h-12.5! items-center')}
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
