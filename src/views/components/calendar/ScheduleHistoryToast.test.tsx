import { DialogPanel, Dialog as HDialog } from '@headlessui/react';
import type { ReactNode } from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScheduleHistoryToast from './ScheduleHistoryToast';

// The undo history, the schedules, and the background, without the extension around them
const h = vi.hoisted(() => {
    type History = { undo: unknown[]; redo: unknown[] };
    let state: History = { undo: [], redo: [] };
    const listeners = new Set<() => void>();
    return {
        get: () => state,
        set: (next: History) => {
            state = next;
            for (const listener of listeners) listener();
        },
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        undo: vi.fn(),
        redo: vi.fn(),
    };
});

vi.mock('@shared/storage/ScheduleHistoryStore', async () => {
    const { useSyncExternalStore } = await import('react');
    return { ScheduleHistoryStore: { useStore: () => useSyncExternalStore(h.subscribe, h.get) } };
});
vi.mock('@views/hooks/useSchedules', () => {
    const schedules = [
        { id: 'active', name: 'Fall 2026' },
        { id: 'other', name: 'Plan B' },
    ];
    return { default: () => [schedules[0], schedules] };
});
vi.mock('@shared/messages', () => ({ background: { undoScheduleChange: h.undo, redoScheduleChange: h.redo } }));
// Like the real one, renders into a shadow root of its own (without the extension's styles)
vi.mock('@views/components/common/ExtensionRoot/ExtensionRoot', async () => {
    const { useState } = await import('react');
    const { createPortal } = await import('react-dom');
    return {
        ExtensionRootWrapper: ({ children }: { children: ReactNode }) => {
            const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
            return (
                <div
                    data-testid='toast-root'
                    ref={element => {
                        if (element && !element.shadowRoot) setShadowRoot(element.attachShadow({ mode: 'open' }));
                    }}
                >
                    {shadowRoot && createPortal(children, shadowRoot)}
                </div>
            );
        },
    };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const removal = (id: string, number: string, scheduleId = 'active') => ({
    id,
    type: 'remove',
    scheduleId,
    course: { department: 'C S', number, uniqueId: Number(id.charCodeAt(0)) },
    index: 0,
});

/** Every element in the page, through shadow roots */
const allElements = () => {
    const elements: Element[] = [];
    const walk = (root: ParentNode) => {
        for (const element of root.querySelectorAll('*')) {
            elements.push(element);
            if (element.shadowRoot) walk(element.shadowRoot);
        }
    };
    walk(document.body);
    return elements;
};
const status = () => allElements().find(e => e.getAttribute('role') === 'status')?.textContent ?? '';
const button = (name: string) =>
    allElements().find(
        e => e.tagName === 'BUTTON' && (e.textContent?.trim() === name || e.getAttribute('aria-label') === name)
    );
const click = async (element: Element | undefined, detail = 1) => {
    if (!element) throw new Error('Nothing to click');
    await act(async () => {
        for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
            element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, composed: true, detail }));
        }
    });
};
const setHistory = (undo: unknown[], redo: unknown[] = []) => act(async () => h.set({ undo, redo }));

// The time, which moves on only when a test says so, so the button's settling time can be waited out
let now = 1_000_000;
const wait = (ms: number) => {
    now += ms;
};

let roots: Root[] = [];
const render = (node: ReactNode) => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    roots.push(root);
    act(() => root.render(node));
};

beforeEach(() => {
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    h.set({ undo: [], redo: [] });
});

afterEach(() => {
    act(() => {
        for (const root of roots) root.unmount();
    });
    roots = [];
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    h.undo.mockReset();
    h.redo.mockReset();
});

describe('ScheduleHistoryToast', () => {
    it('shows every removal, after one was dismissed and while one is up', async () => {
        render(<ScheduleHistoryToast />);
        const a = removal('a', '314');
        const b = removal('b', '429');
        const c = removal('c', '303E');

        await setHistory([a]);
        expect(status()).toBe('Removed C S 314');

        await click(button('Dismiss'));
        expect(status()).toBe('');

        await setHistory([a, b]);
        expect(status()).toBe('Removed C S 429');

        await setHistory([a, b, c]);
        expect(status()).toBe('Removed C S 303E');
    });

    it('names the schedule when it is not the one shown', async () => {
        render(<ScheduleHistoryToast />);
        await setHistory([removal('a', '314', 'other')]);
        expect(status()).toBe('Removed C S 314 in Plan B');
    });

    it('undoes only the change it names, and shows the redo once the history catches up', async () => {
        render(<ScheduleHistoryToast />);
        const a = removal('a', '314');
        await setHistory([a]);
        h.undo.mockResolvedValue({ data: a });

        // The answer gets here before the history does
        wait(1000);
        await click(button('Undo'));
        expect(h.undo).toHaveBeenCalledWith({ changeId: 'a' });

        await setHistory([], [a]);
        expect(status()).toBe('Added back C S 314');
    });

    it("doesn't redo with the second click of a double-click, or a click right as it comes up", async () => {
        render(<ScheduleHistoryToast />);
        const a = removal('a', '314');
        await setHistory([a]);
        h.undo.mockResolvedValue({ data: a });

        wait(1000);
        await click(button('Undo'));
        await setHistory([], [a]);
        expect(status()).toBe('Added back C S 314');

        // The same button is Redo now
        await click(button('Redo'), 2);
        wait(100);
        await click(button('Redo'));
        expect(h.redo).not.toHaveBeenCalled();

        h.redo.mockResolvedValue({ data: a });
        wait(1000);
        await click(button('Redo'));
        expect(h.redo).toHaveBeenCalledWith({ changeId: 'a' });
    });

    it("doesn't send a second undo while one is on its way", async () => {
        render(<ScheduleHistoryToast />);
        const a = removal('a', '314');
        await setHistory([a]);
        let answer: (result: unknown) => void = () => {};
        h.undo.mockReturnValue(
            new Promise(resolve => {
                answer = resolve;
            })
        );

        wait(1000);
        await click(button('Undo'));
        await click(button('Undo'));
        expect(h.undo).toHaveBeenCalledTimes(1);

        await act(async () => answer({ data: a }));
    });

    it('ignores Enter held down on its button', async () => {
        render(<ScheduleHistoryToast />);
        await setHistory([removal('a', '314')]);

        const held = new KeyboardEvent('keydown', { key: 'Enter', repeat: true, bubbles: true, cancelable: true });
        await act(async () => {
            button('Undo')?.dispatchEvent(held);
        });
        // Keeps the browser from clicking it again
        expect(held.defaultPrevented).toBe(true);
    });

    it("leaves Ctrl+Z to a text field that's being typed in", async () => {
        render(
            <>
                <input aria-label='Name' />
                <ScheduleHistoryToast />
            </>
        );
        const input = allElements().find(e => e.tagName === 'INPUT');

        await act(async () => {
            input?.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true, bubbles: true })
            );
        });
        expect(h.undo).not.toHaveBeenCalled();
    });

    it("says so when its change can't be undone anymore", async () => {
        render(<ScheduleHistoryToast />);
        await setHistory([removal('a', '314')]);
        // Added back by hand since, so the background drops it
        h.undo.mockResolvedValue({ data: undefined });

        wait(1000);
        await click(button('Undo'));
        expect(status()).toBe("Can't undo that anymore");
    });

    it('goes away once a newer change would make its button do something else', async () => {
        render(<ScheduleHistoryToast />);
        await setHistory([removal('a', '314')]);
        expect(status()).toBe('Removed C S 314');

        // Adding a course doesn't bring up a message of its own
        await setHistory([removal('a', '314'), { ...removal('b', '429'), type: 'add' }]);
        expect(status()).toBe('');
    });

    it('says so when undoing fails', async () => {
        render(<ScheduleHistoryToast />);
        h.undo.mockResolvedValue({ error: 'Storage is full' });
        vi.spyOn(console, 'error').mockImplementation(() => {});

        await act(async () => {
            window.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true, bubbles: true })
            );
        });
        expect(h.undo).toHaveBeenCalledWith({ changeId: undefined });
        expect(status()).toBe("Couldn't undo that");
    });

    it('can be clicked without closing a dialog that opened after it, as on the calendar page', async () => {
        const onClose = vi.fn();
        // In one tree, like the calendar page, which renders the course popup and this side by side
        render(
            <>
                <ScheduleHistoryToast />
                <HDialog open onClose={onClose}>
                    <DialogPanel>
                        <button type='button'>Remove</button>
                    </DialogPanel>
                </HDialog>
            </>
        );
        await setHistory([removal('a', '314')]);
        h.undo.mockResolvedValue({ data: undefined });

        wait(1000);
        await click(button('Undo'));
        expect(h.undo).toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
        expect(allElements().find(e => e.getAttribute('data-testid') === 'toast-root')?.parentElement).toBe(
            document.body
        );
    });
});
