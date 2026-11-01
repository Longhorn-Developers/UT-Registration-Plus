import type { Serialized } from '@chrome-extension-toolkit';
import { Transition } from '@headlessui/react';
import { background } from '@shared/messages';
import { ScheduleHistoryStore } from '@shared/storage/ScheduleHistoryStore';
import { generateRandomId } from '@shared/util/random';
import { getShortcutDirection, type ScheduleChange } from '@shared/util/scheduleHistory';
import { ExtensionRootWrapper } from '@views/components/common/ExtensionRoot/ExtensionRoot';
import Text from '@views/components/common/Text/Text';
import useSchedules from '@views/hooks/useSchedules';
import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArrowClockwiseIcon from '~icons/ph/arrow-clockwise';
import ArrowCounterClockwiseIcon from '~icons/ph/arrow-counter-clockwise';
import XIcon from '~icons/ph/x';

/** How long a message stays up, unless it's hovered over or focused */
const TOAST_DURATION_MS = 6000;

/**
 * How long a message's button ignores clicks after it comes up. Undoing turns Undo into Redo in the same place, so the
 * second click of a double-click would otherwise redo what the first undid.
 */
const BUTTON_SETTLE_MS = 500;

interface Toast {
    id: string;
    text: string;
    shownAt: number;
    /**
     * What its button does, and the change it does it to, which has to be the next one to undo (or redo) for the
     * button to still do what the message says
     */
    action: { direction: 'undo' | 'redo'; changeId: string } | null;
}

/**
 * Undoing and redoing courses added to and removed from schedules on the calendar page, with the usual shortcuts. A
 * message comes up after a course is removed (from here, or from another page while this one is shown) with a button
 * to undo it, and after each undo or redo with a button to reverse it.
 */
export default function ScheduleHistoryToast(): JSX.Element {
    const { undo, redo } = ScheduleHistoryStore.useStore();
    const [activeSchedule, schedules] = useSchedules();
    const [toast, setToast] = useState<Toast | null>(null);
    const [isShown, setIsShown] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // The changes there already were when the page opened, or that were already shown, so each removal is shown once
    const seenIds = useRef<Set<string> | null>(null);
    seenIds.current ??= new Set([...undo, ...redo].map(change => change.id));

    const show = useCallback((next: Omit<Toast, 'id' | 'shownAt'>) => {
        setToast({ ...next, id: generateRandomId(), shownAt: Date.now() });
        setIsShown(true);
    }, []);

    // Names the schedule when it isn't the one being looked at, since undo reaches changes to any schedule
    const describe = useCallback(
        (change: Serialized<ScheduleChange>, verb: string) => {
            const name = `${verb} ${change.course.department} ${change.course.number}`;
            const schedule = schedules.find(s => s.id === change.scheduleId);
            return schedule && schedule.id !== activeSchedule.id ? `${name} in ${schedule.name}` : name;
        },
        [schedules, activeSchedule.id]
    );

    // Undoes (or redoes) the most recent change, or only the given one, like the one a message's button names
    // The button's step that's on its way, so another press doesn't send a second one
    const isStepping = useRef(false);

    const step = useCallback(
        async (direction: 'undo' | 'redo', changeId?: string) => {
            let change: Serialized<ScheduleChange> | undefined;
            try {
                const result =
                    direction === 'undo'
                        ? await background.undoScheduleChange({ changeId })
                        : await background.redoScheduleChange({ changeId });
                if ('error' in result) throw new Error(result.error);
                change = result.data;
            } catch (error) {
                console.error(`Failed to ${direction} the schedule change`, error);
                show({ text: `Couldn't ${direction} that`, action: null });
                return;
            }
            if (!change) {
                // A message's own change may no longer apply (like a removed course added back by hand), which isn't
                // the same as there being nothing (older) to undo
                const nothing = direction === 'undo' ? 'Nothing to undo' : 'Nothing to redo';
                show({ text: changeId === undefined ? nothing : `Can't ${direction} that anymore`, action: null });
                return;
            }

            seenIds.current?.add(change.id);
            const added = (change.type === 'add') === (direction === 'redo');
            show({
                text: added
                    ? describe(change, direction === 'undo' ? 'Added back' : 'Added')
                    : describe(change, 'Removed'),
                action: { direction: direction === 'undo' ? 'redo' : 'undo', changeId: change.id },
            });
        },
        [show, describe]
    );

    // A course that was just removed, here or (while this page is shown) in another tab
    const latest = undo.at(-1);
    useEffect(() => {
        if (!latest || seenIds.current?.has(latest.id)) return;
        seenIds.current?.add(latest.id);
        if (latest.type === 'remove' && document.visibilityState === 'visible') {
            show({ text: describe(latest, 'Removed'), action: { direction: 'undo', changeId: latest.id } });
        }
    }, [latest, show, describe]);

    // A message whose change isn't the next one to undo (or redo) is hidden: once another change comes along, it no
    // longer applies. Right after an undo, it waits for the history to catch up, if the answer got here first.
    const nextChangeId = { undo: undo.at(-1)?.id, redo: redo.at(-1)?.id };
    const isOutdated = !!toast?.action && nextChangeId[toast.action.direction] !== toast.action.changeId;
    const isVisible = isShown && !isOutdated;

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const direction = getShortcutDirection(e);
            if (!direction || e.defaultPrevented) return;
            // Typing keeps its own undo
            const target = e.composedPath()[0];
            if (
                target instanceof HTMLElement &&
                (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
            ) {
                return;
            }

            e.preventDefault();
            void step(direction);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [step]);

    // Goes away on its own, but not while it's being read or reached for
    // biome-ignore lint/correctness/useExhaustiveDependencies: a new message starts the time over
    useEffect(() => {
        if (!isShown || isPaused) return undefined;
        const timer = setTimeout(() => setIsShown(false), TOAST_DURATION_MS);
        return () => clearTimeout(timer);
    }, [isShown, isPaused, toast?.id]);

    const action = toast?.action;

    // Right in the page's body, above dialogs and still usable while one is open (like the course popup a course was
    // removed from). Not in Headless UI's portal: a dialog makes the other portals there inert, and counts a click in
    // them as a click outside it, which would close it.
    return createPortal(
        <ExtensionRootWrapper>
            {/* Always there, so screen readers announce each message as it changes */}
            <div role='status' aria-live='polite' className='sr-only'>
                {isVisible && toast?.text}
            </div>
            <Transition show={isVisible} afterLeave={() => setIsPaused(false)}>
                {/* biome-ignore lint/a11y/noStaticElementInteractions: hovering only keeps the message up */}
                <div
                    className='fixed bottom-spacing-6 left-1/2 z-60 flex items-center gap-spacing-4 rounded bg-content py-spacing-3 pl-spacing-5 pr-spacing-3 text-surface shadow-lg -translate-x-1/2 motion-safe:(transition duration-200 ease-out-expo) data-[closed]:(translate-y-2 opacity-0)'
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                >
                    <Text variant='small' className='whitespace-nowrap'>
                        {toast?.text}
                    </Text>
                    {action && (
                        <button
                            type='button'
                            className='flex cursor-pointer items-center gap-spacing-2 border-none rounded bg-transparent px-spacing-2 py-spacing-1 text-surface font-semibold underline-offset-2 btn-transition hover:underline active:scale-95 focusable'
                            onClick={async e => {
                                if (e.detail > 1 || isStepping.current) return;
                                if (toast && Date.now() - toast.shownAt < BUTTON_SETTLE_MS) return;
                                isStepping.current = true;
                                try {
                                    await step(action.direction, action.changeId);
                                } finally {
                                    isStepping.current = false;
                                }
                            }}
                            // Holding Enter would otherwise keep flipping between undo and redo
                            onKeyDown={e => {
                                if (e.repeat) e.preventDefault();
                            }}
                        >
                            {action.direction === 'undo' ? (
                                <ArrowCounterClockwiseIcon className='h-4 w-4' />
                            ) : (
                                <ArrowClockwiseIcon className='h-4 w-4' />
                            )}
                            <Text variant='small'>{action.direction === 'undo' ? 'Undo' : 'Redo'}</Text>
                        </button>
                    )}
                    <button
                        type='button'
                        className='flex cursor-pointer items-center border-none rounded bg-transparent p-spacing-1 text-surface/80 btn-transition hover:text-surface active:scale-95 focusable'
                        onClick={() => setIsShown(false)}
                        aria-label='Dismiss'
                        title='Dismiss'
                    >
                        <XIcon className='h-4 w-4' />
                    </button>
                </div>
            </Transition>
        </ExtensionRootWrapper>,
        document.body
    );
}
