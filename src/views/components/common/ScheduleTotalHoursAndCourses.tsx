import type { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler, RefObject } from 'react';
import Text from '@views/components/common/Text/Text';

/**
 * Props for ScheduleTotalHoursAndCourses
 */
export interface ScheduleTotalHoursAndCoursesProps {
    scheduleName: string;
    totalHours: number;
    totalCourses: number;
    isEditingName?: boolean;
    editorValue?: string;
    onEditorChange?: ChangeEventHandler<HTMLInputElement>;
    onEditorBlur?: FocusEventHandler<HTMLInputElement>;
    onEditorKeyDown?: KeyboardEventHandler<HTMLInputElement>;
    editorRef?: RefObject<HTMLInputElement | null>;
    onScheduleNameDoubleClick?: () => void;
}

/**
 * The ScheduleTotalHoursAndCourses as per the Labels and Details Figma section
 *
 * @param scheduleName - The name of the schedule.
 * @param totalHours - The total number of hours.
 * @param totalCourses - The total number of courses.
 * @returns The rendered ScheduleTotalHoursAndCourses component.
 */
export default function ScheduleTotalHoursAndCourses({
    scheduleName,
    totalHours,
    totalCourses,
    isEditingName = false,
    editorValue,
    onEditorChange,
    onEditorBlur,
    onEditorKeyDown,
    editorRef,
    onScheduleNameDoubleClick,
}: ScheduleTotalHoursAndCoursesProps): JSX.Element {
    return (
        <div className='gap-0.5 grid'>
            {isEditingName ? (
                <Text
                    variant='h1'
                    as='input'
                    className='block min-w-0 w-full text-theme-black flex-initial overflow-hidden border-0 bg-transparent px-0 outline-blue-500'
                    value={editorValue ?? scheduleName}
                    onChange={onEditorChange}
                    onBlur={onEditorBlur}
                    onKeyDown={onEditorKeyDown}
                    ref={editorRef}
                />
            ) : (
                <Text
                    className='block truncate text-theme-black flex-initial overflow-hidden cursor-text'
                    variant='h1'
                    as='div'
                    onDoubleClick={onScheduleNameDoubleClick}
                >
                    {scheduleName}
                </Text>
            )}
            <Text variant='h4' as='p' className='text-ut-burntorange inline-flex gap-3'>
                <span>
                    {totalHours}&nbsp;
                    <span className='ml-0.5 uppercase'>{totalHours === 1 ? 'Hour' : 'Hours'}</span>
                </span>
                <span>
                    {totalCourses}&nbsp;
                    <span className='ml-0.5 uppercase'>{totalCourses === 1 ? 'Course' : 'Courses'}</span>
                </span>
            </Text>
        </div>
    );
}
