import Popup from '@views/components/common/Popup/Popup';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import CourseHeadingAndActions from './CourseHeadingAndActions';

interface CoursePopup2Props {
    course: Course;
    activeSchedule?: UserSchedule;
    onClose: () => void;
}

const CoursePopup = ({ course, activeSchedule, onClose }: CoursePopup2Props) => (
    <Popup overlay className='px-6' onClose={onClose}>
        <div className='flex flex-col'>
            <CourseHeadingAndActions course={course} onClose={onClose} activeSchedule={activeSchedule} />
        </div>
    </Popup>
);
export default CoursePopup;
