import { createContext, useContext } from 'react';

/**
 * Context for the calendar.
 */
export const CalendarContext = createContext(false);

/**
 * @returns The calendar context.
 */
export const useCalendar = () => useContext(CalendarContext);
