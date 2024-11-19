import type { Course } from '@shared/types/Course';
import type { DialogProps } from '@views/components/common/Dialog';
import Dialog from '@views/components/common/Dialog';
import useSchedules from '@views/hooks/useSchedules';
import React from 'react';

import Description from './Description';
import GradeDistribution from './GradeDistribution';
import HeadingAndActions from './HeadingAndActions';

/**
 * Props for the CourseCatalogInjectedPopup component.
 */
export interface CourseCatalogInjectedPopupProps extends DialogProps {
    course: Course;
}

/**
 * CourseCatalogInjectedPopup component displays a popup with course details.
 *
 * @param course - The course object containing course details.
 * @param activeSchedule - The active schedule object.
 * @param onClose - The function to close the popup.
 * @returns The CourseCatalogInjectedPopup component.
 */
function CourseCatalogInjectedPopup({ course, ...rest }: CourseCatalogInjectedPopupProps): JSX.Element {
    const emptyRef = React.useRef<HTMLDivElement>(null);
    const [activeSchedule] = useSchedules();

    return (
        <Dialog className='max-w-[780px] overflow-y-hidden px-4' {...rest} initialFocus={emptyRef}>
            <div className='hidden' ref={emptyRef} />
            <HeadingAndActions course={course} onClose={rest.onClose as () => void} activeSchedule={activeSchedule} />
            <div className='overflow-y-auto px-2'>
                <Description course={course} />
                <GradeDistribution course={course} />
            </div>
        </Dialog>
    );
}

export default React.memo(CourseCatalogInjectedPopup);
