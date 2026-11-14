import { Course } from '@shared/types/Course';
import { bevoCourse, chatterjeeCS429Course, mikeScottCS314Course } from 'src/stories/injected/mocked';
import { describe, expect, it } from 'vitest';

import {
    applyChange,
    getShortcutDirection,
    MAX_SCHEDULE_HISTORY,
    recordChange,
    type ScheduleChange,
} from '../scheduleHistory';

const change = (type: ScheduleChange['type'], course: Course, index = 0, id = `${type}-${course.uniqueId}`) => ({
    id,
    type,
    scheduleId: 'schedule',
    course,
    index,
});

const ids = (courses: Course[] | null) => courses?.map(c => c.uniqueId) ?? null;

describe('recordChange', () => {
    it('adds the change to what can be undone and clears what can be redone', () => {
        const history = { undo: [change('add', bevoCourse)], redo: [change('remove', mikeScottCS314Course)] };

        expect(recordChange(history, change('remove', chatterjeeCS429Course))).toEqual({
            undo: [change('add', bevoCourse), change('remove', chatterjeeCS429Course)],
            redo: [],
        });
    });

    it('keeps only the most recent changes', () => {
        let history = { undo: [] as ScheduleChange[], redo: [] as ScheduleChange[] };
        for (let i = 0; i < MAX_SCHEDULE_HISTORY + 5; i++) {
            history = recordChange(history, change('add', bevoCourse, 0, String(i)));
        }

        expect(history.undo).toHaveLength(MAX_SCHEDULE_HISTORY);
        expect(history.undo[0]?.id).toBe('5');
        expect(history.undo.at(-1)?.id).toBe(String(MAX_SCHEDULE_HISTORY + 4));
    });
});

describe('applyChange', () => {
    const courses = [bevoCourse, mikeScottCS314Course];

    it('puts a removed course back where it was when undoing the removal, and takes it out again when redoing it', () => {
        const removal = change('remove', chatterjeeCS429Course, 1);

        const undone = applyChange(courses, removal, 'undo');
        expect(ids(undone)).toEqual([
            bevoCourse.uniqueId,
            chatterjeeCS429Course.uniqueId,
            mikeScottCS314Course.uniqueId,
        ]);
        expect(ids(applyChange(undone ?? [], removal, 'redo'))).toEqual(ids(courses));
    });

    it('takes an added course out when undoing the addition, and puts it back when redoing it', () => {
        const addition = change('add', mikeScottCS314Course, 1);

        const undone = applyChange(courses, addition, 'undo');
        expect(ids(undone)).toEqual([bevoCourse.uniqueId]);
        expect(ids(applyChange(undone ?? [], addition, 'redo'))).toEqual(ids(courses));
    });

    it('puts a course at the end when the schedule has fewer courses than it had', () => {
        expect(ids(applyChange([bevoCourse], change('remove', chatterjeeCS429Course, 5), 'undo'))).toEqual([
            bevoCourse.uniqueId,
            chatterjeeCS429Course.uniqueId,
        ]);
    });

    it("doesn't apply a change that no longer fits the schedule", () => {
        // Added back by hand since it was removed
        expect(applyChange(courses, change('remove', mikeScottCS314Course), 'undo')).toBeNull();
        // Removed by hand since it was added
        expect(applyChange(courses, change('add', chatterjeeCS429Course), 'undo')).toBeNull();
        expect(applyChange(courses, change('remove', chatterjeeCS429Course), 'redo')).toBeNull();
    });

    it('keeps the colors the course had', () => {
        const colored = new Course({
            ...chatterjeeCS429Course,
            colors: { primaryColor: '#123456', secondaryColor: '#654321' },
        });

        expect(applyChange(courses, change('remove', colored), 'undo')?.[0]?.colors).toEqual(colored.colors);
    });
});

const press = (
    key: string,
    modifiers: { ctrl?: boolean; meta?: boolean; shift?: boolean; alt?: boolean } = {},
    code = `Key${key.toUpperCase()}`
) =>
    getShortcutDirection({
        key,
        code,
        ctrlKey: modifiers.ctrl ?? false,
        metaKey: modifiers.meta ?? false,
        shiftKey: modifiers.shift ?? false,
        altKey: modifiers.alt ?? false,
    });

describe('getShortcutDirection', () => {
    it('undoes with Ctrl+Z or ⌘Z', () => {
        expect(press('z', { ctrl: true })).toBe('undo');
        expect(press('z', { meta: true })).toBe('undo');
    });

    it('redoes with Ctrl+Shift+Z, ⌘⇧Z, or Ctrl+Y', () => {
        // With Shift held, the key comes through as a capital Z
        expect(press('Z', { ctrl: true, shift: true })).toBe('redo');
        expect(press('Z', { meta: true, shift: true })).toBe('redo');
        expect(press('y', { ctrl: true })).toBe('redo');
    });

    it('uses the keys where Z and Y would be on a layout without Latin letters', () => {
        // Russian: the Z key types я, and the Y key types н
        expect(press('я', { ctrl: true }, 'KeyZ')).toBe('undo');
        expect(press('Я', { ctrl: true, shift: true }, 'KeyZ')).toBe('redo');
        expect(press('н', { ctrl: true }, 'KeyY')).toBe('redo');
    });

    it('goes by the letter on a Latin layout, wherever its key is', () => {
        // German: Z and Y swap places
        expect(press('z', { ctrl: true }, 'KeyY')).toBe('undo');
        expect(press('y', { ctrl: true }, 'KeyZ')).toBe('redo');
    });

    it("doesn't take a symbol or dead key for the letter whose place it's in", () => {
        // Dvorak: ; is where Z is on QWERTY
        expect(press(';', { ctrl: true }, 'KeyZ')).toBeNull();
        expect(press(':', { ctrl: true, shift: true }, 'KeyZ')).toBeNull();
        expect(press('Dead', { ctrl: true }, 'KeyZ')).toBeNull();
    });

    it('ignores other keys and modifiers', () => {
        expect(press('z')).toBeNull();
        expect(press('z', { ctrl: true, alt: true })).toBeNull();
        // ⌘Y opens the browser's history on a Mac
        expect(press('y', { meta: true })).toBeNull();
        expect(press('x', { ctrl: true })).toBeNull();
    });
});
