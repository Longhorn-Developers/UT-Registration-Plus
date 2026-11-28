import type { UserSchedule } from '@shared/types/UserSchedule';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdvancedSettings } from './AdvancedSettings';

// Its styles come from Vite's virtual modules, which aren't built when the tests run
vi.mock('@views/components/common/ExtensionRoot/ShadowRootContainer', () => ({
    ensureShadowStyles: () => {},
}));

// Lets React know updates in these tests are wrapped in act()
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

const schedule = { id: 'a', name: 'Plan', courses: [], hours: 0, updatedAt: 1 } as unknown as UserSchedule;

const render = (scheduleSync: boolean) =>
    act(() =>
        root.render(
            <AdvancedSettings
                highlightConflicts={false}
                loadAllCourses={false}
                increaseScheduleLimit={false}
                calendarNewTab={false}
                scheduleSync={scheduleSync}
                scheduleSyncProblem={null}
                enableReducedMotion={false}
                enableDataRefreshing={false}
                enableCourseStatusChips={false}
                enableThemesBeta={false}
                theme='light'
                activeSchedule={schedule}
                handleEraseAll={() => {}}
                handleImportClick={async () => {}}
            />
        )
    );

/** What a screen reader reads out for each switch: its aria-labelledby, or its aria-label */
const switchNames = () =>
    [...container.querySelectorAll('[role=switch]')].map(control => {
        const labelledBy = control.getAttribute('aria-labelledby');
        if (!labelledBy) return control.getAttribute('aria-label');
        return labelledBy
            .split(' ')
            .map(id => document.getElementById(id)?.textContent?.trim())
            .join(' ');
    });

beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

describe('AdvancedSettings', () => {
    it('names the Sync Schedules switch for screen readers', () => {
        render(true);
        expect(switchNames()).toContain('Sync Schedules');
    });

    it.each([true, false])('says erasing can reach the other computers, with sync %s', syncOn => {
        render(syncOn);
        expect(container.textContent).toContain('if Sync Schedules is on, on your other synced computers');
    });
});
