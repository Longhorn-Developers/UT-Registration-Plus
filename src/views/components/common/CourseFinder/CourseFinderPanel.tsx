import { Button } from '@views/components/common/Button';
import Text from '@views/components/common/Text/Text';
import type { CourseFinderPreview } from '@views/contexts/CourseFinderContext';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import type { UseCourseFinderFormReturn } from '@views/hooks/useCourseFinderForm';
import type { Dispatch, JSX, Ref, SetStateAction } from 'react';
import { useId } from 'react';
import XIcon from '~icons/ph/x';

import CourseFinderFilters from './CourseFinderFilters';
import CourseFinderResults from './CourseFinderResults';
import CourseFinderSearch from './CourseFinderSearch';

/**
 * Whether a modal dialog is open, in the page or the shadow root the element is in. Headless UI's dialogs are modal only
 * while open (not while closing), and a calendar cell's color picker, also a dialog, isn't modal.
 */
function isDialogOpen(element: Element): boolean {
    const selector = '[role="dialog"][aria-modal="true"]';
    const root = element.getRootNode() as Document | ShadowRoot;
    return !!(root.querySelector(selector) ?? element.ownerDocument.querySelector(selector));
}

/**
 * Props for the CourseFinderPanel component
 */
export interface CourseFinderPanelProps {
    finder: UseCourseFinderReturn;
    form: UseCourseFinderFormReturn;
    /** Goes back to the schedules */
    onClose: () => void;
    /** The field of study input, which opening the Course Finder focuses */
    inputRef?: Ref<HTMLInputElement>;
    /** Sets the section to preview on the calendar, as sections are hovered over or focused */
    onPreviewChange?: Dispatch<SetStateAction<CourseFinderPreview | null>>;
}

/**
 * The Course Finder, shown in the calendar sidebar in place of the schedules: a search for a field of study, the
 * semester, filters that stay hidden until they're needed, and the results. It scrolls with the sidebar, with its title
 * staying at the top like the schedules' does. Takes its state as props so it can be rendered with mocked data.
 */
export default function CourseFinderPanel({
    finder,
    form,
    onClose,
    inputRef,
    onPreviewChange,
}: CourseFinderPanelProps): JSX.Element {
    const titleId = useId();

    return (
        // A fixed minimum width, so the text doesn't re-wrap on every frame of the sidebar's open/close animation
        <section
            aria-labelledby={titleId}
            className='w-full min-w-[17rem] flex flex-col gap-spacing-4 whitespace-normal'
            onKeyDown={e => {
                // Dropdowns and the field of study list handle (and prevent) Escape themselves while they're open.
                // Dialogs opened from here (like a section's stats) are rendered elsewhere in the page, but React still
                // passes their key presses up through here, so those are left to the dialog. A dialog can also leave
                // focus on the button that opened it (the stats popup does), so Escape is the dialog's while one is open.
                if (e.key !== 'Escape' || e.defaultPrevented || !e.currentTarget.contains(e.target as Node)) return;
                if (isDialogOpen(e.currentTarget)) return;
                onClose();
            }}
        >
            {/* Above the Dropdowns (z-30) as they scroll under it, but below the field of study list (z-50) */}
            <div className='sticky top-0 z-40 flex flex-row items-center justify-between bg-surface pt-1'>
                <Text as='h2' id={titleId} variant='h3' className='text-nowrap text-content'>
                    FIND A COURSE
                </Text>
                <Button
                    variant='minimal'
                    size='small'
                    color='theme-black'
                    className='!p-0'
                    onClick={onClose}
                    icon={XIcon}
                    title='Back to your schedules'
                    aria-label='Back to your schedules'
                />
            </div>
            <CourseFinderSearch finder={finder} form={form} inputRef={inputRef} />
            <CourseFinderFilters
                finder={finder}
                form={form}
                isOpen={form.areFiltersOpen}
                onOpenChange={form.setAreFiltersOpen}
            />
            <CourseFinderResults finder={finder} onPreviewChange={onPreviewChange} />
        </section>
    );
}
