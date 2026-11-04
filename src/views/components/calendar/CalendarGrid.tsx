import { Popover, PopoverButton } from '@headlessui/react';
import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import { DAY_MAP } from '@shared/types/CourseMeeting';
import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';
import CalendarCourseCell from '@views/components/calendar/CalendarCourseCell';
import Text from '@views/components/common/Text/Text';
import { ColorPickerProvider } from '@views/contexts/ColorPickerContext';
import { useSentryScope } from '@views/contexts/SentryContext';
import {
    type CalendarGridCourse,
    type CalendarLayoutCell,
    type CalendarPreviewCell,
    convertMinutesToIndex,
    GRID_DEFAULT_END,
    GRID_DEFAULT_START,
} from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import type React from 'react';
import { Fragment, useRef } from 'react';
import CalendarBlockCreator from './CalendarBlockCreator';
import CalendarCustomBlockCell, { CustomBlockColorPicker } from './CalendarCustomBlockCell';
import { CalendarGridBounds } from './CalendarGridBounds';
import CalendarCell from './CalendarGridCell';
import { calculateCourseCellColumns, calendarCellPosition } from './utils';

const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const IS_STORYBOOK = import.meta.env.STORYBOOK;
const _DEFAULT_START_HOUR = GRID_DEFAULT_START / 60; // 8 AM

interface Props {
    onCreateBlock?: (draft: CustomBlockDraft) => void | Promise<void>;
    customBlocks?: CustomBlock[];
    renderBlockEditor?: (block: CustomBlock, close: () => void) => React.ReactNode;
    courseCells?: CalendarGridCourse[];
    /** A course's meetings to draw faintly over the schedule, like a section hovered over in the Course Finder */
    previewCells?: CalendarPreviewCell[];
    /**
     * A course in the schedule to point out, like a section hovered over in the Course Finder that's already added:
     * outlined, or marked for removal while its remove button is hovered over
     */
    highlight?: { course: Course; isRemoving: boolean } | null;
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
            <div className='grid-row-span-2 w-4 border-b border-r border-divider' />
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
 * @param highlight - A course in the schedule to outline, or to mark for removal
 * @param saturdayClass - Whether the user has a Saturday class
 * @param setCourse - Function to set the course to display in the course details panel
 * @returns The CalendarGrid component
 */
export default function CalendarGrid({
    onCreateBlock,
    customBlocks = [],
    renderBlockEditor,
    courseCells,
    previewCells,
    highlight,
    saturdayClass: _saturdayClass,
    setCourse,
    startMinutes,
    endMinutes,
}: React.PropsWithChildren<Props>): React.JSX.Element {
    const gridRef = useRef<HTMLDivElement>(null);
    // there was a huge mishap with 6 am start time calc here and now it is smoothly done
    // let's try to keep our codebase organized and not so all over the place
    const visualStartHour = Math.floor((startMinutes ?? GRID_DEFAULT_START) / 60);

    const visualEndHour = Math.ceil((endMinutes ?? GRID_DEFAULT_END) / 60);
    const hoursOfDay = Array.from({ length: visualEndHour - visualStartHour }, (_, i) => i + visualStartHour);
    const totalRows = (visualEndHour - visualStartHour) * 2;
    const days = daysOfWeek;
    const blockCells = customBlocks.flatMap(block =>
        block.days.map(day => ({
            block,
            async: false,
            calendarGridPoint: {
                dayIndex: Object.values(DAY_MAP).indexOf(day),
                startIndex: convertMinutesToIndex(
                    block.allDay ? visualStartHour * 60 : block.startTime,
                    visualStartHour * 60
                ),
                endIndex: convertMinutesToIndex(
                    block.allDay ? visualEndHour * 60 : block.endTime,
                    visualStartHour * 60
                ),
            },
        }))
    );

    return (
        <div
            ref={gridRef}
            className='grid h-full'
            style={{
                gridTemplateColumns: `auto auto repeat(${days.length}, minmax(0, 1fr))`,
                gridTemplateRows: `auto auto repeat(${totalRows}, 1fr)`,
            }}
        >
            {/* Cover top left corner of grid, so time gets cut off at the top of the partial border */}
            <div className='sticky top-[75px] z-10 col-span-2 h-3 bg-surface-raised' />

            {days.map(day => (
                <div
                    // Full height with background to prevent grid lines from showing behind
                    className='sticky top-[75px] z-10 row-span-2 h-7 flex flex-col items-end self-start justify-end bg-surface-raised'
                    key={day}
                >
                    {/* Partial border height because that's what Isaiah wants */}
                    <div className='h-4 w-full flex items-end border-b border-r border-divider'>
                        {/* Alignment for text */}
                        <div className='h-[calc(1.75rem_-_1px)] w-full flex items-center justify-center'>
                            <Text
                                variant='small'
                                className='text-center text-ut-burntorange dark:text-content'
                                as='div'
                            >
                                {day}
                            </Text>
                        </div>
                    </div>
                </div>
            ))}

            <div />
            {/* time tick for the first hour */}
            <div className='h-4 w-4 self-end border-b border-r border-divider' />

            {hoursOfDay.map((_, i) => makeGridRow(i, days.length, hoursOfDay))}
            <CalendarGridBounds.Provider value={gridRef}>
                {onCreateBlock &&
                    days.map((_, index) => {
                        const day = Object.values(DAY_MAP)[index];
                        return (
                            day && (
                                <CalendarBlockCreator
                                    key={day}
                                    day={day}
                                    dayIndex={index}
                                    start={visualStartHour * 60}
                                    end={visualEndHour * 60}
                                    onCreate={onCreateBlock}
                                />
                            )
                        );
                    })}

                <ColorPickerProvider>
                    <AccountForCourseConflicts
                        courseCells={courseCells ?? []}
                        blockCells={blockCells}
                        totalRows={totalRows}
                        setCourse={setCourse}
                        highlight={highlight}
                        renderBlockEditor={renderBlockEditor}
                    />
                </ColorPickerProvider>
            </CalendarGridBounds.Provider>
            {previewCells?.map((cell, i) => (
                // Over the course cells at the full width of the day, rather than splitting it with them, so the
                // schedule doesn't shift around while sections are previewed. Keyed by section, so moving to another
                // one fades it in, and by position, since two of a course's meetings can start in the same half hour.
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: the position tells apart meetings that start together
                    key={`${cell.course.uniqueId}-${i}`}
                    aria-hidden
                    style={{ gridColumn: cell.calendarGridPoint.dayIndex + 3, gridRow: '3 / -1' }}
                    className='pointer-events-none relative z-1 min-h-0 min-w-0 screenshot:hidden'
                >
                    <div
                        className={clsx(
                            'absolute box-border pr-2.5 motion-safe:(animate-fade-in animate-duration-150)',
                            // Like the course cells, 15-minute meetings need the bottom gap for their text
                            cell.calendarGridPoint.endIndex - cell.calendarGridPoint.startIndex <= 0.5
                                ? 'pb-px'
                                : 'pb-1'
                        )}
                        style={calendarCellPosition(cell, totalRows)}
                    >
                        <PreviewCourseCell cell={cell} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// Hatched, so a conflict reads as one even where the colors are hard to tell apart. The cell's background lets some
// of the course it conflicts with show through, so its text sits on a band of the calendar's own color across the
// top, which keeps the red readable over any course color.
const CONFLICT_HATCHING = 'repeating-linear-gradient(135deg, rgb(209 0 0 / 0.07) 0 6px, transparent 6px 12px)';

/**
 * A faint, dashed outline of a course meeting that isn't in the schedule. One that conflicts with the schedule is
 * red and hatched instead, says what it conflicts with, and has a strikethrough if conflicts are highlighted elsewhere.
 */
function PreviewCourseCell({ cell }: { cell: CalendarPreviewCell }): React.JSX.Element {
    const highlightConflicts = OptionsStore.useStore(store => store.enableHighlightConflicts);
    const { courseDeptAndInstr, timeAndLocation } = cell.componentProps;
    const conflictNames = [
        ...cell.conflicts.map(c => `${c.department} ${c.number}`),
        ...cell.blockConflicts.map(block => block.name),
    ];
    const isConflicting = conflictNames.length > 0;

    return (
        <div
            className={clsx(
                'h-full w-full flex flex-col gap-0.25 overflow-hidden rounded border-2 border-dashed px-2 py-1',
                isConflicting
                    ? 'border-theme-red bg-surface-raised/80 text-theme-red'
                    : 'border-ut-burntorange/70 bg-ut-burntorange/10 text-content'
            )}
            style={isConflicting ? { backgroundImage: CONFLICT_HATCHING } : undefined}
        >
            <div
                className={clsx(
                    'flex flex-col gap-0.25',
                    isConflicting && '-mx-2 -mt-1 bg-surface-raised/90 px-2 pb-0.5 pt-1'
                )}
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
                    {isConflicting ? `Conflicts with ${conflictNames.join(', ')}` : timeAndLocation}
                </Text>
            </div>
        </div>
    );
}

interface AccountForCourseConflictsProps {
    blockCells: (CalendarLayoutCell & { block: CustomBlock })[];
    totalRows: number;
    renderBlockEditor?: Props['renderBlockEditor'];
    courseCells: CalendarGridCourse[];
    setCourse: (course: Course) => void;
    highlight?: Props['highlight'];
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({
    courseCells,
    blockCells,
    totalRows,
    setCourse,
    highlight,
    renderBlockEditor,
}: AccountForCourseConflictsProps): React.JSX.Element {
    // Sentry is not defined in storybook.
    // This is a valid use case for a condition hook, since IS_STORYBOOK is determined at build time,
    // it doesn't change between renders.
    // biome-ignore lint/correctness/useHookAtTopLevel: See above
    const sentryScope = IS_STORYBOOK ? undefined : useSentryScope();

    //  Groups by dayIndex to identify overlaps, gives left-most column priority to all day blocks, then regular time blocks, and finally course cells
    const days = [
        ...blockCells.filter(cell => cell.block.allDay),
        ...blockCells.filter(cell => !cell.block.allDay),
        ...courseCells,
    ].reduce(
        (acc, cell) => {
            const { dayIndex } = cell.calendarGridPoint;
            if (acc[dayIndex] === undefined) {
                acc[dayIndex] = [];
            }
            acc[dayIndex]?.push(cell);
            return acc;
        },
        {} as Record<number, CalendarLayoutCell[]>
    );
    // Check for overlaps within each day and adjust gridColumnIndex and totalColumns
    Object.values(days).forEach(dayCells => {
        try {
            calculateCourseCellColumns(dayCells);
        } catch (error) {
            console.error(error);
            if (sentryScope) {
                sentryScope.captureException(error);
            }
        }
    });

    return (
        <>
            {courseCells
                .filter(block => !block.async)
                .map(block => {
                    const { courseDeptAndInstr, timeAndLocation, status } = block.componentProps;
                    const isHighlighted = highlight?.course.uniqueId === block.course.uniqueId;

                    return (
                        <CalendarGridItem cell={block} totalRows={totalRows} course key={`${JSON.stringify(block)}`}>
                            <div className='relative h-full'>
                                <CalendarCourseCell
                                    courseDeptAndInstr={courseDeptAndInstr}
                                    timeAndLocation={timeAndLocation}
                                    status={status}
                                    onClick={() => setCourse(block.course)}
                                    blockData={block}
                                />
                                {isHighlighted && (
                                    // Over the cell, without catching its clicks
                                    <div
                                        aria-hidden
                                        className={clsx(
                                            'pointer-events-none absolute inset-0 rounded motion-safe:(animate-fade-in animate-duration-150) screenshot:hidden',
                                            highlight.isRemoving
                                                ? 'border-2 border-dashed border-theme-red bg-surface/60'
                                                : 'ring-2 ring-ut-burntorange ring-offset-2 ring-offset-surface-raised'
                                        )}
                                    />
                                )}
                            </div>
                        </CalendarGridItem>
                    );
                })}
            {blockCells.map(cell => (
                <CalendarGridItem
                    key={`${cell.block.id}-${cell.calendarGridPoint.dayIndex}`}
                    cell={cell}
                    totalRows={totalRows}
                >
                    <div className='group relative h-full'>
                        <Popover className='h-full rounded bg-surface-raised'>
                            {({ close }) => (
                                <>
                                    <PopoverButton as={CalendarCustomBlockCell} block={cell.block} />
                                    {renderBlockEditor?.(cell.block, close)}
                                </>
                            )}
                        </Popover>
                        <CustomBlockColorPicker cell={cell} />
                    </div>
                </CalendarGridItem>
            ))}
        </>
    );
}

function CalendarGridItem({
    cell,
    totalRows,
    course = false,
    children,
}: React.PropsWithChildren<{ cell: CalendarLayoutCell; totalRows: number; course?: boolean }>) {
    return (
        <div
            className='relative min-h-0 min-w-0 pointer-events-none'
            style={{ gridColumn: cell.calendarGridPoint.dayIndex + 3, gridRow: '3 / -1' }}
        >
            <div
                className={clsx(
                    'absolute box-border screenshot:pr-0.5',
                    course ? 'pr-2.5' : 'pr-2',
                    // 15-minute items need the bottom gap for their text
                    cell.calendarGridPoint.endIndex - cell.calendarGridPoint.startIndex <= 0.5
                        ? 'pb-px'
                        : 'pb-1 screenshot:pb-0.5'
                )}
                style={calendarCellPosition(cell, totalRows)}
            >
                {/* Only the cell is interactive, so the padding gap can still be dragged to create a block */}
                <div className='h-full pointer-events-auto'>{children}</div>
            </div>
        </div>
    );
}
