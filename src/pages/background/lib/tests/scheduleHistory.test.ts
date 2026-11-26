import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { changeSchedule, redoScheduleChange, undoScheduleChange } from '../scheduleHistory';

// The two stores, in memory
const stores = vi.hoisted(() => {
    const make = <T extends object>(initial: T) => {
        let state = { ...initial };
        return {
            reset: (next: T) => {
                state = { ...next };
            },
            state: () => state,
            get: vi.fn(async (key: keyof T) => structuredClone(state[key])),
            set: vi.fn(async (keyOrValues: keyof T | Partial<T>, value?: unknown) => {
                state =
                    typeof keyOrValues === 'object'
                        ? { ...state, ...structuredClone(keyOrValues) }
                        : { ...state, [keyOrValues]: structuredClone(value) };
            }),
        };
    };
    return {
        history: make<{ undo: unknown[]; redo: unknown[] }>({ undo: [], redo: [] }),
        schedules: make<{ schedules: unknown[] }>({ schedules: [] }),
    };
});

vi.mock('@shared/storage/ScheduleHistoryStore', () => ({ ScheduleHistoryStore: stores.history }));
vi.mock('@shared/storage/UserScheduleStore', () => ({ UserScheduleStore: stores.schedules }));

type TestCourse = { uniqueId: number; department: string; number: string };
const course = (uniqueId: number): TestCourse => ({ uniqueId, department: 'C S', number: String(uniqueId) });
const schedule = (id: string, courses: TestCourse[]) => ({ id, name: id, courses, updatedAt: 0 });
const courseIds = (scheduleId = 's1') =>
    (stores.schedules.state().schedules as ReturnType<typeof schedule>[])
        .find(s => s.id === scheduleId)
        ?.courses.map(c => c.uniqueId);
const change = (id: string, type: 'add' | 'remove', uniqueId: number, scheduleId = 's1', index = 0) => ({
    id,
    type,
    scheduleId,
    course: course(uniqueId),
    index,
});
const addition = (uniqueId: number, index: number) =>
    ({ type: 'add', scheduleId: 's1', course: course(uniqueId), index }) as never;

beforeEach(() => {
    stores.history.reset({ undo: [], redo: [] });
    stores.schedules.reset({ schedules: [schedule('s1', [course(1), course(2)])] });
    stores.history.get.mockClear();
    stores.history.set.mockClear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('changeSchedule', () => {
    it('records the change it makes, which clears what could be redone', async () => {
        stores.history.reset({ undo: [], redo: [change('old', 'remove', 9)] });

        await changeSchedule(async () => addition(3, 2));

        const { undo, redo } = stores.history.state();
        expect(undo).toHaveLength(1);
        expect(undo[0]).toMatchObject({ type: 'add', scheduleId: 's1', index: 2 });
        expect(redo).toEqual([]);
    });

    it('records nothing when nothing changed, and still finishes when recording fails', async () => {
        await changeSchedule(async () => undefined);
        expect(stores.history.set).not.toHaveBeenCalled();

        vi.spyOn(console, 'error').mockImplementation(() => {});
        stores.history.set.mockRejectedValueOnce(new Error('Storage is full'));
        await expect(changeSchedule(async () => addition(3, 2))).resolves.toBeUndefined();
    });
});

describe('undoScheduleChange', () => {
    it('undoes the latest change and moves it to what can be redone', async () => {
        stores.schedules.reset({ schedules: [schedule('s1', [course(1)])] });
        stores.history.reset({ undo: [change('a', 'remove', 2, 's1', 1)], redo: [] });

        expect((await undoScheduleChange())?.id).toBe('a');
        expect(courseIds()).toEqual([1, 2]);
        expect(stores.history.state()).toMatchObject({ undo: [], redo: [{ id: 'a' }] });

        expect((await redoScheduleChange())?.id).toBe('a');
        expect(courseIds()).toEqual([1]);
    });

    it('skips changes that no longer apply when undoing whatever is latest', async () => {
        // 1 is in the schedule again, so its removal can't be undone, but 3's can
        stores.history.reset({ undo: [change('three', 'remove', 3), change('one', 'remove', 1)], redo: [] });

        expect((await undoScheduleChange())?.id).toBe('three');
        expect(courseIds()).toEqual([3, 1, 2]);
        expect(stores.history.state().undo).toEqual([]);
    });

    it("undoes a named change only if it's the latest, and never an older one in its place", async () => {
        stores.history.reset({ undo: [change('three', 'remove', 3), change('one', 'remove', 1)], redo: [] });

        // Not the latest
        expect(await undoScheduleChange('three')).toBeUndefined();
        expect(stores.history.state().undo).toHaveLength(2);

        // The latest, but it no longer applies: it's dropped, and 3's removal is left alone
        expect(await undoScheduleChange('one')).toBeUndefined();
        expect(stores.history.state().undo).toMatchObject([{ id: 'three' }]);
        expect(courseIds()).toEqual([1, 2]);
    });

    it('undoes two changes when asked twice at once, rather than the same one twice', async () => {
        stores.schedules.reset({ schedules: [schedule('s1', [])] });
        stores.history.reset({ undo: [change('a', 'remove', 1), change('b', 'remove', 2)], redo: [] });

        const [first, second] = await Promise.all([undoScheduleChange(), undoScheduleChange()]);

        expect([first?.id, second?.id]).toEqual(['b', 'a']);
        expect(courseIds()?.sort()).toEqual([1, 2]);
    });

    it('drops a change to a schedule that was deleted', async () => {
        stores.history.reset({ undo: [change('gone', 'remove', 5, 'deleted')], redo: [] });

        expect(await undoScheduleChange()).toBeUndefined();
        expect(stores.history.state().undo).toEqual([]);
    });
});
