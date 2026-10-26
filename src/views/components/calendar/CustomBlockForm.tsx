import { Checkbox, Field, Fieldset, Label } from '@headlessui/react';
import { DAY_MAP } from '@shared/types/CourseMeeting';
import type { CustomBlock, CustomBlockDraft } from '@shared/types/CustomBlock';
import { customBlockToDraft } from '@shared/util/customBlocks';
import { Button } from '@views/components/common/Button';
import Divider from '@views/components/common/Divider';
import Input from '@views/components/common/Input';
import Text from '@views/components/common/Text/Text';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import clsx from 'clsx';
import type { ComponentType, FormEvent, SVGProps } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import ArrowsCounterClockwiseIcon from '~icons/ph/arrows-counter-clockwise';
import CalendarBlankIcon from '~icons/ph/calendar-blank';
import CheckIcon from '~icons/ph/check';
import ClockIcon from '~icons/ph/clock';
import MinusIcon from '~icons/ph/minus';
import PencilSimpleLineIcon from '~icons/ph/pencil-simple-line';
import PlusIcon from '~icons/ph/plus';
import ProhibitIcon from '~icons/ph/prohibit';
import TrashIcon from '~icons/ph/trash';
import XIcon from '~icons/ph/x';
import styles from './CustomBlockForm.module.scss';
import { BLOCK_DAYS, DEFAULT_BLOCK, formatBlockTime, isBlockTimeInRange, parseBlockTime } from './customBlockUtils';

interface Props {
    block?: CustomBlock;
    initialDraft?: CustomBlockDraft;
    onSave: (block: CustomBlockDraft, draftAtUnsync?: CustomBlockDraft) => void | Promise<void>;
    onClose: () => void;
    onDelete?: () => void | Promise<void>;
}

function BlockCheckbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}) {
    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
            aria-label={label}
            className='h-[35px] w-[35px] flex shrink-0 items-center justify-center cursor-pointer rounded border border-ut-offwhite/50 bg-transparent focusable'
        >
            <span className={clsx('h-[25.67px] w-[25.67px] rounded', checked && 'bg-ut-burntorange')} aria-hidden />
        </Checkbox>
    );
}

function BlockOption({
    icon: Icon,
    label,
    checked,
    onChange,
}: {
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <div className='flex items-center gap-spacing-5'>
            <div className='h-6 w-6 shrink-0'>{Icon && <Icon className='h-6 w-6' aria-hidden />}</div>
            <Field className='flex items-center gap-spacing-5'>
                <BlockCheckbox label={label} checked={checked} onChange={onChange} />
                <Text as={Label} className='cursor-pointer'>
                    {label}
                </Text>
            </Field>
        </div>
    );
}

function BlockTimeInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className='relative h-[35px] min-w-[65px] inline-flex items-center'>
            <Text variant='small' className='invisible whitespace-pre px-spacing-5' aria-hidden>
                {value || '00:00am'}
            </Text>
            <Input
                className={clsx(styles.textInput, styles.timeInput, 'absolute inset-0 h-[35px]! w-full')}
                aria-label={label}
                value={value}
                spellCheck={false}
                onChange={event => onChange(event.target.value)}
                onBlur={() => {
                    const time = parseBlockTime(value);
                    if (time !== null) onChange(formatBlockTime(time));
                }}
            />
        </div>
    );
}

export default function CustomBlockForm({ block, initialDraft, onSave, onClose, onDelete }: Props) {
    const [draft, setDraft] = useState<CustomBlockDraft>(() =>
        block ? customBlockToDraft(block) : (initialDraft ?? DEFAULT_BLOCK)
    );
    const [draftAtUnsync, setDraftAtUnsync] = useState<CustomBlockDraft>();
    const [startTime, setStartTime] = useState(block || initialDraft ? formatBlockTime(draft.startTime) : '');
    const [endTime, setEndTime] = useState(block || initialDraft ? formatBlockTime(draft.endTime) : '');
    const [renaming, setRenaming] = useState(false);
    const nameBeforeRename = useRef(draft.name);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const validationId = useId();
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    // Blocks may use any hour already visible on the grid, including hours extended for early or late courses
    const { startMinutes: gridStart, endMinutes: gridEnd } = useFlattenedCourseSchedule();
    const rangeText = `${formatBlockTime(gridStart)} – ${formatBlockTime(gridEnd)}`;
    const startMinutes = parseBlockTime(startTime);
    const endMinutes = parseBlockTime(endTime);
    const validationErrors: string[] = [];
    if (!draft.name.trim()) validationErrors.push('Enter a block name.');
    if (!draft.days.length) validationErrors.push('Select at least one day.');
    if (!draft.allDay) {
        if (startMinutes === null) validationErrors.push('Enter a valid start time, such as 8:00am.');
        if (endMinutes === null) validationErrors.push('Enter a valid end time, such as 1:15pm.');
        if (startMinutes !== null && !isBlockTimeInRange(startMinutes, gridStart, gridEnd)) {
            validationErrors.push(`Start time is outside ${rangeText}.`);
        }
        if (endMinutes !== null && !isBlockTimeInRange(endMinutes, gridStart, gridEnd)) {
            validationErrors.push(`End time is outside ${rangeText}.`);
        }
        if (startMinutes !== null && endMinutes !== null && startMinutes >= endMinutes) {
            validationErrors.push('End time must be after start time.');
        }
    }
    const showValidation = submitted && validationErrors.length > 0;
    const daysText = Object.entries(DAY_MAP)
        .filter(([, day]) => draft.days.includes(day))
        .map(([short]) => short)
        .join(', ');

    const update = (value: Partial<CustomBlockDraft>) => setDraft(previous => ({ ...previous, ...value }));
    const changeTime = (field: 'startTime' | 'endTime', value: string) => {
        (field === 'startTime' ? setStartTime : setEndTime)(value);
        const minutes = parseBlockTime(value);
        if (minutes !== null) update({ [field]: minutes });
    };
    const perform = async (action: () => void | Promise<void>) => {
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            await action();
            if (mounted.current) onClose();
        } catch {
            if (mounted.current) {
                setError('Unable to save your changes. Please try again.');
                setBusy(false);
            }
        }
    };
    const submit = (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        if (validationErrors.length) return;
        void perform(() =>
            onSave(
                {
                    ...draft,
                    name: draft.name.trim(),
                    startTime: startMinutes ?? draft.startTime,
                    endTime: endMinutes ?? draft.endTime,
                    days: Object.values(DAY_MAP).filter(day => draft.days.includes(day)),
                },
                draftAtUnsync
            )
        );
    };

    return (
        <form
            className='text-theme-black'
            onSubmit={submit}
            aria-label={block ? 'Edit custom block' : 'Create custom block'}
            aria-describedby={showValidation ? validationId : undefined}
        >
            <Fieldset as='fieldset' disabled={busy} className='m-0 min-w-0 border-0 p-0'>
                {block && (
                    <div className='flex flex-col gap-spacing-5 pb-spacing-6'>
                        <div className='flex flex-col gap-spacing-3'>
                            <div className='flex items-center justify-between gap-spacing-3'>
                                {renaming ? (
                                    <Text
                                        as='input'
                                        variant='h1'
                                        className='min-w-0 w-full bg-transparent focusable'
                                        aria-label='Block name'
                                        value={draft.name}
                                        autoFocus
                                        onFocus={event => event.currentTarget.select()}
                                        onChange={event => update({ name: event.target.value })}
                                        onBlur={() => setRenaming(false)}
                                        onKeyDown={event => {
                                            if (event.key === 'Enter' || event.key === 'Escape') {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                if (event.key === 'Escape') update({ name: nameBeforeRename.current });
                                                setRenaming(false);
                                            }
                                        }}
                                    />
                                ) : (
                                    <Text variant='h1' className='min-w-0 truncate'>
                                        {draft.name}
                                    </Text>
                                )}
                                <div className='flex shrink-0 gap-spacing-3'>
                                    <Button
                                        color='theme-black'
                                        size='mini'
                                        variant='minimal'
                                        icon={PencilSimpleLineIcon}
                                        aria-label='Rename block'
                                        onClick={() => {
                                            nameBeforeRename.current = draft.name;
                                            setRenaming(true);
                                        }}
                                    />
                                    <Button
                                        color='theme-black'
                                        size='mini'
                                        variant='minimal'
                                        icon={TrashIcon}
                                        aria-label='Delete block'
                                        disabled={!onDelete}
                                        onClick={() => onDelete && void perform(onDelete)}
                                    />
                                    <Button
                                        color='theme-black'
                                        size='mini'
                                        variant='minimal'
                                        icon={XIcon}
                                        aria-label='Close'
                                        onClick={onClose}
                                    />
                                </div>
                            </div>
                            <Text variant='small'>
                                {daysText}
                                {draft.allDay
                                    ? ' · All day'
                                    : ` at ${formatBlockTime(draft.startTime)} – ${formatBlockTime(draft.endTime)}`}
                            </Text>
                        </div>
                        <Divider orientation='horizontal' size='100%' />
                    </div>
                )}
                <div className={clsx('flex flex-col', block ? 'gap-spacing-7' : 'gap-spacing-6')}>
                    <div className='flex flex-col gap-spacing-6'>
                        <div className={clsx('flex flex-col', block ? 'gap-spacing-5' : 'gap-[11px]')}>
                            {!block && (
                                <Input
                                    className={clsx(styles.textInput, 'h-[35px]!')}
                                    icon={PencilSimpleLineIcon}
                                    placeholder='Enter Block Name...'
                                    aria-label='Block name'
                                    value={draft.name}
                                    onChange={event => update({ name: event.target.value })}
                                    autoFocus
                                />
                            )}
                            {!draft.allDay && (
                                <div className='flex items-center gap-spacing-5'>
                                    <ClockIcon className='h-6 w-6 shrink-0' aria-hidden />
                                    <div className='min-w-0 flex items-center gap-spacing-4'>
                                        <BlockTimeInput
                                            label='Start time'
                                            value={startTime}
                                            onChange={value => changeTime('startTime', value)}
                                        />
                                        <MinusIcon className='h-6 w-6 shrink-0' aria-hidden />
                                        <BlockTimeInput
                                            label='End time'
                                            value={endTime}
                                            onChange={value => changeTime('endTime', value)}
                                        />
                                    </div>
                                </div>
                            )}
                            <BlockOption
                                label='All day'
                                checked={draft.allDay}
                                onChange={allDay => update({ allDay })}
                            />
                            <div
                                className={clsx(
                                    'min-w-0 flex items-end gap-spacing-5',
                                    block ? 'mt-[2px]' : 'mt-[5px]'
                                )}
                            >
                                <CalendarBlankIcon className='h-6 w-6 shrink-0 mb-spacing-1' aria-hidden />
                                <div className='min-w-0 flex flex-wrap gap-spacing-6'>
                                    {BLOCK_DAYS.map(day => (
                                        <Field key={day} className='flex flex-col items-center gap-spacing-2'>
                                            <Text as={Label} variant='mini' className='cursor-pointer' aria-label={day}>
                                                {day.slice(0, 3).toUpperCase()}
                                            </Text>
                                            <BlockCheckbox
                                                label={day}
                                                checked={draft.days.includes(day)}
                                                onChange={checked =>
                                                    update({
                                                        days: checked
                                                            ? [...draft.days, day]
                                                            : draft.days.filter(value => value !== day),
                                                    })
                                                }
                                            />
                                        </Field>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={clsx('flex items-center gap-spacing-3', block && 'relative left-[6px]')}>
                            <Divider className='flex-1' orientation='horizontal' size='100%' />
                            <Text variant='small' className='shrink-0 uppercase'>
                                Advanced Options
                            </Text>
                            <Divider className='flex-1' orientation='horizontal' size='100%' />
                        </div>
                        <div className={clsx('flex flex-col gap-spacing-5', block && 'relative left-[6px]')}>
                            <BlockOption
                                icon={ArrowsCounterClockwiseIcon}
                                label='Sync across all schedules'
                                checked={draft.syncAcrossAllSchedules}
                                onChange={syncAcrossAllSchedules => {
                                    setDraftAtUnsync(syncAcrossAllSchedules ? undefined : draft);
                                    update({ syncAcrossAllSchedules });
                                }}
                            />
                            <BlockOption
                                icon={ProhibitIcon}
                                label='Conflict highlight'
                                checked={draft.conflictHighlight}
                                onChange={conflictHighlight => update({ conflictHighlight })}
                            />
                        </div>
                    </div>
                    {error && (
                        <Text role='alert' className='text-theme-red'>
                            {error}
                        </Text>
                    )}
                    {showValidation && (
                        <Text
                            as='div'
                            variant='small'
                            id={validationId}
                            role='alert'
                            className='rounded border border-theme-red/20 bg-theme-red/5 px-spacing-5 py-spacing-4 text-theme-red'
                        >
                            <ul className='m-0 list-none space-y-1 p-0'>
                                {validationErrors.map(message => (
                                    <li key={message}>{message}</li>
                                ))}
                            </ul>
                        </Text>
                    )}
                    <div className={clsx('flex justify-end gap-spacing-5', block && 'relative left-[6px]')}>
                        <Button color='ut-burntorange' variant='minimal' onClick={onClose}>
                            {block ? 'Discard Changes' : 'Cancel'}
                        </Button>
                        <Button
                            color={block ? 'ut-burntorange' : 'ut-green'}
                            icon={block ? CheckIcon : PlusIcon}
                            type='submit'
                            disabled={busy}
                        >
                            {block ? 'Save' : 'Add Block'}
                        </Button>
                    </div>
                </div>
            </Fieldset>
        </form>
    );
}
