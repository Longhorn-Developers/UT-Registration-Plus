import type { Course } from '@shared/types/Course';
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface RemovedCourse {
    course: Course;
    scheduleId: string;
}

interface UndoContextType {
    removedCourses: RemovedCourse[];
    setLastRemovedCourse: (course: Course | null, scheduleId: string) => void;
    clearRemovedCourses: () => void;
    popLastRemovedCourse: () => RemovedCourse | undefined;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

/**
 * Provider component for undo functionality.
 * Tracks removed courses in a stack so users can undo multiple times with Cmd+Z / Ctrl+Z.
 */
export function UndoProvider({ children }: { children: ReactNode }): JSX.Element {
    const [removedCourses, setRemovedCourses] = useState<RemovedCourse[]>([]);

    const setLastRemovedCourse = useCallback((course: Course | null, scheduleId: string) => {
        if (course) {
            setRemovedCourses(prev => [...prev, { course, scheduleId }]);
        }
    }, []);

    const clearRemovedCourses = useCallback(() => {
        setRemovedCourses([]);
    }, []);

    const popLastRemovedCourse = useCallback(() => {
        let popped: RemovedCourse | undefined;
        setRemovedCourses(prev => {
            if (prev.length === 0) {
                return prev;
            }
            const newStack = [...prev];
            popped = newStack.pop();
            return newStack;
        });
        return popped;
    }, []);

    return (
        <UndoContext.Provider
            value={{
                removedCourses,
                setLastRemovedCourse,
                clearRemovedCourses,
                popLastRemovedCourse,
            }}
        >
            {children}
        </UndoContext.Provider>
    );
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

