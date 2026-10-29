import { Popover, PopoverButton } from '@headlessui/react';
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
 * @param saturdayClass - Whether the user has a Saturday class
 * @param setCourse - Function to set the course to display in the course details panel
 * @returns The CalendarGrid component
 */
export default function CalendarGrid({
    onCreateBlock,
    customBlocks = [],
    renderBlockEditor,
    courseCells,
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
                        renderBlockEditor={renderBlockEditor}
                    />
                </ColorPickerProvider>
            </CalendarGridBounds.Provider>
        </div>
    );
}

interface AccountForCourseConflictsProps {
    blockCells: (CalendarLayoutCell & { block: CustomBlock })[];
    totalRows: number;
    renderBlockEditor?: Props['renderBlockEditor'];
    courseCells: CalendarGridCourse[];
    setCourse: (course: Course) => void;
}

// TODO: Possibly refactor to be more concise
// TODO: Deal with react strict mode (wacky movements)
function AccountForCourseConflicts({
    courseCells,
    blockCells,
    totalRows,
    setCourse,
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

                    return (
                        <CalendarGridItem cell={block} totalRows={totalRows} course key={`${JSON.stringify(block)}`}>
                            <CalendarCourseCell
                                courseDeptAndInstr={courseDeptAndInstr}
                                timeAndLocation={timeAndLocation}
                                status={status}
                                onClick={() => setCourse(block.course)}
                                blockData={block}
                            />
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
                        <Popover className='h-full rounded bg-white'>
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
