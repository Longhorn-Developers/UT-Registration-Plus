import type { Course } from '@shared/types/Course';
import { createContext, useContext } from 'react';

/**
 * State representing course copy/paste clipboard operations.
 */
export interface CourseClipboardState {
    copiedCourse: Course | null;
    setCopiedCourse: (course: Course | null) => void;
    hoveredCourse: Course | null;
    setHoveredCourse: (course: Course | null) => void;
    clearClipboard: () => void;
}

const defaultContext: CourseClipboardState = {
    copiedCourse: null,
    setCopiedCourse: () => {},
    hoveredCourse: null,
    setHoveredCourse: () => {},
    clearClipboard: () => {},
};

/**
 * Context for copying and pasting courses between schedules.
 */
export const CourseClipboardContext = createContext<CourseClipboardState>(defaultContext);

/**
 * Hook to access the course clipboard context.
 */
export const useCourseClipboard = (): CourseClipboardState => useContext(CourseClipboardContext);
