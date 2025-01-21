import { ArrowUpRight, CalendarDots, ChatText, Copy, FileText, Minus, Plus, Smiley, X } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import type Instructor from '@shared/types/Instructor';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { Button } from '@views/components/common/Button';
import { Chip, coreMap, flagMap } from '@views/components/common/Chip';
import Divider from '@views/components/common/Divider';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import { useCalendar } from '@views/contexts/CalendarContext';
import React from 'react';

import DisplayMeetingInfo from './DisplayMeetingInfo';

const { openNewTab, addCourse, removeCourse, openCESPage } = background;

/**
 * Capitalizes the first letter of a string and converts the rest of the letters to lowercase.
 *
 * @param str - The string to be capitalized.
 * @returns The capitalized string.
 */
const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

interface HeadingAndActionProps {
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
 * @param course - The course object containing course details.
 * @param activeSchedule - The active schedule object.
 * @param onClose - The function to close the popup.
 * @returns The rendered component.
 */
export default function HeadingAndActions({ course, activeSchedule, onClose }: HeadingAndActionProps): JSX.Element {
    const { courseName, department, number: courseNumber, uniqueId, instructors, flags, core } = course;
    const courseAdded = activeSchedule.courses.some(ourCourse => ourCourse.uniqueId === uniqueId);
    const formattedUniqueId = uniqueId.toString().padStart(5, '0');
    const isInCalendar = useCalendar();

    const getInstructorFullName = (instructor: Instructor) => instructor.toString({ format: 'first_last' });

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedUniqueId);
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
            let { firstName = '', lastName = '' } = instructor;
            firstName = capitalizeString(firstName);
            lastName = capitalizeString(lastName);
            return openCESPage({ instructorFirstName: firstName, instructorLastName: lastName });
        });
        await Promise.all(openTabs);
    };

    const handleOpenPastSyllabi = async () => {
        for (const instructor of instructors) {
            let { firstName = '', lastName = '' } = instructor;
            firstName = capitalizeString(firstName);
            lastName = capitalizeString(lastName);
            const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${courseNumber}&course_title=&unique=&instructor_first=${firstName}&instructor_last=${lastName}&course_type=In+Residence&search=Search`;
            openNewTab({ url });
        }

        // Show the course's syllabi when no instructors listed
        if (instructors.length === 0) {
            const url = `https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&department=${department}&course_number=${courseNumber}&course_title=&unique=&instructor_first=&instructor_last=&course_type=In+Residence&search=Search`;
            openNewTab({ url });
        }
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
        <div className='w-full px-2 pb-3 pt-5 text-ut-black'>
            <div className='flex flex-col'>
                <div className='flex items-center gap-1'>
                    <Text variant='h1' className='truncate text-theme-black'>
                        {courseName}
                    </Text>
                    <Text variant='h1' className='flex-1 whitespace-nowrap text-theme-black'>
                        ({department} {courseNumber})
                    </Text>
                    <Button color='ut-burntorange' variant='minimal' icon={Copy} onClick={handleCopy}>
                        {formattedUniqueId}
                    </Button>
                    <button className='bg-transparent p-0 text-ut-black btn' onClick={onClose}>
                        <X className='h-6 w-6' />
                    </button>
                </div>
                <div className='flex items-center gap-2'>
                    {instructors.length > 0 ? (
                        <Text variant='h4' as='p'>
                            with{' '}
                            {instructors
                                .map(instructor => (
                                    <Link
                                        key={instructor.fullName}
                                        variant='h4'
                                        href={`https://utdirect.utexas.edu/apps/student/coursedocs/nlogon/?year=&semester=&course_title=&unique=&instructor_first=${instructor.firstName}&instructor_last=${instructor.lastName}&course_type=In+Residence&search=Search`}
                                        className='link'
                                    >
                                        {getInstructorFullName(instructor)}
                                    </Link>
                                ))
                                .flatMap((el, i) => (i === 0 ? [el] : [', ', el]))}
                        </Text>
                    ) : (
                        <Text variant='h4' as='p'>
                            (No instructor has been provided)
                        </Text>
                    )}
                    <div className='flex items-center gap-1'>
                        {flags.map((flag: string) => (
                            <Chip
                                key={flagMap[flag as keyof typeof flagMap]}
                                label={flagMap[flag as keyof typeof flagMap]}
                                variant='flag'
                            />
                        ))}
                        {core.map((coreVal: string) => (
                            <Chip
                                key={coreMap[coreVal as keyof typeof coreMap]}
                                label={coreMap[coreVal as keyof typeof coreMap]}
                                variant='core'
                            />
                        ))}
                    </div>
                </div>
                <DisplayMeetingInfo course={course} />
            </div>
            <div className='my-3 flex flex-wrap items-center gap-x-3.75 gap-y-2.5'>
                <Button
                    variant='filled'
                    color='ut-burntorange'
                    icon={isInCalendar ? ArrowUpRight : CalendarDots}
                    onClick={() => {
                        if (isInCalendar) {
                            openNewTab({
                                url: course.url,
                            });
                        } else {
                            background.switchToCalendarTab({});
                        }
                    }}
                />
                <Divider size='1.75rem' orientation='vertical' />
                <Button
                    variant='outline'
                    color='ut-blue'
                    icon={ChatText}
                    onClick={handleOpenRateMyProf}
                    disabled={instructors.length === 0}
                >
                    RateMyProf
                </Button>
                <Button
                    variant='outline'
                    color='ut-teal'
                    icon={Smiley}
                    onClick={handleOpenCES}
                    disabled={instructors.length === 0}
                >
                    CES
                </Button>
                <Button variant='outline' color='ut-orange' icon={FileText} onClick={handleOpenPastSyllabi}>
                    Past Syllabi
                </Button>
                <Button
                    variant='filled'
                    color={!courseAdded ? 'ut-green' : 'theme-red'}
                    icon={!courseAdded ? Plus : Minus}
                    onClick={handleAddOrRemoveCourse}
                >
                    {!courseAdded ? 'Add Course' : 'Remove Course'}
                </Button>
            </div>
            <Divider orientation='horizontal' size='100%' />
        </div>
    );
}
