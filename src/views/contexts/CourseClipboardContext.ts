import type { Course } from '@shared/types/Course';
import { createContext, useContext } from 'react';

/**
 * State representing course copy/paste clipboard operations.
 */
export interface CourseClipboardState {
    /** The course currently copied to the clipboard */
    copiedCourse: Course | null;
    /** Sets the course currently copied to the clipboard */
    setCopiedCourse: (course: Course | null) => void;
    /** The course cell that is currently hovered or focused */
    hoveredCourse: Course | null;
    /** Sets the currently hovered or focused course */
    setHoveredCourse: (course: Course | null) => void;
    /** Clears the copied course from the clipboard */
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
