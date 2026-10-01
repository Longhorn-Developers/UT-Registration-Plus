import { DialogTitle } from '@headlessui/react';
import { Button } from '@views/components/common/Button';
import Dialog from '@views/components/common/Dialog';
import Text from '@views/components/common/Text/Text';
import { type UseCourseFinderReturn, useCourseFinder } from '@views/hooks/useCourseFinder';
import type { JSX } from 'react';
import XIcon from '~icons/ph/x';

import CourseFinderFilters from './CourseFinderFilters';
import CourseFinderResults from './CourseFinderResults';
import CourseFinderSearch from './CourseFinderSearch';

/**
 * Props for the CourseFinder component
 */
export interface CourseFinderProps {
    finder: UseCourseFinderReturn;
    onClose: () => void;
}

/**
 * The contents of the Course Finder: a search form, filters, and the results.
 * Takes the finder state as a prop so it can be rendered with mocked data.
 */
export function CourseFinder({ finder, onClose }: CourseFinderProps): JSX.Element {
    return (
        <>
            <div className='flex flex-col gap-spacing-5 border-b border-ut-offwhite/50 px-spacing-7 pb-spacing-5 pt-spacing-6'>
                <div className='flex flex-row items-start justify-between gap-spacing-5'>
                    <div className='flex flex-col gap-spacing-1'>
                        <DialogTitle as={Text} variant='h3' className='text-ut-black'>
                            Find a Course
                        </DialogTitle>
                        <Text variant='small' className='text-ut-black/70'>
                            Search UT's course schedule by major, core curriculum, or course number.
                        </Text>
                    </div>
                    <Button
                        color='ut-black'
                        size='small'
                        variant='minimal'
                        icon={XIcon}
                        onClick={onClose}
                        title='Close'
                    />
                </div>
                <CourseFinderSearch finder={finder} />
                {finder.results.length > 0 && <CourseFinderFilters finder={finder} />}
            </div>
            <div className='min-h-0 flex-1 overflow-y-auto px-spacing-7 py-spacing-5'>
                <CourseFinderResults finder={finder} />
            </div>
        </>
    );
}

/**
 * Props for the CourseFinderDialog component
 */
export interface CourseFinderDialogProps {
    open: boolean;
    onClose: () => void;
}

/**
 * A dialog for finding courses to add to the active schedule, by major (field of study), core curriculum area,
 * or course number, and narrowing them down by credit hours, flags, instruction mode, status, and time conflicts.
 *
 * The search state lives outside the dialog, so the results are still there after closing and reopening it.
 */
export default function CourseFinderDialog({ open, onClose }: CourseFinderDialogProps): JSX.Element {
    const finder = useCourseFinder();

    return (
        <Dialog className='h-[85vh] w-[780px] max-w-[calc(100vw-1rem)] overflow-y-hidden' open={open} onClose={onClose}>
            <CourseFinder finder={finder} onClose={onClose} />
        </Dialog>
    );
}
