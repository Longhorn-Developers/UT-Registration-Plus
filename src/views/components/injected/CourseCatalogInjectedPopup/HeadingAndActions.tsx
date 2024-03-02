import addCourse from '@pages/background/lib/addCourse';
import removeCourse from '@pages/background/lib/removeCourse';
import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { Button } from '@views/components/common/Button/Button';
import { Chip, flagMap } from '@views/components/common/Chip/Chip';
import Divider from '@views/components/common/Divider/Divider';
import Text from '@views/components/common/Text/Text';
import { openTabFromContentScript } from '@views/lib/openNewTabFromContentScript';
import React, { useState } from 'react';

import Add from '~icons/material-symbols/add';
import CalendarMonth from '~icons/material-symbols/calendar-month';
import CloseIcon from '~icons/material-symbols/close';
import Copy from '~icons/material-symbols/content-copy';
import Description from '~icons/material-symbols/description';
import Mood from '~icons/material-symbols/mood';
import Remove from '~icons/material-symbols/remove';
import Reviews from '~icons/material-symbols/reviews';

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
export const handleOpenCalendar = async () => {
    const url = chrome.runtime.getURL('calendar.html');
    await openTabFromContentScript(url);
};

/**
 * Renders the heading component for the CoursePopup component.
 *
 * @param {HeadingAndActionProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const HeadingAndActions: React.FC<HeadingAndActionProps> = ({ course, onClose, activeSchedule }) => {
    const { courseName, department, number: courseNumber, uniqueId, instructors, flags, schedule } = course;
    const courseAdded = activeSchedule.courses.some(ourCourse => ourCourse.uniqueId === uniqueId);

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
            return openTabFromContentScript(url);
        });
        await Promise.all(openTabs);
    };
    const handleOpenCES = async () => {
        // TODO: does not look up the professor just takes you to the page
        const cisUrl = 'https://utexas.bluera.com/utexas/rpvl.aspx?rid=d3db767b-049f-46c5-9a67-29c21c29c580&regl=en-US';
        await openTabFromContentScript(cisUrl);
    };
    const handleOpenPastSyllabi = async () => {
        // not specific to professor
        const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${courseNumber}&course_title=${courseName}&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search`;
        await openTabFromContentScript(url);
    };
    const handleAddOrRemoveCourse = async () => {
        if (!courseAdded) {
            await addCourse(activeSchedule.name, course);
        } else {
            await removeCourse(activeSchedule.name, course);
        }
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
                    <button className='bg-transparent p-0 btn' onClick={onClose}>
                        <CloseIcon className='h-7 w-7' />
                    </button>
                </div>
                <div className='flex gap-2.5 flex-content-center'>
                    <Text variant='h4' className='inline-flex items-center justify-center'>
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
                <Button variant='filled' color='ut-burntorange' icon={CalendarMonth} onClick={handleOpenCalendar} />
                <Divider orientation='vertical' size='28px' />
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
};

export default HeadingAndActions;
