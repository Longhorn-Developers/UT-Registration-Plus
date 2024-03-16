import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import { Status } from '@shared/types/Course';
import type Instructor from '@shared/types/Instructor';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { Button } from '@views/components/common/Button/Button';
import { Chip, flagMap } from '@views/components/common/Chip/Chip';
import Divider from '@views/components/common/Divider/Divider';
import Text from '@views/components/common/Text/Text';
import React from 'react';

import Add from '~icons/material-symbols/add';
import CalendarMonth from '~icons/material-symbols/calendar-month';
import CloseIcon from '~icons/material-symbols/close';
import Copy from '~icons/material-symbols/content-copy';
import Description from '~icons/material-symbols/description';
import Mood from '~icons/material-symbols/mood';
import Remove from '~icons/material-symbols/remove';
import Reviews from '~icons/material-symbols/reviews';

const { openNewTab, addCourse, removeCourse, openCESPage } = background;

interface HeadingAndActionProps {
    /* The course to display */
    course: Course;
    /* The active schedule */
    activeSchedule: UserSchedule;
    /* The function to call when the popup should be closed */
    onClose: () => void;
}

/**
 * Opens the calendar in a new tab.
 * @returns {Promise<void>} A promise that resolves when the tab is opened.
 */
export const handleOpenCalendar = async (): Promise<void> => {
    const url = chrome.runtime.getURL('calendar.html');
    openNewTab({ url });
};

/**
 * Capitalizes the first letter of a string and converts the rest of the letters to lowercase.
 *
 * @param str - The string to be capitalized.
 * @returns The capitalized string.
 */
const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/**
 * Renders the heading component for the CoursePopup component.
 *
 * @param {HeadingAndActionProps} props - The component props.
 * @param {Course} props.course - The course object containing course details.
 * @param {Schedule} props.activeSchedule - The active schedule object.
 * @param {Function} props.onClose - The function to close the popup.
 * @returns {JSX.Element} The rendered component.
 */
export default function HeadingAndActions({ course, activeSchedule, onClose }: HeadingAndActionProps): JSX.Element {
    const { courseName, department, number: courseNumber, uniqueId, instructors, flags, schedule } = course;
    const courseAdded = activeSchedule.courses.some(ourCourse => ourCourse.uniqueId === uniqueId);

    const getInstructorFullName = (instructor: Instructor) => {
        const { firstName, lastName } = instructor;
        if (firstName === '') return capitalizeString(lastName);
        return `${capitalizeString(firstName)} ${capitalizeString(lastName)}`;
    };

    const instructorString = instructors.map(getInstructorFullName).join(', ');

    const handleCopy = () => {
        navigator.clipboard.writeText(uniqueId.toString());
    };

    const handleOpenRateMyProf = async () => {
        const openTabs = instructors.map(instructor => {
            const instructorSearchTerm = getInstructorFullName(instructor);
            instructorSearchTerm.replace(' ', '+');
            const url = `https://www.ratemyprofessors.com/search/professors/1255?q=${instructorSearchTerm}`;
            return openNewTab({ url });
        });
        await Promise.all(openTabs);
    };

    const handleOpenCES = async () => {
        const openTabs = instructors.map(instructor => {
            let { firstName, lastName } = instructor;
            firstName = capitalizeString(firstName);
            lastName = capitalizeString(lastName);
            return openCESPage({ instructorFirstName: firstName, instructorLastName: lastName });
        });
        await Promise.all(openTabs);
    };

    const handleOpenPastSyllabi = async () => {
        // not specific to professor
        const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${courseNumber}&course_title=${courseName}&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search`;
        openNewTab({ url });
    };

    const handleAddOrRemoveCourse = async () => {
        if (!activeSchedule) return;
        if (!courseAdded) {
            addCourse({ course, scheduleId: activeSchedule.id });
        } else {
            removeCourse({ course, scheduleId: activeSchedule.id });
        }
    };

    return (
        <div className='w-full pb-3 pt-6'>
            <div className='flex flex-col'>
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
                    <button className='bg-transparent p-0 btn' onClick={onClose}>
                        <CloseIcon className='h-7 w-7' />
                    </button>
                </div>
                <div className='flex gap-2 flex-content-center'>
                    {instructorString.length > 0 && (
                        <Text variant='h4' className='inline-flex items-center justify-center'>
                            with {instructorString}
                        </Text>
                    )}
                    <div className='flex-content-centr flex gap-1'>
                        {flags.map((flag: string) => (
                            <Chip
                                key={flagMap[flag as keyof typeof flagMap]}
                                label={flagMap[flag as keyof typeof flagMap]}
                            />
                        ))}
                    </div>
                </div>
                <div className='flex flex-col'>
                    {schedule.meetings.map(meeting => {
                        const daysString = meeting.getDaysString({ format: 'long', separator: 'long' });
                        const timeString = meeting.getTimeString({ separator: ' to ', capitalize: false });
                        const locationString = meeting.location ? ` in ${meeting.location.building}` : '';
                        return (
                            <Text key={daysString + timeString + locationString} variant='h4'>
                                {daysString} {timeString}
                                {locationString}
                            </Text>
                        );
                    })}
                </div>
            </div>
            <div className='my-3 flex flex-wrap items-center gap-[15px]'>
                <Button variant='filled' color='ut-burntorange' icon={CalendarMonth} onClick={handleOpenCalendar} />
                <Divider size='1.75rem' orientation='vertical' />
                <Button variant='outline' color='ut-blue' icon={Reviews} onClick={handleOpenRateMyProf}>
                    RateMyProf
                </Button>
                <Button variant='outline' color='ut-teal' icon={Mood} onClick={handleOpenCES}>
                    CES
                </Button>
                <Button variant='outline' color='ut-orange' icon={Description} onClick={handleOpenPastSyllabi}>
                    Past Syllabi
                </Button>
                <Button
                    variant='filled'
                    disabled={course.status !== Status.OPEN}
                    color={!courseAdded ? 'ut-green' : 'ut-red'}
                    icon={!courseAdded ? Add : Remove}
                    onClick={handleAddOrRemoveCourse}
                >
                    {!courseAdded ? 'Add Course' : 'Remove Course'}
                </Button>
            </div>
            <Divider orientation='horizontal' size='100%' />
        </div>
    );
}
