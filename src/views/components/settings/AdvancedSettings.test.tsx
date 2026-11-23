import { hasDataCollectionPermissions, setDiagnosticReportingEnabled } from '@shared/diagnosticReporting';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { act, useSyncExternalStore } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AdvancedSettings } from './AdvancedSettings';

const state = vi.hoisted(() => ({
    preference: true,
    granted: false,
    storeListeners: new Set<() => void>(),
    added: new Set<() => void>(),
    removed: new Set<() => void>(),
}));

vi.mock('@shared/storage/OptionsStore', () => ({
    OptionsStore: {
        set: vi.fn(),
        useStore: (select: (options: { enableDiagnosticReporting: boolean }) => boolean) =>
            useSyncExternalStore(
                listener => {
                    state.storeListeners.add(listener);
                    return () => state.storeListeners.delete(listener);
                },
                () => select({ enableDiagnosticReporting: state.preference })
            ),
    },
}));
vi.mock('@shared/diagnosticReporting', () => ({
    DIAGNOSTIC_DATA_TYPES: ['technicalAndInteraction', 'browsingActivity', 'websiteContent'],
    hasDataCollectionPermissions: vi.fn(),
    setDiagnosticReportingEnabled: vi.fn(),
}));
vi.mock('webextension-polyfill', () => ({
    default: {
        permissions: {
            onAdded: {
                addListener: (fn: () => void) => state.added.add(fn),
                removeListener: (fn: () => void) => state.added.delete(fn),
            },
            onRemoved: {
                addListener: (fn: () => void) => state.removed.add(fn),
                removeListener: (fn: () => void) => state.removed.delete(fn),
            },
        },
    },
}));
vi.mock('@views/components/calendar/utils', () => ({ handleExportJson: vi.fn() }));
vi.mock('./Preview', () => ({ default: () => null }));

let container: HTMLDivElement;
let root: Root;
const getSwitch = () => {
    const element = container.querySelector<HTMLButtonElement>('[aria-label="Error and Performance Reporting"]');
    if (!element) throw new Error('Missing reporting toggle');
    return element;
};
const render = () =>
    act(async () =>
        root.render(
            <AdvancedSettings
                highlightConflicts
                loadAllCourses
                increaseScheduleLimit={false}
                calendarNewTab={false}
                enableReducedMotion={false}
                enableDataRefreshing
                enableCourseStatusChips
                enableThemesBeta={false}
                theme='light'
                activeSchedule={{ id: 'test' } as UserSchedule}
                handleEraseAll={() => {}}
                handleImportClick={async () => {}}
            />
        )
    );

beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('__BROWSER__', 'firefox');
    state.preference = true;
    state.granted = false;
    vi.mocked(hasDataCollectionPermissions).mockImplementation(async () => state.granted);
    vi.mocked(setDiagnosticReportingEnabled).mockImplementation(async enabled => {
        if (enabled && __BROWSER__ === 'firefox' && !state.granted) return false;
        state.preference = enabled;
        state.storeListeners.forEach(listener => {
            listener();
        });
        return enabled && state.granted;
    });
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});
afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    expect(state.storeListeners.size).toBe(0);
    expect(state.added.size).toBe(0);
    expect(state.removed.size).toBe(0);
});

it('places the reporting toggle between Reduced Motion and Export Current Schedule', async () => {
    await render();
    const text = container.textContent ?? '';
    expect(text.indexOf('Reduced Motion')).toBeLessThan(text.indexOf('Error and Performance Reporting'));
    expect(text.indexOf('Error and Performance Reporting')).toBeLessThan(text.indexOf('Export Current Schedule'));
});

it('shows the default-on preference on Chrome without Firefox permissions', async () => {
    vi.stubGlobal('__BROWSER__', 'chrome');
    await render();
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
    expect(hasDataCollectionPermissions).not.toHaveBeenCalled();
});

it('stays off on Firefox when the default-on preference has no browser consent', async () => {
    await render();
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
    await act(async () => getSwitch().click());
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('permission was not granted');
});

it('waits for permission instead of showing an optimistic enabled state', async () => {
    await render();
    let resolve: (enabled: boolean) => void = () => {};
    vi.mocked(setDiagnosticReportingEnabled).mockReturnValue(
        new Promise(done => {
            resolve = done;
        })
    );
    await act(async () => getSwitch().click());
    expect(getSwitch().disabled).toBe(true);
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
    await act(async () => resolve(false));
    expect(getSwitch().disabled).toBe(false);
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
});

it('reflects granted and revoked Firefox permissions while settings stay open', async () => {
    await render();
    await act(async () => {
        state.granted = true;
        state.added.forEach(listener => {
            listener();
        });
    });
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
    await act(async () => {
        state.granted = false;
        state.removed.forEach(listener => {
            listener();
        });
    });
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
});

it('clears a permission-denied message when consent is later granted in Firefox', async () => {
    await render();
    await act(async () => getSwitch().click());
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    await act(async () => {
        state.granted = true;
        state.added.forEach(listener => {
            listener();
        });
    });
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
    expect(container.querySelector('[role="alert"]')).toBeNull();
});

it('reflects preference changes made in another open context', async () => {
    vi.stubGlobal('__BROWSER__', 'chrome');
    await render();
    await act(async () => {
        state.preference = false;
        state.storeListeners.forEach(listener => {
            listener();
        });
    });
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
});

it('lets Chrome users turn reporting off and back on', async () => {
    vi.stubGlobal('__BROWSER__', 'chrome');
    await render();
    await act(async () => getSwitch().click());
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
    await act(async () => getSwitch().click());
    expect(getSwitch().getAttribute('aria-checked')).toBe('true');
});

it('ignores an older permission result after a newer revocation check', async () => {
    let resolve: (granted: boolean) => void = () => {};
    vi.mocked(hasDataCollectionPermissions).mockImplementationOnce(
        () =>
            new Promise(done => {
                resolve = done;
            })
    );
    await render();
    await act(async () => {
        state.removed.forEach(listener => {
            listener();
        });
    });
    await act(async () => resolve(true));
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
});

it('keeps the toggle off and explains a failed permission request', async () => {
    await render();
    vi.mocked(setDiagnosticReportingEnabled).mockRejectedValue(new Error('Request failed'));
    await act(async () => getSwitch().click());
    expect(getSwitch().getAttribute('aria-checked')).toBe('false');
    expect(container.querySelector('[role="alert"]')?.textContent).toContain('Please try again');
});
