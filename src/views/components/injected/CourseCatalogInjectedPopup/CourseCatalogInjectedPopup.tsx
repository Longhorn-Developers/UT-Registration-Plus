import Popup from '@views/components/common/Popup/Popup';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import Description from './Description';
import GradeDistribution from './GradeDistribution';
import HeadingAndActions from './HeadingAndActions';

interface CourseCatalogInjectedPopupProps {
    course: Course;
    activeSchedule?: UserSchedule;
    onClose: () => void;
}

const CourseCatalogInjectedPopup: React.FC<CourseCatalogInjectedPopupProps> = ({ course, activeSchedule, onClose }) => (
    <Popup overlay className='max-w-[780px] px-6' onClose={onClose}>
        <div className='flex flex-col'>
            <HeadingAndActions course={course} onClose={onClose} activeSchedule={activeSchedule} />
            <Description course={course} />
            <GradeDistribution course={course} />
        </div>
    </Popup>
);
export default CourseCatalogInjectedPopup;
