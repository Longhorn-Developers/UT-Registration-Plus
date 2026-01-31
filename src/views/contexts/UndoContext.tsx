import type { Course } from '@shared/types/Course';
import React from 'react';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface UndoContextType {
    lastRemovedCourse: { course: Course; scheduleId: string } | null;
    setLastRemovedCourse: (course: Course, scheduleId: string) => void;
    clearLastRemovedCourse: () => void;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

/**
 * Provider component for undo functionality.
 * Tracks the last removed course so users can undo with Cmd+Z / Ctrl+Z.
 */
export function UndoProvider({ children }: { children: ReactNode }): JSX.Element {
    const [lastRemovedCourse, setLastRemovedCourseState] = useState<{
        course: Course;
        scheduleId: string;
    } | null>(null);

    const setLastRemovedCourse = useCallback((course: Course, scheduleId: string) => {
        setLastRemovedCourseState({ course, scheduleId });
    }, []);

    const clearLastRemovedCourse = useCallback(() => {
        setLastRemovedCourseState(null);
    }, []);

    // ✅ memoized context value (fixes eslint error)
    const value = useMemo(
        () => ({
            lastRemovedCourse,
            setLastRemovedCourse,
            clearLastRemovedCourse,
        }),
        [lastRemovedCourse, setLastRemovedCourse, clearLastRemovedCourse]
    );

    return <UndoContext.Provider value={value}>{children}</UndoContext.Provider>;
}

/**
 * Hook to access undo functionality.
 * @returns Undo context with last removed course and helper functions.
 */
export function useUndo(): UndoContextType {
    const context = useContext(UndoContext);
    if (context === undefined) {
        throw new Error('useUndo must be used within an UndoProvider');
    }
    return context;
}
