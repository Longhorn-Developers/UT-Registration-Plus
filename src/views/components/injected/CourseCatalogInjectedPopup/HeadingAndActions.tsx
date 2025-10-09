import createSchedule from '@pages/background/lib/createSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import {
    ArrowUpRight,
    CalendarDots,
    ChatText,
    Check,
    Copy,
    FileText,
    Minus,
    Plus,
    Smiley,
    X,
} from '@phosphor-icons/react';
import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import type Instructor from '@shared/types/Instructor';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { englishStringifyList } from '@shared/util/string';
import { Button } from '@views/components/common/Button';
import { Chip, coreMap, flagMap } from '@views/components/common/Chip';
import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import Link from '@views/components/common/Link';
import Text from '@views/components/common/Text/Text';
import { useCalendar } from '@views/contexts/CalendarContext';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';

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

    const [isCopied, setIsCopied] = useState<boolean>(false);
    const lastCopyTime = useRef<number>(0);
    const showDialog = usePrompt();
    const getInstructorFullName = (instructor: Instructor) => instructor.toString({ format: 'first_last' });

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        const now = Date.now();
        if (now - lastCopyTime.current < 500) {
            return;
        }

        lastCopyTime.current = now;
        await navigator.clipboard.writeText(formattedUniqueId);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 500);
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

    const handleAddToNewSchedule = async (close: () => void) => {
        const newScheduleId = await createSchedule(`${course.semester.season} ${course.semester.year}`);
        switchSchedule(newScheduleId);
        addCourse({ course, scheduleId: newScheduleId });
        close();
    };

    const handleAddOrRemoveCourse = async () => {
        const uniqueSemesterCodes = [
            ...new Set(
                activeSchedule.courses
                    .map(course => course.semester.code)
                    .filter((code): code is string => code !== undefined)
            ),
        ];
        uniqueSemesterCodes.sort();
        const codeToReadableMap: Record<string, string> = {};
        activeSchedule.courses.forEach(course => {
            const { code } = course.semester;
            if (code) {
                const readable = `${course.semester.season} ${course.semester.year}`;
                codeToReadableMap[code] = readable;
            }
        });
        const sortedSemesters = uniqueSemesterCodes
            .map(code => codeToReadableMap[code])
            .filter((value): value is string => value !== undefined);
        const activeSemesters = englishStringifyList(sortedSemesters);

        if (!activeSchedule) return;
        if (!courseAdded) {
            const currentSemesterCode = course.semester.code;
            // Show warning if this course is for a different semester than the selected schedule
            if (
                activeSchedule.courses.length > 0 &&
                activeSchedule.courses.every(otherCourse => otherCourse.semester.code !== currentSemesterCode)
            ) {
                const dialogButtons = (close: () => void) => (
                    <>
                        <Button variant='minimal' color='ut-black' onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            variant='filled'
                            color='ut-burntorange'
                            onClick={() => {
                                handleAddToNewSchedule(close);
                            }}
                        >
                            Start a new schedule
                        </Button>
                    </>
                );

                showDialog({
                    title: 'This course section is from a different semester!',
                    description: (
                        <>
                            The section you&apos;re adding is for{' '}
                            <span className='text-ut-burntorange whitespace-nowrap'>
                                {course.semester.season} {course.semester.year}
                            </span>
                            , but your current schedule contains sections in{' '}
                            <span className='text-ut-burntorange whitespace-nowrap'>{activeSemesters}</span>. Mixing
                            semesters in one schedule may cause confusion.
                        </>
                    ),
                    buttons: dialogButtons,
                });
            } else {
                addCourse({ course, scheduleId: activeSchedule.id });
            }
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
                    <Button color='ut-burntorange' variant='minimal' onClick={handleCopy}>
                        <div className='relative h-5.5 w-5.5'>
                            <Check
                                className={clsx(
                                    'absolute size-full inset-0 text-ut-burntorange transition-all duration-250 ease-in-out',
                                    isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                )}
                            />
                            <Copy
                                className={clsx(
                                    'absolute size-full inset-0 text-ut-burntorange transition-all duration-250 ease-in-out',
                                    isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                                )}
                            />
                        </div>
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
