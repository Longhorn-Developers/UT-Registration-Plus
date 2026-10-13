import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import Text from '@views/components/common/Text/Text';
import { ColorPickerProvider } from '@views/contexts/ColorPickerContext';
import { useSentryScope } from '@views/contexts/SentryContext';
import {
    type CalendarGridCourse,
    type CalendarPreviewCell,
    GRID_DEFAULT_END,
    GRID_DEFAULT_START,
} from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import type React from 'react';
import { Fragment } from 'react';

import CalendarCell from './CalendarGridCell';
import { calculateCourseCellColumns } from './utils';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const IS_STORYBOOK = import.meta.env.STORYBOOK;
const _DEFAULT_START_HOUR = GRID_DEFAULT_START / 60; // 8 AM

interface Props {
    courseCells?: CalendarGridCourse[];
    /** A course's meetings to draw faintly over the schedule, like a section hovered over in the Course Finder */
    previewCells?: CalendarPreviewCell[];
    startMinutes?: number;
    endMinutes?: number;
    saturdayClass?: boolean;
    setCourse: (course: Course) => void;
}

function CalendarHour({ hour }: { hour: number }) {
    return (
        <div className='grid-row-span-2 pr-2'>
            <Text variant='small' className='inline-block w-full text-right -translate-y-2.25'>
                {(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}
            </Text>
        </div>
    );
}

function makeGridRow(row: number, cols: number, hoursOfDay: number[]): React.JSX.Element {
    // biome-ignore lint/style/noNonNullAssertion: TODO:
    const hour = hoursOfDay[row]!;

    return (
        <Fragment key={row}>
            <CalendarHour hour={hour} />
            <div className='grid-row-span-2 w-4 border-b border-r border-gray-300' />
            {[...Array(cols).keys()].map(col => (
                <CalendarCell key={`${row}${col}`} row={row} col={col} />
            ))}
        </Fragment>
    );
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 *
 * @param courseCells - The courses to display on the calendar
 * @param previewCells - The meetings of a course to preview over the calendar, without adding it
 * @param saturdayClass - Whether the user has a Saturday class
 * @param setCourse - Function to set the course to display in the course details panel
 * @returns The CalendarGrid component
 */
export default function CalendarGrid({
    courseCells,
    previewCells,
    saturdayClass: _saturdayClass,
    setCourse,
    startMinutes,
    endMinutes,
}: React.PropsWithChildren<Props>): React.JSX.Element {
    // there was a huge mishap with 6 am start time calc here and now it is smoothly done
    // let's try to keep our codebase organized and not so all over the place
    const visualStartHour = Math.floor((startMinutes ?? GRID_DEFAULT_START) / 60);

    const visualEndHour = Math.ceil((endMinutes ?? GRID_DEFAULT_END) / 60);
    const hoursOfDay = Array.from({ length: visualEndHour - visualStartHour }, (_, i) => i + visualStartHour);
    const totalRows = (visualEndHour - visualStartHour) * 2;

    return (
        <div
            className='grid grid-cols-[auto_auto_repeat(5,1fr)] h-full'
            style={{
                gridTemplateRows: `auto auto repeat(${totalRows}, 1fr)`,
            }}
        >
            {/* Cover top left corner of grid, so time gets cut off at the top of the partial border */}
            <div className='sticky top-[75px] z-10 col-span-2 h-3 bg-white' />

            {daysOfWeek.map(day => (
                <div
                    // Full height with background to prevent grid lines from showing behind
                    className='sticky top-[75px] z-10 row-span-2 h-7 flex flex-col items-end self-start justify-end bg-white'
                    key={day}
                >
                    {/* Partial border height because that's what Isaiah wants */}
                    <div className='h-4 w-full flex items-end border-b border-r border-gray-300'>
                        {/* Alignment for text */}
                        <div className='h-[calc(1.75rem_-_1px)] w-full flex items-center justify-center'>
                            <Text variant='small' className='text-center text-ut-burntorange' as='div'>
                                {day}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}

            <div />
            {/* time tick for the first hour */}
            <div className='h-4 w-4 self-end border-b border-r border-gray-300' />

            {hoursOfDay.map((_, i) => makeGridRow(i, 5, hoursOfDay))}

            <ColorPickerProvider>
                {courseCells && <AccountForCourseConflicts courseCells={courseCells} setCourse={setCourse} />}
            </ColorPickerProvider>

            {previewCells?.map((cell, i) => (
                // Over the course cells at the full width of the day, rather than splitting it with them, so the
                // schedule doesn't shift around while sections are previewed. Keyed by position, since two of a
                // course's meetings can start in the same half hour.
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: the cells have nothing else unique to them
                    key={i}
                    aria-hidden
                    style={{
                        gridColumn: `${cell.calendarGridPoint.dayIndex + 3}`,
                        gridRow: `${cell.calendarGridPoint.startIndex} / ${cell.calendarGridPoint.endIndex}`,
                    }}
                    className='pointer-events-none z-1 pb-1 pr-2.5 screenshot:hidden'
                >
                    <PreviewCourseCell cell={cell} />
                </div>
            ))}
        </div>
    );
}

// Hatched, so a conflict reads as one even where the colors are hard to tell apart. Light enough that the red text
// over it keeps its contrast.
const CONFLICT_HATCHING = 'repeating-linear-gradient(135deg, rgb(209 0 0 / 0.07) 0 6px, transparent 6px 12px)';

/**
 * A faint, dashed outline of a course meeting that isn't in the schedule. One that conflicts with the schedule is
 * red and hatched instead, says what it conflicts with, and has a strikethrough if conflicts are highlighted elsewhere.
 */
function PreviewCourseCell({ cell }: { cell: CalendarPreviewCell }): React.JSX.Element {
    const highlightConflicts = OptionsStore.useStore(store => store.enableHighlightConflicts);
    const { courseDeptAndInstr, timeAndLocation } = cell.componentProps;
    const isConflicting = cell.conflicts.length > 0;

    return (
        <div
            className={clsx(
                'h-full w-full flex flex-col gap-0.25 overflow-hidden rounded border-2 border-dashed px-2 py-1',
                isConflicting
                    ? 'border-theme-red bg-white text-theme-red'
                    : 'border-ut-burntorange/70 bg-ut-burntorange/10 text-ut-black/80'
            )}
            style={isConflicting ? { backgroundImage: CONFLICT_HATCHING } : undefined}
        >
            <Text
                variant='h1-course'
                as='p'
                className={clsx('leading-tight! truncate overflow-clip!', {
                    'line-through': isConflicting && highlightConflicts,
                })}
            >
                {courseDeptAndInstr}
            </Text>
            <Text variant='h3-course' as='p' className='whitespace-pre-line'>
                {isConflicting
                    ? `Conflicts with ${cell.conflicts.map(c => `${c.department} ${c.number}`).join(', ')}`
                    : timeAndLocation}
            </Text>
        </div>
    );
}

interface AccountForCourseConflictsProps {
    courseCells: CalendarGridCourse[];
    setCourse: (course: Course) => void;
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({ courseCells, setCourse }: AccountForCourseConflictsProps): React.JSX.Element[] {
    // Sentry is not defined in storybook.
    // This is a valid use case for a condition hook, since IS_STORYBOOK is determined at build time,
    // it doesn't change between renders.
    // biome-ignore lint/correctness/useHookAtTopLevel: See above
    const sentryScope = IS_STORYBOOK ? undefined : useSentryScope();

    //  Groups by dayIndex to identify overlaps
    const days = courseCells.reduce(
        (acc, cell: CalendarGridCourse) => {
            const { dayIndex } = cell.calendarGridPoint;
            if (acc[dayIndex] === undefined) {
                acc[dayIndex] = [];
            }
            acc[dayIndex]?.push(cell);
            return acc;
        },
        {} as Record<number, CalendarGridCourse[]>
    );
    // Check for overlaps within each day and adjust gridColumnIndex and totalColumns
    Object.values(days).forEach((dayCells: CalendarGridCourse[], _idx) => {
        try {
            calculateCourseCellColumns(dayCells);
        } catch (error) {
            console.error(error);
            if (sentryScope) {
                sentryScope.captureException(error);
            }
        }
    });

    return courseCells
        .filter(block => !block.async)
        .map(block => {
            const { courseDeptAndInstr, timeAndLocation, status } = block.componentProps;

            return (
                <div
                    key={`${JSON.stringify(block)}`}
                    style={{
                        gridColumn: `${block.calendarGridPoint.dayIndex + 3}`,
                        gridRow: `${block.calendarGridPoint.startIndex} / ${block.calendarGridPoint.endIndex}`,
                        width: `calc(100% / ${block.totalColumns ?? 1})`,
                        marginLeft: `calc(100% * ${((block.gridColumnStart ?? 0) - 1) / (block.totalColumns ?? 1)})`,
                    }}
                    className='pb-1 pl-0 pr-2.5 pt-0 screenshot:pb-0.5 screenshot:pr-0.5'
                >
                    <CalendarCourseCell
                        courseDeptAndInstr={courseDeptAndInstr}
                        timeAndLocation={timeAndLocation}
                        status={status}
                        onClick={() => setCourse(block.course)}
                        blockData={block}
                    />
                </div>
            );
        });
}
