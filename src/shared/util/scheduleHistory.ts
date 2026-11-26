import type { Course } from '@shared/types/Course';

/**
 * The most changes that can be undone, oldest dropped first
 */
export const MAX_SCHEDULE_HISTORY = 50;

/**
 * A course added to or removed from a schedule, which can be undone (and then redone)
 */
export interface ScheduleChange {
    id: string;
    type: 'add' | 'remove';
    scheduleId: string;
    /** The course as it was in the schedule, with its colors, so undoing a removal brings it back as it was */
    course: Course;
    /** Where the course is (or was) in the schedule's courses, so undoing a removal puts it back in its place */
    index: number;
}

/**
 * The changes that can be undone, oldest first, and the ones that were undone and can be redone, most recently undone
 * last
 */
export interface ScheduleHistory {
    undo: ScheduleChange[];
    redo: ScheduleChange[];
}

/**
 * Adds a change to the history. A new change can't be redone over, so it clears what could be redone.
 *
 * @param history - The history so far
 * @param change - The change that was just made
 * @returns The history with the change at the end of what can be undone
 */
export function recordChange<T>(history: { undo: T[]; redo: T[] }, change: T): { undo: T[]; redo: T[] } {
    return { undo: [...history.undo, change].slice(-MAX_SCHEDULE_HISTORY), redo: [] };
}

/**
 * Makes a change (to redo it) or reverses it (to undo it) on a schedule's courses.
 *
 * @param courses - The schedule's courses
 * @param change - The change to make or reverse
 * @param direction - Whether to undo or redo the change
 * @returns The schedule's courses afterwards, or null if the change no longer applies, like a removed course that was
 * added back by hand since
 */
export function applyChange<C extends Pick<Course, 'uniqueId'>>(
    courses: C[],
    change: Pick<ScheduleChange, 'type' | 'index'> & { course: C },
    direction: 'undo' | 'redo'
): C[] | null {
    const { uniqueId } = change.course;
    const isInSchedule = courses.some(c => c.uniqueId === uniqueId);
    const adds = (change.type === 'add') === (direction === 'redo');

    if (adds) {
        if (isInSchedule) return null;
        const next = [...courses];
        next.splice(Math.min(change.index, next.length), 0, change.course);
        return next;
    }

    if (!isInSchedule) return null;
    return courses.filter(c => c.uniqueId !== uniqueId);
}

type ShortcutKeyEvent = Pick<KeyboardEvent, 'key' | 'code' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'altKey'>;

/**
 * Whether a key press is the shortcut to undo (Ctrl+Z, or ⌘Z on a Mac) or redo (Ctrl+Shift+Z or Ctrl+Y, or ⌘⇧Z). On a
 * keyboard layout without Latin letters, the shortcuts are on the keys where Z and Y would be.
 */
export function getShortcutDirection(e: ShortcutKeyEvent): 'undo' | 'redo' | null {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return null;
    // Only a letter from another alphabet falls back to the key's place, so a symbol (like ; where Z is on Dvorak) or
    // a dead key doesn't count
    const isOtherAlphabet = /^\p{L}$/u.test(e.key) && !/^[a-z]$/i.test(e.key);
    const key = isOtherAlphabet ? e.code.replace(/^Key/, '').toLowerCase() : e.key.toLowerCase();
    if (key === 'z') return e.shiftKey ? 'redo' : 'undo';
    if (key === 'y' && e.ctrlKey && !e.shiftKey) return 'redo';
    return null;
}
