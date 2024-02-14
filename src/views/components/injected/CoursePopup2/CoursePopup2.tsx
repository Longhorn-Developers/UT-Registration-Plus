import React from 'react';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import Popup from '../../common/Popup/Popup';
import CourseHeadingAndActions from './CourseHeadingAndActions';

interface CoursePopup2Props {
    course: Course;
    activeSchedule?: UserSchedule;
}

const CoursePopup2 = ({ course, activeSchedule }: CoursePopup2Props) => (
    <Popup className='px-6'>
        <div className='flex flex-col'>
            <CourseHeadingAndActions  course={course} />
        </div>
    </Popup>
);

export default CoursePopup2;
