import React from 'react';
import addCourse from 'src/pages/background/lib/addCourse';
import openNewTab from 'src/pages/background/util/openNewTab';
import { Course } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import Add from '~icons/material-symbols/add';
import CalendarMonth from '~icons/material-symbols/calendar-month';
import CloseIcon from '~icons/material-symbols/close';
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
    /* The active schedule */
    activeSchedule: UserSchedule;
    /* The function to call when the popup should be closed */
    onClose: () => void;
}

/**
 * Renders the heading component for the CoursePopup component.
 *
 * @param {CourseHeadingAndActionsProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const CourseHeadingAndActions = ({ course, onClose, activeSchedule }: CourseHeadingAndActionsProps) => {
    const { courseName, department, number: courseNumber, uniqueId, instructors, flags, schedule, semester } = course;
    const instructorString = instructors
        .map(instructor => {
            const { firstName, lastName } = instructor;
            if (firstName === '') return lastName;
            return `${firstName} ${lastName}`;
        })
        .join(', ');

    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueId.toString());
    };

    const handleOpenRateMyProf = async () => {
        const openTabs = instructors.map(instructor => {
            const { fullName } = instructor;
            const url = `https://www.ratemyprofessors.com/search/professors/1255?q=${fullName}`;
            return openNewTab(url);
        });

        await Promise.all(openTabs);
    };

    const handleOpenCES = () => {
        // TODO: not implemented
    };

    const handleOpenPastSyllabi = async () => {
        const firstInstructor = instructors[0];
        const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=${semester}&department=${department}&course_number=${courseNumber}&course_title=${courseName}&unique=${uniqueId}&instructor_first=${firstInstructor.firstName}&instructor_last=${firstInstructor.lastName}&course_type=In+Residence&search=Search`;
        await openNewTab(url);
    };

    const handleAddCourse = async () => {
        await addCourse(activeSchedule.name, course);
    };

    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                    <Text variant='h1' className='truncate'>
                        {courseName}
                    </Text>
                    <Text variant='h1' className='flex-1 whitespace-nowrap'>
                        {' '}
                        ({department} {courseNumber})
                    </Text>
                    <Button color='ut-burntorange' variant='single' icon={Copy} onClick={handleCopy}>
                        {uniqueId}
                    </Button>
                    <button className='btn bg-transparent p-0' onClick={onClose}>
                        <CloseIcon className='h-7 w-7' />
                    </button>
                </div>
                <div className='flex gap-2.5 flex-content-center'>
                    <Text variant='h4' className='text-'>
                        with {instructorString}
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
            <div className='my-3 flex flex-wrap items-center gap-[15px]'>
                {/* TODO: make this open the calendar page */}
                <Button variant='filled' color='ut-burntorange' icon={CalendarMonth} />
                <Divider type='solid' color='ut-offwhite' className='h-7' />
                <Button variant='outline' color='ut-blue' icon={Reviews} onClick={handleOpenRateMyProf}>
                    RateMyProf
                </Button>
                <Button variant='outline' color='ut-teal' icon={Mood} onClick={handleOpenCES}>
                    CES
                </Button>
                <Button variant='outline' color='ut-orange' icon={Description} onClick={handleOpenPastSyllabi}>
                    Past Syllabi
                </Button>
                <Button variant='filled' color='ut-green' icon={Add} onClick={handleAddCourse}>
                    Add Course
                </Button>
            </div>
            <Divider />
        </div>
    );
};

export default CourseHeadingAndActions;
