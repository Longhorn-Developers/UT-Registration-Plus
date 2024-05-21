import { createContext, useContext } from 'react';

/**
 * Data for the calendar.
 */
export type CalendarData = {
    isInCalendar: boolean;
};

/**
 * Context for the calendar.
 */
export const CalendarContext = createContext<CalendarData>({
    isInCalendar: false,
});

/**
 * @returns The calendar context.
 */
export const useCalendar = () => useContext(CalendarContext);
