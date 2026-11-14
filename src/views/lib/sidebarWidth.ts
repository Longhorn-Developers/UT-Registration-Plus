/** The calendar sidebar's width before it could be resized, in px (20.3125rem) */
export const SIDEBAR_DEFAULT_WIDTH = 325;

/** The narrowest the calendar sidebar can be, in px, with its logo and resource links (which don't wrap) still fitting */
export const SIDEBAR_MIN_WIDTH = 300;

/** The widest the calendar sidebar can be, in px, so the calendar keeps most of the page */
export const SIDEBAR_MAX_WIDTH = 480;

/** Dragging the sidebar's edge narrower than this collapses the sidebar, like VS Code's */
export const SIDEBAR_COLLAPSE_WIDTH = SIDEBAR_MIN_WIDTH / 2;

/** The largest share of the window the sidebar can take, so narrow windows still leave room for the calendar */
export const SIDEBAR_MAX_WINDOW_SHARE = 0.35;

/**
 * Works out the widest the sidebar can be in a window of a given width
 *
 * @param windowWidth - the window's width, in px
 * @returns {@link SIDEBAR_MAX_WINDOW_SHARE} of the window, rounded down and kept between {@link SIDEBAR_MIN_WIDTH}
 * and {@link SIDEBAR_MAX_WIDTH}, or {@link SIDEBAR_MAX_WIDTH} if the window's width isn't a number
 */
export function getMaxSidebarWidth(windowWidth: number): number {
    if (!Number.isFinite(windowWidth)) return SIDEBAR_MAX_WIDTH;
    return Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, Math.floor(windowWidth * SIDEBAR_MAX_WINDOW_SHARE)));
}

/**
 * Keeps a sidebar width within the sidebar's limits
 *
 * @param width - the width in px, which may be a stored value from before the limits changed
 * @param maxWidth - the widest the sidebar can be, which is less than {@link SIDEBAR_MAX_WIDTH} in narrow windows
 * @returns the width, rounded and between {@link SIDEBAR_MIN_WIDTH} and `maxWidth`
 */
export function clampSidebarWidth(width: number, maxWidth: number = SIDEBAR_MAX_WIDTH): number {
    if (!Number.isFinite(width)) return Math.min(SIDEBAR_DEFAULT_WIDTH, maxWidth);
    return Math.round(Math.min(maxWidth, Math.max(SIDEBAR_MIN_WIDTH, width)));
}

/**
 * Works out what dragging the sidebar's edge to a point does
 *
 * @param pointerX - where the pointer is, in px from the left of the viewport
 * @param sidebarLeft - where the sidebar starts, in px from the left of the viewport
 * @param maxWidth - the widest the sidebar can be, which is less than {@link SIDEBAR_MAX_WIDTH} in narrow windows
 * @returns the width the sidebar takes, or `collapsed` if the drag has gone far enough left to collapse it
 */
export function getDraggedSidebarWidth(
    pointerX: number,
    sidebarLeft: number,
    maxWidth: number = SIDEBAR_MAX_WIDTH
): { collapsed: true } | { collapsed: false; width: number } {
    const width = pointerX - sidebarLeft;
    if (width < SIDEBAR_COLLAPSE_WIDTH) return { collapsed: true };
    return { collapsed: false, width: clampSidebarWidth(width, maxWidth) };
}
