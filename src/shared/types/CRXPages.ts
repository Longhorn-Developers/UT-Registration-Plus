/**
 * An object containing the paths to various pages used in the CRX application.
 */
export const CRX_PAGES = {
    DEBUG: '/debug.html',
    CALENDAR: '/calendar.html',
    OPTIONS: '/options.html',
    MAP: '/map.html',
    REPORT: '/report.html',
} as const;

/**
 * Represents a type that corresponds to the keys of the `CRX_PAGES` object.
 * This type is used to ensure that only valid page keys are used within the application.
 */
export type CRX_Page = keyof typeof CRX_PAGES;
