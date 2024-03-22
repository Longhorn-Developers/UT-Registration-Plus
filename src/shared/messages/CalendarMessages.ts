interface CalendarBackgroundMessages {
    /**
     * Opens the calendar page if it is not already open, focuses the tab, and optionally opens the calendar for a specific course
     *
     * @param data - The unique id of the course to open the calendar page for (optional)
     */
    switchToCalendarTab: (data: { uniqueId?: number }) => chrome.tabs.Tab;
}

interface CalendarTabMessages {
    /**
     * Opens a popup for a specific course on the calendar page
     *
     * @param data - The unique id of the course to open on the calendar page
     */
    openCoursePopup: (data: { uniqueId: number }) => chrome.tabs.Tab;
}

export type { CalendarBackgroundMessages, CalendarTabMessages };
