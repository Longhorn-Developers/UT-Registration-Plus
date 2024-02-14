import React from 'react';
import { Course } from 'src/shared/types/Course';
import Text from '../../common/Text/Text';
import { Button } from '../../common/Button/Button';

interface CourseHeadingAndActionsProps {
    course: Course;
}

const CourseHeadingAndActions = ({ course }: CourseHeadingAndActionsProps) => {
    const { courseName, department, number, uniqueId } = course;
    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex gap-1'>
                <Text variant='h1'>
                    {courseName} ({department} {number})
                </Text>
                <Button>{uniqueId}</Button>
            </div>
        </div>
    );
};

export default CourseHeadingAndActions;
