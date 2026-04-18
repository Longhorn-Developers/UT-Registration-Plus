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
import {
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END,
    CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START,
} from '@shared/util/customTimeBlocks';
import { generateRandomId } from '@shared/util/random';
import { parseTimeToMinutes } from '@shared/util/time';
import { CUSTOM_BLOCK_DAY_TOGGLES, sortDaysByWeek } from '@views/components/calendar/customTimeBlockLabels';
import { Button } from '@views/components/common/Button';
import { ExtensionRootWrapper, styleResetClass } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Text from '@views/components/common/Text/Text';
import { upsertCustomTimeBlock } from '@views/hooks/useCustomTimeBlocks';
import clsx from 'clsx';
import { useCallback, useId, useMemo, useState } from 'react';

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
    const titleFieldId = useId();
    const [title, setTitle] = useState('');
    const [days, setDays] = useState<Day[]>([]);
    const [startTime, setStartTime] = useState(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START);
    const [endTime, setEndTime] = useState(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END);
    const [allDay, setAllDay] = useState(false);
    const [syncAcrossAllSchedules, setSyncAcrossAllSchedules] = useState(true);
    const [highlightCatalogConflicts, setHighlightCatalogConflicts] = useState(true);

    const resetForm = useCallback(() => {
        setTitle('');
        setDays([]);
        setStartTime(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_START);
        setEndTime(CUSTOM_TIME_BLOCK_ALL_DAY_INPUT_END);
        setAllDay(false);
        setSyncAcrossAllSchedules(true);
        setHighlightCatalogConflicts(true);
    }, []);

    const toggleDay = (day: Day) => {
        setDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
    };

    const canSubmit = useMemo(() => {
        if (!title.trim() || days.length === 0) {
            return false;
        }
        if (allDay) {
            return true;
        }
        const s = parseTimeToMinutes(startTime);
        const e = parseTimeToMinutes(endTime);
        return s !== null && e !== null && s < e;
    }, [allDay, days.length, endTime, startTime, title]);

    const addBlockDisabledHint = useMemo(() => {
        if (canSubmit) {
            return undefined;
        }
        if (!title.trim()) {
            return 'Enter a block name';
        }
        if (days.length === 0) {
            return 'Select at least one day';
        }
        if (!allDay) {
            const s = parseTimeToMinutes(startTime);
            const e = parseTimeToMinutes(endTime);
            if (s === null || e === null) {
                return 'Choose valid start and end times';
            }
            if (s >= e) {
                return 'End time must be after start time';
            }
        }
        return undefined;
    }, [allDay, canSubmit, days.length, endTime, startTime, title]);

    const handleSubmit = async (close: () => void) => {
        if (!canSubmit) {
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
                    'mt-spacing-3 box-border w-[min(23rem,calc(100vw-2rem))] rounded-lg border border-ut-offwhite/50 bg-white p-spacing-6 shadow-lg',
                    'data-[closed]:opacity-0 data-[closed]:scale-95',
                    'data-[enter]:ease-out-expo data-[enter]:duration-150',
                    'data-[leave]:ease-out data-[leave]:duration-75',
                    'z-[100]'
                )}
            >
                {({ close }) => (
                    <div className='flex min-w-0 w-full flex-col gap-spacing-5 text-ut-black'>
                        <div className='flex min-w-0 flex-col gap-spacing-2'>
                            <label htmlFor={titleFieldId} className='text-xs font-semibold tracking-wide text-ut-gray uppercase'>
                                Block name
                            </label>
                            <div className='flex min-w-0 items-center gap-3'>
                                <PencilSimple className='h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
                                <input
                                    id={titleFieldId}
                                    type='text'
                                    autoComplete='off'
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder='e.g. Work, gym, office hours'
                                    className='h-10 min-w-0 flex-1 border border-ut-offwhite/80 rounded bg-white px-3 text-sm text-ut-black outline-none transition placeholder:text-ut-gray/70 focus:border-ut-burntorange'
                                />
                            </div>
                        </div>

                        <div className='flex min-w-0 flex-col gap-spacing-3'>
                            <div className='flex min-w-0 flex-wrap items-center gap-3'>
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

                        <div className='flex min-w-0 flex-col gap-spacing-3'>
                            <div className='flex min-w-0 flex-wrap items-start gap-3'>
                                <CalendarBlank className='mt-0.5 h-5 w-5 shrink-0 text-ut-gray' aria-hidden />
                                <div className='flex min-w-0 flex-1 flex-wrap gap-2'>
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

                        <div className='flex min-w-0 flex-col gap-spacing-4 border-t border-ut-offwhite/50 pt-spacing-5'>
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

                        <div className='flex min-w-0 items-center justify-between gap-spacing-4 pt-spacing-2'>
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
                                disabled={!canSubmit}
                                title={addBlockDisabledHint}
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
