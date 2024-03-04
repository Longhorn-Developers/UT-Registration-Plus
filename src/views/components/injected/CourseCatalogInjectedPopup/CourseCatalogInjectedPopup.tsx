import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import Popup from '@views/components/common/Popup/Popup';
import React from 'react';

import Description from './Description';
import GradeDistribution from './GradeDistribution';
import HeadingAndActions from './HeadingAndActions';

interface CourseCatalogInjectedPopupProps {
    course: Course;
    activeSchedule: UserSchedule;
    onClose: () => void;
}

/**
 * CourseCatalogInjectedPopup component displays a popup with course details.
 *
 * @component
 * @param {CourseCatalogInjectedPopupProps} props - The component props.
 * @param {Course} props.course - The course object containing course details.
 * @param {Schedule} props.activeSchedule - The active schedule object.
 * @param {Function} props.onClose - The function to close the popup.
 * @returns {JSX.Element} The CourseCatalogInjectedPopup component.
 */
export default function CourseCatalogInjectedPopup({
    course,
    activeSchedule,
    onClose,
}: CourseCatalogInjectedPopupProps): JSX.Element {
    return (
        <Popup overlay className='max-w-[780px] px-6' onClose={onClose}>
            <div className='flex flex-col'>
                <HeadingAndActions course={course} onClose={onClose} activeSchedule={activeSchedule} />
                <Description course={course} />
                <GradeDistribution course={course} />
            </div>
        </Popup>
    );
}
