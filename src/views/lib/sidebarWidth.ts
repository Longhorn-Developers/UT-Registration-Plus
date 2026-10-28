/** The calendar sidebar's width before it could be resized, in px (20.3125rem) */
export const SIDEBAR_DEFAULT_WIDTH = 325;

/** The narrowest the calendar sidebar can be, in px, with its logo and resource links (which don't wrap) still fitting */
export const SIDEBAR_MIN_WIDTH = 300;

/** The widest the calendar sidebar can be, in px, so the calendar keeps most of the page */
export const SIDEBAR_MAX_WIDTH = 480;

/** Dragging the sidebar's edge narrower than this collapses the sidebar, like VS Code's */
export const SIDEBAR_COLLAPSE_WIDTH = SIDEBAR_MIN_WIDTH / 2;

/**
 * Keeps a sidebar width within the sidebar's limits
 *
 * @param width - the width in px, which may be a stored value from before the limits changed
 * @returns the width, rounded and between {@link SIDEBAR_MIN_WIDTH} and {@link SIDEBAR_MAX_WIDTH}
 */
export function clampSidebarWidth(width: number): number {
    if (!Number.isFinite(width)) return SIDEBAR_DEFAULT_WIDTH;
    return Math.round(Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width)));
}

/**
 * Works out what dragging the sidebar's edge to a point does
 *
 * @param pointerX - where the pointer is, in px from the left of the viewport
 * @param sidebarLeft - where the sidebar starts, in px from the left of the viewport
 * @returns the width the sidebar takes, or `collapsed` if the drag has gone far enough left to collapse it
 */
export function getDraggedSidebarWidth(
    pointerX: number,
    sidebarLeft: number
): { collapsed: true } | { collapsed: false; width: number } {
    const width = pointerX - sidebarLeft;
    if (width < SIDEBAR_COLLAPSE_WIDTH) return { collapsed: true };
    return { collapsed: false, width: clampSidebarWidth(width) };
}
