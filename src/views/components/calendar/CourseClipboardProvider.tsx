import { background } from '@shared/messages';
import { Course } from '@shared/types/Course';
import Toast, { type ToastType } from '@views/components/common/Toast';
import { CourseClipboardContext } from '@views/contexts/CourseClipboardContext';
import { getActiveSchedule } from '@views/hooks/useSchedules';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ToastState {
    message: ReactNode;
    type: ToastType;
}

export function CourseClipboardProvider({ children }: { children: ReactNode }) {
    const [copiedCourse, setCopiedCourseState] = useState<Course | null>(null);
    const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);
    const [toast, setToast] = useState<ToastState | null>(null);

    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hoveredCourseRef = useRef<Course | null>(null);
    hoveredCourseRef.current = hoveredCourse;

    const copiedCourseRef = useRef<Course | null>(null);
    copiedCourseRef.current = copiedCourse;

    const showToast = useCallback((message: ReactNode, type: ToastType = 'info', duration = 3000) => {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, duration);
    }, []);

    const setCopiedCourse = useCallback(
        (course: Course | null) => {
            setCopiedCourseState(course);
            if (course) {
                showToast(`${course.department} ${course.number} copied — switch schedule & Ctrl+V to paste`, 'info');
            }
        },
        [showToast]
    );

    const clearClipboard = useCallback(() => {
        setCopiedCourseState(null);
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (target) {
                const tagName = target.tagName;
                if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                const currentHovered = hoveredCourseRef.current;
                if (currentHovered) {
                    e.preventDefault();
                    setCopiedCourse(currentHovered);
                }
                return;
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                const currentCopied = copiedCourseRef.current;
                if (!currentCopied) return;

                e.preventDefault();
                const activeSchedule = getActiveSchedule();
                if (!activeSchedule || activeSchedule.id === 'error') return;

                if (activeSchedule.containsCourse(currentCopied)) {
                    showToast(
                        `${currentCopied.department} ${currentCopied.number} is already in ${activeSchedule.name}`,
                        'warning'
                    );
                    return;
                }

                const courseCopy = new Course(JSON.parse(JSON.stringify(currentCopied)));
                background.addCourse({
                    scheduleId: activeSchedule.id,
                    course: courseCopy,
                    hasColor: false,
                });

                showToast(
                    `${currentCopied.department} ${currentCopied.number} pasted into ${activeSchedule.name}`,
                    'success'
                );
                setCopiedCourseState(null);
                return;
            }

            if (e.key === 'Escape' && copiedCourseRef.current) {
                clearClipboard();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [clearClipboard, setCopiedCourse, showToast]);

    return (
        <CourseClipboardContext.Provider
            value={{
                copiedCourse,
                setCopiedCourse,
                hoveredCourse,
                setHoveredCourse,
                clearClipboard,
            }}
        >
            {children}
            {toast && (
                <div className='fixed bottom-6 left-1/2 z-100 -translate-x-1/2'>
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                </div>
            )}
        </CourseClipboardContext.Provider>
    );
}
