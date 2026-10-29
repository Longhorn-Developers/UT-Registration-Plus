import { background } from '@shared/messages';
import type { HexColor } from '@shared/types/Color';
import type { CustomBlock } from '@shared/types/CustomBlock';
import type { ThemeColor } from '@shared/types/ThemeColors';
import { getDarkerShade, isValidHexColor } from '@shared/util/colors';
import { customBlockToDraft } from '@shared/util/customBlocks';
import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import { ColorPickerContext } from '@views/contexts/ColorPickerContext';
import type { ColorPickerInterface } from '@views/hooks/useColorPicker';
import type { CalendarLayoutCell } from '@views/hooks/useFlattenedCourseSchedule';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import clsx from 'clsx';
import type { ComponentProps, CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import PaletteFillIcon from '~icons/ph/palette-fill';
import CourseCellColorPicker from './CalendarCourseCellColorPicker/CourseCellColorPicker';
import { formatBlockTime } from './customBlockUtils';

const DEFAULT_BLOCK_COLOR: HexColor = '#0ea5e9'; // sky-500

export default function CalendarCustomBlockCell({
    block,
    ...props
}: ComponentProps<'button'> & { block: CustomBlock }) {
    const time = block.allDay ? 'All day' : `${formatBlockTime(block.startTime)} – ${formatBlockTime(block.endTime)}`;
    const compact = !block.allDay && block.endTime - block.startTime <= 30;
    // A 15-minute slot is only ~12px tall, so its text shrinks to fit
    const tiny = !block.allDay && block.endTime - block.startTime <= 15;
    const color = block.color ?? DEFAULT_BLOCK_COLOR;
    return (
        <button
            {...props}
            type='button'
            style={{ '--block-color': color } as CSSProperties}
            aria-label={`${block.name}, ${time}`}
            title={`${block.name}, ${time}`}
            className={clsx(
                'box-border h-full w-full flex overflow-hidden rounded border-0 border-l-3 border-solid border-[var(--block-color)] bg-[color-mix(in_srgb,var(--block-color)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--block-color)_30%,transparent)] dark:bg-[color-mix(in_srgb,var(--block-color)_15%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--block-color)_25%,transparent)] text-content text-left pl-[5px] pr-2 focusable',
                compact ? 'items-center gap-spacing-2' : 'flex-col items-start pt-1'
            )}
        >
            <Text
                as='div'
                variant='h1-course'
                className={clsx(
                    'truncate font-bold!',
                    compact ? 'min-w-0 flex-1' : 'w-full leading-[18px]!',
                    compact && (tiny ? 'text-[10px]! leading-[10px]!' : 'text-[12px]! leading-[14px]!')
                )}
            >
                {block.name}
            </Text>
            <Text
                as='div'
                variant='small'
                className={clsx(
                    'font-normal! truncate',
                    compact ? 'shrink-0' : 'w-full',
                    tiny ? 'text-[10px]! leading-[10px]!' : 'text-[12px]! leading-[14px]!'
                )}
            >
                {compact ? formatBlockTime(block.startTime) : time}
            </Text>
        </button>
    );
}

/**
 * Palette button shown on hover beside a custom block, reusing the course color picker
 *
 * @param cell - The block's cell on the calendar grid
 * @returns The color picker button and popover
 */
export function CustomBlockColorPicker({ cell }: { cell: CalendarLayoutCell & { block: CustomBlock } }) {
    const { block, calendarGridPoint } = cell;
    const { id: scheduleId } = useActiveSchedule();
    const [open, setOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const color = block.color ?? DEFAULT_BLOCK_COLOR;

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !event.composedPath().includes(pickerRef.current)) setOpen(false);
        };
        // pointerdown, not mousedown: the calendar's drag-to-add layer cancels mousedown for clicks in the grid
        document.addEventListener('pointerdown', handleClickOutside);
        return () => document.removeEventListener('pointerdown', handleClickOutside);
    }, [open]);

    // The course picker reads the context, so only the setter and close handler are needed for blocks
    const context: ColorPickerInterface = {
        selectedColor: null,
        setSelectedColor: value => {
            if (typeof value !== 'string' || !isValidHexColor(value)) return;
            void background.updateCustomBlock({
                id: block.id,
                draft: { ...customBlockToDraft(block), color: value as HexColor },
                scheduleId,
            });
        },
        handleCloseColorPicker: () => setOpen(false),
        setSelectedCourse: () => {},
        isSelectedCourse: () => false,
        isSelectedBlock: () => false,
    };

    return (
        <div
            className={clsx(
                'absolute top-0 screenshot:opacity-0! text-black transition-all ease-in-out group-focus-within:pointer-events-auto group-hover:pointer-events-auto group-focus-within:opacity-100 group-hover:opacity-100',
                calendarGridPoint.dayIndex === 4
                    ? 'left-0 -translate-x-full pr-0.75 flex flex-col items-end'
                    : 'right-0 translate-x-full pl-0.75',
                open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
            style={{ zIndex: open ? 30 : 29 }}
        >
            <Button
                onClick={() => setOpen(!open)}
                icon={PaletteFillIcon}
                iconProps={{ fill: getDarkerShade(color, 30) }}
                variant='outline'
                className='size-8.5! border border-white rounded-full !p-1 bg-opacity-100 !hover:enabled:bg-opacity-100 shadow-lg shadow-black/20'
                color='ut-gray'
                style={{ color: getDarkerShade(color, 30), backgroundColor: color }}
                aria-label={`Change color of ${block.name}`}
            />
            {open && (
                <div
                    ref={pickerRef}
                    className={
                        calendarGridPoint.startIndex < 21
                            ? 'relative top-0.75 w-max'
                            : 'absolute bottom-full mb-0.75 w-max'
                    }
                >
                    <ColorPickerContext.Provider value={context}>
                        <CourseCellColorPicker defaultColor={color as ThemeColor} />
                    </ColorPickerContext.Provider>
                </div>
            )}
        </div>
    );
}
