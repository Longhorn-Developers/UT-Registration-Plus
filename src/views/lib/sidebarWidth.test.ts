import { describe, expect, it } from 'vitest';

import {
    clampSidebarWidth,
    getDraggedSidebarWidth,
    SIDEBAR_COLLAPSE_WIDTH,
    SIDEBAR_DEFAULT_WIDTH,
    SIDEBAR_MAX_WIDTH,
    SIDEBAR_MIN_WIDTH,
} from './sidebarWidth';

describe('sidebarWidth::clampSidebarWidth', () => {
    it('keeps widths within the limits, rounded', () => {
        expect(clampSidebarWidth(300.4)).toBe(300);
        expect(clampSidebarWidth(100)).toBe(SIDEBAR_MIN_WIDTH);
        expect(clampSidebarWidth(2000)).toBe(SIDEBAR_MAX_WIDTH);
    });

    it('falls back to the default for a width that is not a number', () => {
        expect(clampSidebarWidth(Number.NaN)).toBe(SIDEBAR_DEFAULT_WIDTH);
        expect(clampSidebarWidth(Number.POSITIVE_INFINITY)).toBe(SIDEBAR_DEFAULT_WIDTH);
    });
});

describe('sidebarWidth::getDraggedSidebarWidth', () => {
    it('measures the width from the left of the sidebar', () => {
        expect(getDraggedSidebarWidth(350, 10)).toEqual({ collapsed: false, width: 340 });
    });

    it('stops at the limits', () => {
        expect(getDraggedSidebarWidth(SIDEBAR_COLLAPSE_WIDTH + 1, 0)).toEqual({
            collapsed: false,
            width: SIDEBAR_MIN_WIDTH,
        });
        expect(getDraggedSidebarWidth(900, 0)).toEqual({ collapsed: false, width: SIDEBAR_MAX_WIDTH });
    });

    it('collapses once dragged past half the minimum width', () => {
        expect(getDraggedSidebarWidth(SIDEBAR_COLLAPSE_WIDTH - 1, 0)).toEqual({ collapsed: true });
        expect(getDraggedSidebarWidth(-50, 0)).toEqual({ collapsed: true });
    });
});
