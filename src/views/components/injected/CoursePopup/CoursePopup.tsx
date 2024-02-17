import Popup from '@views/components/common/Popup/Popup';
import React from 'react';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import CoursePopupDescriptions from './CoursePopupDescriptions';
import CoursePopupHeadingAndActions from './CoursePopupHeadingAndActions';

interface CoursePopup2Props {
    course: Course;
    activeSchedule?: UserSchedule;
    onClose: () => void;
}

const CoursePopup = ({ course, activeSchedule, onClose }: CoursePopup2Props) => (
    <Popup overlay className='max-w-[780px] px-6' onClose={onClose}>
        <div className='flex flex-col'>
            <CoursePopupHeadingAndActions course={course} onClose={onClose} activeSchedule={activeSchedule} />
            <CoursePopupDescriptions lines={course.description} />
        </div>
    </Popup>
);
export default CoursePopup;
