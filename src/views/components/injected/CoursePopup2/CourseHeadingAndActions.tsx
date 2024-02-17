import React from 'react';
import { Course } from 'src/shared/types/Course';
import { Button } from '../../common/Button/Button';
import { Chip, flagMap } from '../../common/Chip/Chip';
import Icon from '../../common/Icon/Icon';
import Text from '../../common/Text/Text';

interface CourseHeadingAndActionsProps {
    course: Course;
    onClose: () => void;
}

const CourseHeadingAndActions = ({ course, onClose }: CourseHeadingAndActionsProps) => {
    const { courseName, department, number, uniqueId, instructors, flags, schedule } = course;
    const instructorString = instructors
        .map(instructor => {
            const firstInitial = instructor.firstName.length > 0 ? `${instructor.firstName.charAt(0)}. ` : '';
            return `${firstInitial}${instructor.lastName}`;
        })
        .join(', ');
    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex flex-col gap-1'>
                <div className='flex justify-center gap-1'>
                    <Text variant='h1' className='flex items-center'>
                        {courseName} ({department} {number})
                    </Text>
                    {/* TODO: change this button, include the left icon */}
                    <Button>{uniqueId}</Button>
                    <Button onClick={onClose}>
                        <Icon name='close' />
                    </Button>
                </div>
                <div className='flex gap-2.5 flex-content-center'>
                    <Text variant='h4' className='text-'>
                        with <span className='text-ut-burntorange underline'>{instructorString}</span>
                    </Text>
                    <div className='flex gap-1 flex-content-center'>
                        {flags.map(flag => (
                            <Chip label={flagMap[flag]} />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col'>
                    {schedule.meetings.map(meeting => (
                        <Text variant='h4'>
                            {meeting.getDaysString({ format: 'long', separator: 'long' })}{' '}
                            {meeting.getTimeString({ separator: ' to ', capitalize: false })}
                            {meeting.location && (
                                <>
                                    {` in `}
                                    <Text variant='h4' className='text-ut-burntorange underline'>
                                        {meeting.location.building}
                                    </Text>
                                </>
                            )}
                        </Text>
                    ))}
                </div>
            </div>
            <div className='my-3 flex justify-start gap-1'>
                <Button className='m0'>
                    <Icon name='calendar_today' />
                </Button>
                <Button>RateMyProf</Button>
            </div>
        </div>
    );
};

export default CourseHeadingAndActions;
