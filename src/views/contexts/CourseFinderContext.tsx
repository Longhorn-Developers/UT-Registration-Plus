import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course } from '@shared/types/Course';
import { type UseCourseFinderReturn, useCourseFinder } from '@views/hooks/useCourseFinder';
import { type UseCourseFinderFormReturn, useCourseFinderForm } from '@views/hooks/useCourseFinderForm';
import {
    createContext,
    type Dispatch,
    type ReactNode,
    type RefObject,
    type SetStateAction,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from 'react';

/**
 * Opens and closes the Course Finder. Used by the calendar (whose sidebar shows it) and Quick Add (which links to it).
 */
export interface CourseFinderControls {
    /** Whether the sidebar is showing the Course Finder instead of the schedules */
    isOpen: boolean;
    /**
     * Shows the Course Finder in the sidebar (keeping the sidebar shown while it's open) and puts focus in its search.
     * @param returnFocusTo - What to focus once the Course Finder is closed, usually the button that opened it
     */
    open: (returnFocusTo?: HTMLElement | null) => void;
    /** Goes back to the schedules, putting focus back on what opened the Course Finder */
    close: () => void;
    /** The Course Finder's field of study input, which opening it focuses */
    searchInputRef: RefObject<HTMLInputElement | null>;
}

/**
 * The Course Finder's search, filters, and results
 */
export interface CourseFinderState {
    finder: UseCourseFinderReturn;
    form: UseCourseFinderFormReturn;
}

const CourseFinderControlsContext = createContext<CourseFinderControls | null>(null);
const CourseFinderStateContext = createContext<CourseFinderState | null>(null);
const CourseFinderPreviewContext = createContext<Course | null>(null);
const SetCourseFinderPreviewContext = createContext<Dispatch<SetStateAction<Course | null>> | null>(null);

/**
 * Holds the section being previewed on the calendar, apart from the rest of the Course Finder, so hovering over
 * sections only re-renders the calendar that draws the preview (its children keep their element identity).
 */
function CourseFinderPreviewProvider({ children }: { children: ReactNode }): ReactNode {
    const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

    return (
        <SetCourseFinderPreviewContext.Provider value={setPreviewCourse}>
            <CourseFinderPreviewContext.Provider value={previewCourse}>{children}</CourseFinderPreviewContext.Provider>
        </SetCourseFinderPreviewContext.Provider>
    );
}

/**
 * Holds the Course Finder for the calendar page, so its search, filters, and results are still there
 * after going back to the schedules and opening it again.
 *
 * Its state changes with every keystroke and every page of results, so it's provided separately from the controls:
 * only the Course Finder itself re-renders as it changes, not the whole calendar.
 */
export function CourseFinderProvider({ children }: { children: ReactNode }): ReactNode {
    const [isOpen, setIsOpen] = useState(false);
    const finder = useCourseFinder(isOpen);
    const form = useCourseFinderForm();
    const { setFieldOfStudySearch } = form;
    const searchInputRef = useRef<HTMLInputElement>(null);
    const returnFocusTo = useRef<HTMLElement | null>(null);

    // Focus moves a frame later, once what's being focused is rendered (and the sidebar is no longer inert)
    const open = useCallback((opener?: HTMLElement | null) => {
        returnFocusTo.current = opener ?? null;
        setIsOpen(true);
        requestAnimationFrame(() => searchInputRef.current?.focus());
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        // A field of study that was being typed but not picked is gone from the input once it's shown again
        setFieldOfStudySearch('');
        const opener = returnFocusTo.current;
        returnFocusTo.current = null;
        requestAnimationFrame(() => opener?.focus());
    }, [setFieldOfStudySearch]);

    const controls = useMemo(() => ({ isOpen, open, close, searchInputRef }), [isOpen, open, close]);

    return (
        <CourseFinderControlsContext.Provider value={controls}>
            <CourseFinderStateContext.Provider value={{ finder, form }}>
                <CourseFinderPreviewProvider>{children}</CourseFinderPreviewProvider>
            </CourseFinderStateContext.Provider>
        </CourseFinderControlsContext.Provider>
    );
}

/**
 * @returns what opens and closes the Course Finder, or null outside of the calendar page
 */
export const useCourseFinderControls = (): CourseFinderControls | null => useContext(CourseFinderControlsContext);

/**
 * @returns the Course Finder's search, filters, and results, or null outside of the calendar page
 */
export const useCourseFinderState = (): CourseFinderState | null => useContext(CourseFinderStateContext);

/**
 * @returns the section the Course Finder is previewing on the calendar (the one hovered over or focused in its
 * results), or null when there's none
 */
export const useCourseFinderPreview = (): Course | null => useContext(CourseFinderPreviewContext);

/**
 * @returns what sets the section the Course Finder previews on the calendar, or null outside of the calendar page
 */
export const useSetCourseFinderPreview = (): Dispatch<SetStateAction<Course | null>> | null =>
    useContext(SetCourseFinderPreviewContext);

/**
 * Whether the calendar sidebar is shown. The Course Finder keeps it shown while it's open, without changing the
 * saved preference, so a collapsed sidebar collapses again once the Course Finder is closed.
 *
 * @returns whether the sidebar is shown, and a function that collapses it (closing the Course Finder) or shows it
 */
export function useCalendarSidebar(): { isSidebarShown: boolean; toggleSidebar: () => void } {
    const courseFinder = useCourseFinderControls();
    const isSidebarPreferred = OptionsStore.useStore(store => store.showCalendarSidebar);
    const isCourseFinderOpen = courseFinder?.isOpen ?? false;
    const isSidebarShown = isSidebarPreferred || isCourseFinderOpen;

    const toggleSidebar = () => {
        if (isCourseFinderOpen) courseFinder?.close();
        void OptionsStore.set('showCalendarSidebar', !isSidebarShown);
    };

    return { isSidebarShown, toggleSidebar };
}
