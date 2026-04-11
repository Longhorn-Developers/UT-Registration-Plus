import renameSchedule from '@pages/background/lib/renameSchedule';
import Text from '@views/components/common/Text/Text';
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';

/**
 * Props for ScheduleTotalHoursAndCourses
 */
export interface ScheduleTotalHoursAndCoursesProps {
    scheduleId?: string;
    scheduleName: string;
    totalHours: number;
    totalCourses: number;
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
    scheduleId,
    scheduleName,
    totalHours,
    totalCourses,
}: ScheduleTotalHoursAndCoursesProps): JSX.Element {
    const [isEditingName, setIsEditingName] = useState(false);
    const [displayName, setDisplayName] = useState(scheduleName);
    const [editorValue, setEditorValue] = useState(scheduleName);
    const editorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDisplayName(scheduleName);
        setEditorValue(scheduleName);
    }, [scheduleName]);

    useEffect(() => {
        if (!isEditingName) {
            return;
        }
        const editor = editorRef.current;
        if (editor) {
            editor.focus();
            editor.setSelectionRange(0, editor.value.length);
        }
    }, [isEditingName]);

    const handleBlur = useCallback(async () => {
        const trimmedName = editorValue.trim();
        if (!trimmedName) {
            setEditorValue(displayName);
            setIsEditingName(false);
            return;
        }

        if (trimmedName !== displayName && scheduleId) {
            const nextName = (await renameSchedule(scheduleId, trimmedName)) as string;
            if (nextName) {
                setDisplayName(nextName);
                setEditorValue(nextName);
            }
        } else {
            setEditorValue(displayName);
        }

        setIsEditingName(false);
    }, [displayName, editorValue, scheduleId]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setEditorValue(displayName);
            setIsEditingName(false);
        }
        if (e.key === 'Delete') {
            e.stopPropagation();
        }
    };

    return (
        <div className='gap-0.5 grid'>
            {isEditingName ? (
                <Text
                    variant='h1'
                    as='input'
                    className='block min-w-0 w-full text-theme-black flex-initial overflow-hidden border-0 bg-transparent px-0 outline-blue-500'
                    value={editorValue}
                    onChange={e => setEditorValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    ref={editorRef}
                />
            ) : (
                <Text
                    className='block truncate text-theme-black flex-initial overflow-hidden cursor-text'
                    variant='h1'
                    as='div'
                    onDoubleClick={() => {
                        if (!scheduleId) {
                            return;
                        }
                        setEditorValue(displayName);
                        setIsEditingName(true);
                    }}
                >
                    {displayName}
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
