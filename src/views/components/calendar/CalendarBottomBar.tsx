import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import CourseStatus from '@views/components/common/CourseStatus';
import Text from '@views/components/common/Text/Text';
import { ColorPickerProvider } from '@views/contexts/ColorPickerContext';
import type { CalendarGridCourse } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';

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
export default function CalendarBottomBar({ courseCells, setCourse }: CalendarBottomBarProps): ReactNode {
    const asyncCourseCells = courseCells?.filter(block => block.async);
    const displayCourses = asyncCourseCells && asyncCourseCells.length > 0;
    const [enableCourseStatusChips, setEnableCourseStatusChips] = useState<boolean>(false);

    useEffect(() => {
        initSettings().then(({ enableCourseStatusChips }) => setEnableCourseStatusChips(enableCourseStatusChips));

        const unsubscribe = OptionsStore.subscribe('enableCourseStatusChips', async ({ newValue }) => {
            setEnableCourseStatusChips(newValue);
        });

        return () => {
            OptionsStore.unsubscribe(unsubscribe);
        };
    }, []);

    if (!displayCourses) return null;

    return (
        <div className='w-full flex items-center justify-between pl-spacing-7 pr-spacing-3 pt-spacing-4'>
            <div className='flex flex-grow items-center gap-1 text-nowrap'>
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
            </div>
            {enableCourseStatusChips && (
                <div className='flex items-center gap-4 pr-spacing-3'>
                    <CourseStatus status={Status.WAITLISTED} size='mini' />
                    <CourseStatus status={Status.CLOSED} size='mini' />
                    <CourseStatus status={Status.CANCELLED} size='mini' />
                </div>
            )}
        </div>
    );
}
