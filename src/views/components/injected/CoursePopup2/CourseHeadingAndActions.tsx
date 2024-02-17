import React from 'react';
import { Course } from 'src/shared/types/Course';
import Add from '~icons/material-symbols/add';
import CalendarMonth from '~icons/material-symbols/calendar-month';
import Close from '~icons/material-symbols/close';
import Copy from '~icons/material-symbols/content-copy';
import Description from '~icons/material-symbols/description';
import Mood from '~icons/material-symbols/mood';
import Reviews from '~icons/material-symbols/reviews';
import { Button } from '../../common/Button/Button';
import { Chip, flagMap } from '../../common/Chip/Chip';
import Divider from '../../common/Divider/Divider';
import Text from '../../common/Text/Text';

interface CourseHeadingAndActionsProps {
    /* The course to display */
    course: Course;
    /* The function to call when the popup should be closed */
    onClose: () => void;
}

/**
 * Renders the heading component for the CoursePopup component.
 *
 * @param {CourseHeadingAndActionsProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const CourseHeadingAndActions = ({ course, onClose }: CourseHeadingAndActionsProps) => {
    const { courseName, department, number, uniqueId, instructors, flags, schedule } = course;
    const instructorString = instructors
        .map(instructor => {
            const firstInitial = instructor.firstName.length > 0 ? `${instructor.firstName.charAt(0)}. ` : '';
            return `${firstInitial}${instructor.lastName}`;
        })
        .join(', ');

    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueId.toString());
    };

    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex flex-col gap-1'>
                <div className='flex justify-center gap-1'>
                    <Text variant='h1' className='flex items-center'>
                        {courseName} ({department} {number})
                    </Text>
                    {/* need to do handlers */}
                    <div className='ml-3'>
                        <Button color='ut-burntorange' variant='single' icon={Copy} onClick={handleCopy}>
                            {uniqueId}
                        </Button>
                    </div>
                    <Button variant='single' icon={Close} color='ut-black' onClick={onClose} />
                </div>
                <div className='flex gap-2.5 flex-content-center'>
                    <Text variant='h4' className='text-'>
                        with <span className='text-ut-burntorange underline'>{instructorString}</span>
                    </Text>
                    <div className='flex-content-centr flex gap-1'>
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
            <div className='my-3 h-[40px] flex items-center gap-[15px]'>
                <Button variant='filled' color='ut-burntorange' icon={CalendarMonth} />
                <Divider type='solid' color='ut-offwhite' className='h-[28px]' />
                <Button variant='outline' color='ut-blue' icon={Reviews}>
                    RateMyProf
                </Button>
                <Button variant='outline' color='ut-teal' icon={Mood}>
                    CES
                </Button>
                <Button variant='outline' color='ut-orange' icon={Description}>
                    Past Syllabi
                </Button>
                <Button variant='filled' color='ut-green' icon={Add}>
                    Add Course
                </Button>
            </div>
        </div>
    );
};

export default CourseHeadingAndActions;
