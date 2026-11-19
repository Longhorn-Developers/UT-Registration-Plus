import type { Serialized } from '@chrome-extension-toolkit';
import { ScheduleHistoryStore } from '@shared/storage/ScheduleHistoryStore';
import { UserScheduleStore } from '@shared/storage/UserScheduleStore';
import { generateRandomId } from '@shared/util/random';
import { applyChange, recordChange, type ScheduleChange } from '@shared/util/scheduleHistory';

// Changes to the history run one at a time, so pressing undo quickly doesn't undo the same change twice
let queue: Promise<unknown> = Promise.resolve();
const oneAtATime = <T>(operation: () => Promise<T>): Promise<T> => {
    const result = queue.then(operation);
    queue = result.catch(() => {});
    return result;
};

/**
 * Adds a course to or removes one from a schedule, and records the change so it can be undone. Both happen in turn
 * with undoing and redoing, so an undo can't land between the change and its record. Recording is best-effort: a
 * change that couldn't be recorded still happened.
 *
 * @param operation - Makes the change, and returns it (without an ID), or nothing if nothing changed
 */
export function changeSchedule(
    operation: () => Promise<Omit<Serialized<ScheduleChange>, 'id'> | undefined>
): Promise<void> {
    return oneAtATime(async () => {
        const change = await operation();
        if (!change) return;

        try {
            const [undo, redo] = await Promise.all([
                ScheduleHistoryStore.get('undo'),
                ScheduleHistoryStore.get('redo'),
            ]);
            await ScheduleHistoryStore.set(recordChange({ undo, redo }, { ...change, id: generateRandomId() }));
        } catch (error) {
            console.error("Failed to record the schedule change, so it can't be undone", error);
        }
    });
}

/**
 * Undoes the most recent change that can still be undone. Changes that no longer apply (like a removed course that
 * was added back by hand, or one from a deleted schedule) are dropped along the way.
 *
 * @param changeId - The change to undo, if it has to be that one: then nothing else is undone in its place, if it isn't
 * the most recent change or no longer applies
 * @returns The change that was undone, if there was one
 */
export const undoScheduleChange = (changeId?: string) => oneAtATime(() => step('undo', changeId));

/**
 * Redoes the most recently undone change that can still be redone, dropping ones that no longer apply.
 *
 * @param changeId - The change to redo, if it has to be that one
 * @returns The change that was redone, if there was one
 */
export const redoScheduleChange = (changeId?: string) => oneAtATime(() => step('redo', changeId));

async function step(direction: 'undo' | 'redo', changeId?: string): Promise<Serialized<ScheduleChange> | undefined> {
    const history = {
        undo: [...(await ScheduleHistoryStore.get('undo'))],
        redo: [...(await ScheduleHistoryStore.get('redo'))],
    };
    const [from, to] = direction === 'undo' ? [history.undo, history.redo] : [history.redo, history.undo];

    if (changeId !== undefined && from.at(-1)?.id !== changeId) return undefined;

    let stepped: Serialized<ScheduleChange> | undefined;
    while (!stepped && from.length > 0) {
        // biome-ignore lint/style/noNonNullAssertion: the loop only runs while there's a change left
        const change = from.pop()!;
        if (await applyToSchedule(change, direction)) {
            to.push(change);
            stepped = change;
        } else if (changeId !== undefined) {
            break;
        }
    }

    await ScheduleHistoryStore.set(history);
    return stepped;
}

async function applyToSchedule(change: Serialized<ScheduleChange>, direction: 'undo' | 'redo'): Promise<boolean> {
    const schedules = await UserScheduleStore.get('schedules');
    const schedule = schedules.find(s => s.id === change.scheduleId);
    if (!schedule) return false;

    const courses = applyChange(schedule.courses, change, direction);
    if (!courses) return false;

    schedule.courses = courses;
    schedule.updatedAt = Date.now();
    await UserScheduleStore.set('schedules', schedules);
    return true;
}
