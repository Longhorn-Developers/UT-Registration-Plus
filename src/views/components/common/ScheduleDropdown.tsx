import { CaretDown, CaretUp, DotsSixVertical, Plus, Trash } from '@phosphor-icons/react';
import deleteSchedule from '@pages/background/lib/deleteSchedule';
import renameSchedule from '@pages/background/lib/renameSchedule';
import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { SortableList } from '@views/components/common/SortableList';
import { SortableListDragHandle } from '@views/components/common/SortableListDragHandle';
import Text from '@views/components/common/Text/Text';
import { useEffect, useRef, useState } from 'react';

import PopupCourseBlock from './PopupCourseBlock';
import { Button } from './Button';
import DialogProvider, { usePrompt } from './DialogProvider/DialogProvider';

/**
 * Props for the Dropdown component.
 */
export type ScheduleDropdownProps = {
    schedules: UserSchedule[];
    activeScheduleId: string;
    onScheduleClick(scheduleId: string): void;
    onReorder(reordered: UserSchedule[]): void;
    onAddSchedule(): void;
    getEmptyMessage(scheduleId: string): string;
};

/**
 * This is a reusable dropdown component that can be used to toggle the visiblity of information
 */
type ScheduleRowProps = {
    isActive: boolean;
    schedule: UserSchedule;
    isExpanded: boolean;
    isDeleteMode: boolean;
    onToggleExpand(scheduleId: string): void;
    onDelete(schedule: UserSchedule): void;
    onReorderCourses(scheduleId: string, reordered: Course[]): void;
    emptyMessage: string;
};

function ScheduleRow({
    isActive,
    schedule,
    isExpanded,
    isDeleteMode,
    onToggleExpand,
    onDelete,
    onReorderCourses,
    emptyMessage,
}: ScheduleRowProps): JSX.Element {
    const hasNoCourses = schedule.courses.length === 0;
    const [isEditing, setIsEditing] = useState(false);
    const [editorValue, setEditorValue] = useState(schedule.name);
    const editorRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEditorValue(schedule.name);
    }, [schedule.name]);

    useEffect(() => {
        if (isEditing && editorRef.current) {
            editorRef.current.focus();
            editorRef.current.setSelectionRange(0, editorRef.current.value.length);
        }
    }, [isEditing]);

    const handleRenameBlur = async () => {
        const trimmedName = editorValue.trim();
        if (trimmedName !== '' && trimmedName !== schedule.name) {
            await renameSchedule(schedule.id, trimmedName);
        }
        setIsEditing(false);
    };

    return (
        <div className={isDeleteMode ? 'group/delete-row flex flex-col w-full' : 'flex flex-col w-full'}>
            <div
                className={`w-full flex items-stretch overflow-hidden border border-ut-offwhite/50 rounded transition-colors ${
                    isDeleteMode
                        ? 'bg-white hover:border-theme-red hover:bg-theme-red/50'
                        : isExpanded
                          ? 'bg-ut-burntorange/10'
                          : 'bg-white hover:bg-ut-burntorange/5'
                }`}
                aria-current={isActive}
            >
                <SortableListDragHandle className='self-stretch w-7.5 flex cursor-move items-center justify-center border-r border-ut-offwhite/50'>
                    <DotsSixVertical
                        weight='bold'
                        className={`h-6 w-6 btn-transition ${
                            isDeleteMode
                                ? 'text-zinc-300 group-hover/delete-row:text-white'
                                : 'text-zinc-300 hover:text-zinc-400'
                        }`}
                    />
                </SortableListDragHandle>
                <button
                    type='button'
                    className='w-full flex items-center justify-between border-none bg-transparent px-3.5 py-2.5 text-left'
                    onClick={() => {
                        if (isDeleteMode) {
                            onDelete(schedule);
                            return;
                        }
                        if (!isEditing) {
                            onToggleExpand(schedule.id);
                        }
                    }}
                >
                    <div className='min-w-0 flex-1 overflow-hidden'>
                        {isEditing ? (
                            <Text
                                variant='h3'
                                as='input'
                                ref={editorRef}
                                className='min-w-[4ch] max-w-full bg-transparent px-0 outline-blue-500 text-ut-burntorange normal-case!'
                                style={{ width: `${Math.max(editorValue.length + 2, 3)}ch` }}
                                value={editorValue}
                                onChange={e => setEditorValue(e.target.value)}
                                onBlur={handleRenameBlur}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        e.currentTarget.blur();
                                    }
                                    if (e.key === 'Escape') {
                                        setEditorValue(schedule.name);
                                        setIsEditing(false);
                                    }
                                }}
                            />
                        ) : (
                            <Text
                                as='div'
                                variant='h3'
                                className={`inline-block max-w-full overflow-hidden text-ellipsis whitespace-nowrap normal-case! ${
                                    isDeleteMode
                                        ? 'text-ut-burntorange group-hover/delete-row:text-white'
                                        : 'text-ut-burntorange'
                                }`}
                                onClick={e => {
                                    if (isDeleteMode) {
                                        return;
                                    }
                                    // Single-click the title to enter rename mode without toggling accordion.
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                            >
                                {schedule.name}
                            </Text>
                        )}
                        <div
                            className={`flex gap-2.5 leading-[75%]! ${
                                isDeleteMode ? 'text-theme-black group-hover/delete-row:text-white' : 'text-theme-black'
                            }`}
                        >
                            <div className='flex gap-1.25'>
                                <Text variant='h4'>{schedule.hours}</Text>
                                <Text variant='h4' className='font-all-small-caps!'>
                                    {schedule.hours === 1 ? 'HOUR' : 'HOURS'}
                                </Text>
                            </div>
                            <div className='flex gap-1.25'>
                                <Text variant='h4'>{schedule.courses.length}</Text>
                                <Text variant='h4' className='font-all-small-caps!'>
                                    {schedule.courses.length === 1 ? 'COURSE' : 'COURSES'}
                                </Text>
                            </div>
                        </div>
                    </div>
                    <Text
                        className={`text-2xl! font-normal! ${
                            isDeleteMode ? 'text-theme-red group-hover/delete-row:text-white' : 'text-ut-burntorange'
                        }`}
                    >
                        {isDeleteMode ? <Trash weight='fill' /> : isExpanded ? <CaretUp weight='fill' /> : <CaretDown weight='fill' />}
                    </Text>
                </button>
            </div>
            {isExpanded && (
                <div
                    className={`w-full border border-t-0 border-ut-offwhite/50 rounded-b overflow-hidden ${
                        isDeleteMode
                            ? 'bg-white group-hover/delete-row:bg-theme-red/50 group-hover/delete-row:border-theme-red'
                            : 'bg-white'
                    }`}
                >
                    {hasNoCourses ? (
                        <div className='flex flex-col items-center gap-1.25 px-4 py-5'>
                            <Text
                                variant='p'
                                className={`text-center !font-normal ${
                                    isDeleteMode ? 'text-ut-gray group-hover/delete-row:text-white' : 'text-ut-gray'
                                }`}
                            >
                                {emptyMessage}
                            </Text>
                            <Text
                                variant='small'
                                className={`text-center ${
                                    isDeleteMode ? 'text-ut-black group-hover/delete-row:text-white' : 'text-ut-black'
                                }`}
                            >
                                (No courses added)
                            </Text>
                        </div>
                    ) : (
                        <div className='p-2.5'>
                            <SortableList
                                draggables={schedule.courses.map(course => ({
                                    id: course.uniqueId,
                                    course,
                                }))}
                                onChange={reordered => {
                                    onReorderCourses(schedule.id, reordered.map(({ course }) => course));
                                }}
                                renderItem={({ id, course }) => (
                                    <PopupCourseBlock key={id} course={course} colors={course.colors} />
                                )}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ScheduleDropdownInner({
    schedules,
    activeScheduleId,
    onScheduleClick,
    onReorder,
    onAddSchedule,
    getEmptyMessage,
}: ScheduleDropdownProps) {
    const scheduleCountLabel = schedules.length === 1 ? 'SCHEDULE' : 'SCHEDULES';
    const [expandedScheduleIds, setExpandedScheduleIds] = useState<Set<string>>(new Set<string>());
    const [isDraggingSchedule, setIsDraggingSchedule] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const showDialog = usePrompt();

    const handleToggleExpand = (scheduleId: string) => {
        const newExpandedIds = new Set(expandedScheduleIds);
        if (newExpandedIds.has(scheduleId)) {
            newExpandedIds.delete(scheduleId);
        } else {
            newExpandedIds.add(scheduleId);
        }
        setExpandedScheduleIds(newExpandedIds);
        // Also switch to this schedule as the active one
        onScheduleClick(scheduleId);
    };

    const handleReorderCourses = (scheduleId: string, reorderedCourses: UserSchedule['courses']) => {
        const updatedSchedule = schedules.find(s => s.id === scheduleId);
        if (updatedSchedule) {
            updatedSchedule.courses = reorderedCourses;
            // Reorder the schedule in the main list (using onReorder to persist)
            onReorder(schedules);
        }
    };

    const handleDeleteSchedule = (schedule: UserSchedule) => {
        if (schedule.courses.length <= 0) {
            deleteSchedule(schedule.id);
            return;
        }

        showDialog({
            title: 'Delete schedule?',
            description: (
                <>
                    <Text>Deleting </Text>
                    <Text className='text-ut-burntorange'>{schedule.name}</Text>
                    <Text> is permanent and will remove all added courses from </Text>
                    <Text className='text-ut-burntorange'>{schedule.name}</Text>
                    <Text>.</Text>
                </>
            ),
            buttons: close => (
                <>
                    <Button variant='minimal' color='ut-black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        variant='filled'
                        color='theme-red'
                        icon={Trash}
                        onClick={() => {
                            close();
                            deleteSchedule(schedule.id);
                        }}
                    >
                        Delete permanently
                    </Button>
                </>
            ),
        });
    };

    return (
        <div className='h-full min-h-0 flex flex-col rounded bg-white'>
            <div className='px-3.5 pb-2.5 pt-2 w-full flex items-center justify-between'>
                <Text variant='h3' className='text-ut-black'>
                    {schedules.length} {scheduleCountLabel}
                </Text>
                <div className='flex items-center gap-1.25'>
                    <Button
                        variant={isDeleteMode ? 'outline' : 'minimal'}
                        size='small'
                        color={isDeleteMode ? 'theme-red' : 'ut-black'}
                        onClick={() => setIsDeleteMode(mode => !mode)}
                        icon={Trash}
                        className={
                            isDeleteMode
                                ? 'bg-theme-red/10 border-theme-red text-theme-red hover:bg-theme-red/50'
                                : 'text-ut-black hover:text-theme-red hover:bg-theme-red/50'
                        }
                        title='Toggle delete mode'
                    />
                    <Button variant='minimal' size='small' color='ut-black' onClick={onAddSchedule} icon={Plus} />
                </div>
            </div>
            <div className='flex-1 min-h-0 overflow-y-auto px-1.75 pb-2.5'>
                <SortableList
                    draggables={schedules}
                    className='gap-2'
                    onChange={onReorder}
                    onDragStateChange={({ isDragging }) => {
                        setIsDraggingSchedule(isDragging);
                    }}
                    renderItem={schedule => (
                        <ScheduleRow
                            key={schedule.id}
                            schedule={schedule}
                            isActive={schedule.id === activeScheduleId}
                            isExpanded={!isDraggingSchedule && expandedScheduleIds.has(schedule.id)}
                            isDeleteMode={isDeleteMode}
                            onToggleExpand={handleToggleExpand}
                            onDelete={handleDeleteSchedule}
                            onReorderCourses={handleReorderCourses}
                            emptyMessage={getEmptyMessage(schedule.id)}
                        />
                    )}
                />
            </div>
        </div>
    );
}

export default function ScheduleDropdown(props: ScheduleDropdownProps) {
    return (
        <DialogProvider>
            <ScheduleDropdownInner {...props} />
        </DialogProvider>
    );
}
