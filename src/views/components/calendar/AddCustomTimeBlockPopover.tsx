import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import type { Icon } from '@phosphor-icons/react';
import {
    ArrowsClockwise,
    CalendarBlank,
    Check,
    Clock,
    PencilSimple,
    Plus,
    Prohibit,
    SelectionPlus,
} from '@phosphor-icons/react';
import type { Day } from '@shared/types/CourseMeeting';
import type { SerializedCustomTimeBlock } from '@shared/types/CustomTimeBlock';
import { generateRandomId } from '@shared/util/random';
import { CUSTOM_BLOCK_DAY_TOGGLES, sortDaysByWeek } from '@views/components/calendar/customTimeBlockLabels';
import { Button } from '@views/components/common/Button';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Text from '@views/components/common/Text/Text';
import { upsertCustomTimeBlock } from '@views/hooks/useCustomTimeBlocks';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

function parseTimeToMinutes(value: string): number | null {
    const parts = value.split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    if (h === undefined || m === undefined || !Number.isFinite(h) || !Number.isFinite(m)) {
        return null;
    }
    return h * 60 + m;
}

function OptionCheckbox({
    checked,
    onChange,
    icon: IconComponent,
    title,
    description,
}: {
    checked: boolean;
    onChange: (next: boolean) => void;
    icon: Icon;
    title: string;
    description?: string;
}): JSX.Element {
    return (
        <label className='flex cursor-pointer items-start gap-3'>
            <input type='checkbox' className='sr-only' checked={checked} onChange={e => onChange(e.target.checked)} />
            <span
                className={clsx(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                    checked ? 'border-ut-burntorange bg-ut-burntorange' : 'border-ut-gray/50 bg-white'
                )}
            >
                {checked && <Check className='h-3 w-3 text-white' weight='bold' />}
            </span>
            <IconComponent className='mt-0.25 h-5 w-5 shrink-0 text-ut-gray' />
            <span className='min-w-0 flex flex-1 flex-col gap-0.5'>
                <Text variant='small' className='text-ut-black font-semibold'>
                    {title}
                </Text>
                {description ? (
                    <Text variant='mini' className='text-ut-gray'>
                        {description}
                    </Text>
                ) : null}
            </span>
        </label>
    );
}

interface AddCustomTimeBlockPopoverProps {
    activeScheduleId: string;
}

/**
 * Popover anchored to the toolbar “Add block” control for creating a custom time range.
 */
export default function AddCustomTimeBlockPopover({ activeScheduleId }: AddCustomTimeBlockPopoverProps): JSX.Element {
    const [title, setTitle] = useState('');
    const [days, setDays] = useState<Day[]>([]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');
    const [allDay, setAllDay] = useState(false);
    const [syncAcrossAllSchedules, setSyncAcrossAllSchedules] = useState(true);
    const [highlightCatalogConflicts, setHighlightCatalogConflicts] = useState(true);

    const resetForm = useCallback(() => {
        setTitle('');
        setDays([]);
        setStartTime('08:00');
        setEndTime('09:00');
        setAllDay(false);
        setSyncAcrossAllSchedules(true);
        setHighlightCatalogConflicts(true);
    }, []);

    const toggleDay = (day: Day) => {
        setDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
    };

    const handleSubmit = async (close: () => void) => {
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

        const block: SerializedCustomTimeBlock = {
            id: generateRandomId(),
            title: title.trim(),
            days: sortDaysByWeek(days),
            startTime: allDay ? 0 : startM,
            endTime: allDay ? 1440 : endM,
            allDay,
            syncAcrossAllSchedules,
            highlightCatalogConflicts,
            scheduleId: activeScheduleId,
        };

        await upsertCustomTimeBlock(block);
        resetForm();
        close();
    };

    return (
        <Popover className='relative'>
            <PopoverButton as={Button} color='ut-black' size='small' variant='minimal' icon={SelectionPlus}>
                Add block
            </PopoverButton>
            <PopoverPanel
                as={ExtensionRootWrapper}
                anchor='bottom start'
                transition
                portal
                modal={false}
                className={clsx(
                    styleResetClass,
                    'mt-spacing-3 w-[23rem] max-w-[calc(100vw-2rem)] rounded-lg border border-ut-offwhite/50 bg-white p-spacing-6 shadow-lg',
                    'data-[closed]:opacity-0 data-[closed]:scale-95',
                    'data-[enter]:ease-out-expo data-[enter]:duration-150',
                    'data-[leave]:ease-out data-[leave]:duration-75',
                    'z-30'
                )}
            >
                {({ close }) => (
                    <div className='flex flex-col gap-spacing-5 text-ut-black'>
                        <div className='flex items-center gap-3'>
                            <PencilSimple className='h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder='Enter Block Name...'
                                className='h-10 min-w-0 flex-1 border-b border-ut-offwhite/80 bg-transparent text-sm outline-none transition focus:border-ut-burntorange placeholder:text-ut-gray/70'
                            />
                        </div>

                        <div className='flex flex-col gap-spacing-3'>
                            <div className='flex flex-wrap items-center gap-3'>
                                <Clock className='h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
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
                                        allDay
                                            ? 'border-ut-burntorange bg-ut-burntorange'
                                            : 'border-ut-gray/50 bg-white'
                                    )}
                                >
                                    {allDay && <Check className='h-3 w-3 text-white' weight='bold' />}
                                </span>
                                <Text variant='small'>All day</Text>
                            </label>
                        </div>

                        <div className='flex flex-col gap-spacing-3'>
                            <div className='flex flex-wrap items-start gap-3'>
                                <CalendarBlank className='mt-0.5 h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
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
                        </div>

                        <div className='flex flex-col gap-spacing-4 border-t border-ut-offwhite/50 pt-spacing-5'>
                            <Text variant='mini' className='text-ut-gray font-semibold tracking-wide uppercase'>
                                Advanced options
                            </Text>
                            <div className='flex flex-col gap-spacing-4'>
                                <OptionCheckbox
                                    checked={syncAcrossAllSchedules}
                                    onChange={setSyncAcrossAllSchedules}
                                    icon={ArrowsClockwise}
                                    title='Sync across all schedules'
                                    description='Show on every schedule tab and new schedules you create.'
                                />
                                <OptionCheckbox
                                    checked={highlightCatalogConflicts}
                                    onChange={setHighlightCatalogConflicts}
                                    icon={Prohibit}
                                    title='Conflict highlight'
                                    description='Mark overlapping courses in the catalog with the conflict style.'
                                />
                            </div>
                        </div>

                        <div className='flex items-center justify-between gap-spacing-4 pt-spacing-2'>
                            <button
                                type='button'
                                className='text-sm text-ut-blue underline-offset-2 transition hover:underline'
                                onClick={() => close()}
                            >
                                Cancel
                            </button>
                            <Button
                                color='ut-green'
                                size='small'
                                variant='filled'
                                icon={Plus}
                                onClick={() => {
                                    handleSubmit(close).catch(() => undefined);
                                }}
                            >
                                Add Block
                            </Button>
                        </div>
                    </div>
                )}
            </PopoverPanel>
        </Popover>
    );
}
