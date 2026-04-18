import { Check, PencilSimple, Trash, X } from '@phosphor-icons/react';
import type { Day } from '@shared/types/CourseMeeting';
import type { SerializedCustomTimeBlock } from '@shared/types/CustomTimeBlock';
import {
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END,
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START,
} from '@shared/util/customTimeBlocks';
import { minutesToTimeInputValue, parseTimeToMinutes } from '@shared/util/time';
import {
    CUSTOM_BLOCK_DAY_TOGGLES,
    formatCustomBlockSubtitle,
    sortDaysByWeek,
} from '@views/components/calendar/customTimeBlockLabels';
import { Button } from '@views/components/common/Button';
import { styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import SwitchButton from '@views/components/common/SwitchButton';
import Text from '@views/components/common/Text/Text';
import { removeCustomTimeBlock, upsertCustomTimeBlock } from '@views/hooks/useCustomTimeBlocks';
import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface EditCustomTimeBlockOverlayProps {
    block: SerializedCustomTimeBlock;
    onClose: () => void;
}

/**
 * Modal overlay over the calendar grid for viewing and editing one custom block.
 */
export default function EditCustomTimeBlockOverlay({ block, onClose }: EditCustomTimeBlockOverlayProps): JSX.Element {
    const titleRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(block.title);
    const [days, setDays] = useState<Day[]>(block.days);
    const [startTime, setStartTime] = useState(() =>
        block.allDay ? CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START : minutesToTimeInputValue(block.startTime)
    );
    const [endTime, setEndTime] = useState(() =>
        block.allDay ? CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END : minutesToTimeInputValue(block.endTime)
    );
    const [allDay, setAllDay] = useState(!!block.allDay);
    const [syncAcrossAllSchedules, setSyncAcrossAllSchedules] = useState(block.syncAcrossAllSchedules);
    const [highlightCatalogConflicts, setHighlightCatalogConflicts] = useState(block.highlightCatalogConflicts);

    useEffect(() => {
        setTitle(block.title);
        setDays(block.days);
        setStartTime(block.allDay ? CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START : minutesToTimeInputValue(block.startTime));
        setEndTime(block.allDay ? CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END : minutesToTimeInputValue(block.endTime));
        setAllDay(!!block.allDay);
        setSyncAcrossAllSchedules(block.syncAcrossAllSchedules);
        setHighlightCatalogConflicts(block.highlightCatalogConflicts);
    }, [block]);

    const subtitle = useMemo(() => {
        const s = parseTimeToMinutes(startTime);
        const e = parseTimeToMinutes(endTime);
        if (days.length === 0) {
            return '';
        }
        if (allDay) {
            return formatCustomBlockSubtitle(days, 0, 1440, true);
        }
        if (s === null || e === null) {
            return '';
        }
        return formatCustomBlockSubtitle(days, s, e, false);
    }, [allDay, days, endTime, startTime]);

    const toggleDay = (day: Day) => {
        setDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
    };

    const handleSave = async () => {
        if (!title.trim() || days.length === 0) {
            return;
        }

        let startM = 0;
        let endM = 0;
        if (!allDay) {
            const s = parseTimeToMinutes(startTime);
            const e = parseTimeToMinutes(endTime);
            if (s === null || e === null || s >= e) {
                return;
            }
            startM = s;
            endM = e;
        }

        await upsertCustomTimeBlock({
            ...block,
            title: title.trim(),
            days: sortDaysByWeek(days),
            startTime: allDay ? 0 : startM,
            endTime: allDay ? 1440 : endM,
            allDay,
            syncAcrossAllSchedules,
            highlightCatalogConflicts,
        } satisfies SerializedCustomTimeBlock);
        onClose();
    };

    const handleDelete = async () => {
        await removeCustomTimeBlock(block.id);
        onClose();
    };

    return (
        <div
            className='absolute inset-0 z-20 flex justify-center bg-ut-black/25 px-spacing-4 pb-spacing-8 pt-spacing-6'
            role='presentation'
            onMouseDown={e => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={clsx(
                    styleResetClass,
                    'relative flex max-h-[min(90vh,40rem)] w-full max-w-[23rem] flex-col gap-spacing-5 overflow-y-auto rounded-lg border border-ut-offwhite/50 bg-white p-spacing-6 shadow-xl'
                )}
                role='dialog'
                aria-labelledby='custom-block-edit-title'
                onMouseDown={e => e.stopPropagation()}
            >
                <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0 flex flex-1 flex-col gap-1 pr-2'>
                        <Text id='custom-block-edit-title' variant='h4' className='text-ut-black font-semibold'>
                            {title.trim() || 'Custom block'}
                        </Text>
                        {subtitle ? (
                            <Text variant='small' className='text-ut-gray'>
                                {subtitle}
                            </Text>
                        ) : null}
                    </div>
                    <div className='flex shrink-0 items-center gap-0.5'>
                        <button
                            type='button'
                            className='rounded p-2 text-ut-gray transition hover:bg-ut-offwhite/40 hover:text-ut-black'
                            aria-label='Rename'
                            onClick={() => {
                                titleRef.current?.focus();
                                titleRef.current?.select();
                            }}
                        >
                            <PencilSimple className='h-5 w-5' />
                        </button>
                        <button
                            type='button'
                            className='rounded p-2 text-ut-gray transition hover:bg-ut-offwhite/40 hover:text-theme-red'
                            aria-label='Delete block'
                            onClick={() => {
                                handleDelete().catch(() => undefined);
                            }}
                        >
                            <Trash className='h-5 w-5' />
                        </button>
                        <button
                            type='button'
                            className='rounded p-2 text-ut-gray transition hover:bg-ut-offwhite/40 hover:text-ut-black'
                            aria-label='Close'
                            onClick={onClose}
                        >
                            <X className='h-5 w-5' weight='bold' />
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <PencilSimple className='h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
                    <input
                        ref={titleRef}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='Enter Block Name...'
                        className='h-10 min-w-0 flex-1 border-b border-ut-offwhite/80 bg-transparent text-sm outline-none transition focus:border-ut-burntorange placeholder:text-ut-gray/70'
                    />
                </div>

                <div className='flex flex-col gap-spacing-3'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span className='w-5 shrink-0' aria-hidden />
                        <input
                            type='time'
                            step={300}
                            value={startTime}
                            disabled={allDay}
                            onChange={e => setStartTime(e.target.value)}
                            className='h-10 min-w-[6.5rem] flex-1 border border-ut-offwhite/80 rounded px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-ut-offwhite/20 disabled:opacity-60 enabled:focus:border-ut-burntorange'
                        />
                        <Text variant='small' className='shrink-0 text-ut-gray'>
                            —
                        </Text>
                        <input
                            type='time'
                            step={300}
                            value={endTime}
                            disabled={allDay}
                            onChange={e => setEndTime(e.target.value)}
                            className='h-10 min-w-[6.5rem] flex-1 border border-ut-offwhite/80 rounded px-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-ut-offwhite/20 disabled:opacity-60 enabled:focus:border-ut-burntorange'
                        />
                    </div>
                    <label className='flex cursor-pointer items-center gap-2 pl-8'>
                        <input
                            type='checkbox'
                            className='sr-only'
                            checked={allDay}
                            onChange={e => setAllDay(e.target.checked)}
                        />
                        <span
                            className={clsx(
                                'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                                allDay ? 'border-ut-burntorange bg-ut-burntorange' : 'border-ut-gray/50 bg-white'
                            )}
                        >
                            {allDay && <Check className='h-3 w-3 text-white' weight='bold' />}
                        </span>
                        <Text variant='small'>All day</Text>
                    </label>
                </div>

                <div className='flex flex-wrap items-start gap-3'>
                    <span className='w-5 shrink-0' aria-hidden />
                    <div className='min-w-0 flex flex-1 flex-wrap gap-2'>
                        {CUSTOM_BLOCK_DAY_TOGGLES.map(({ label, day }) => {
                            const on = days.includes(day);
                            return (
                                <label
                                    key={day}
                                    className={clsx(
                                        'flex h-9 min-w-[2.25rem] cursor-pointer items-center justify-center rounded border px-2 text-xs font-semibold tracking-wide transition-colors',
                                        on
                                            ? 'border-ut-burntorange bg-ut-burntorange text-white'
                                            : 'border-ut-offwhite/80 bg-white text-ut-black hover:border-ut-burntorange/50'
                                    )}
                                >
                                    <input
                                        type='checkbox'
                                        className='sr-only'
                                        checked={on}
                                        onChange={() => toggleDay(day)}
                                    />
                                    {label}
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className='flex flex-col gap-spacing-4 border-t border-ut-offwhite/50 pt-spacing-5'>
                    <Text variant='mini' className='text-ut-gray font-semibold tracking-wide uppercase'>
                        Advanced options
                    </Text>
                    <div className='flex flex-col gap-spacing-4'>
                        <div className='flex items-start justify-between gap-4'>
                            <Text variant='small' className='max-w-[14rem] font-semibold'>
                                Sync across all schedules
                            </Text>
                            <SwitchButton isChecked={syncAcrossAllSchedules} onChange={setSyncAcrossAllSchedules} />
                        </div>
                        <div className='flex items-start justify-between gap-4'>
                            <Text variant='small' className='max-w-[14rem] font-semibold'>
                                Conflict highlight
                            </Text>
                            <SwitchButton
                                isChecked={highlightCatalogConflicts}
                                onChange={setHighlightCatalogConflicts}
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-auto flex items-center justify-between gap-spacing-4 border-t border-ut-offwhite/50 pt-spacing-5'>
                    <button
                        type='button'
                        className='text-sm text-ut-blue underline-offset-2 transition hover:underline'
                        onClick={onClose}
                    >
                        Discard changes
                    </button>
                    <Button
                        color='ut-burntorange'
                        size='small'
                        variant='filled'
                        icon={Check}
                        onClick={() => {
                            handleSave().catch(() => undefined);
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
