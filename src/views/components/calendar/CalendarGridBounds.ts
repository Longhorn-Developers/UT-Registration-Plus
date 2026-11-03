import { createContext, type RefObject } from 'react';

export const CalendarGridBounds = createContext<RefObject<HTMLDivElement | null> | null>(null);
