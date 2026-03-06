import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { Plus, PlusCircle } from '@phosphor-icons/react';
import { getCourseByURL } from '@pages/background/lib/getCourseByURL';
import { background } from '@shared/messages';
import { Course, Semester } from '@shared/types/Course';
import { UNIQUE_ID_LENGTH } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import { useNumericInput } from '@views/hooks/useNumericInput';
import useSchedules from '@views/hooks/useSchedules';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';
import Dropdown, { DropdownOption } from './Dropdown';

type CourseValidation =
    | { status: 'none' }
    | { status: 'valid'; course: Course }
    | { status: 'invalid' }
    | { status: 'already_added' };

/**
 * Converts a semester code (e.g. "20262") to a Semester object.
 */
function makeSemesterFromCode(code: string): Semester | undefined {
    if (code.length !== 5) return undefined;
    const ID_TO_SEASON = {
        '2': 'Spring',
        '6': 'Summer',
        '9': 'Fall',
    } as const;
    const year = code.slice(0, 4);
    const seasonId = code.slice(4);
    const season = ID_TO_SEASON[seasonId as keyof typeof ID_TO_SEASON];
    if (!season) return undefined;
    return {
        year: Number(year),
        code,
        season,
    };
}

/**
 * Fetches the available semester codes from UT's registrar schedules page.
 */
async function fetchAvailableSemesters(): Promise<Semester[]> {
    try {
        const htmlText = await background.addCourseByURL({
            url: 'https://registrar.utexas.edu/schedules',
            method: 'GET',
            response: 'text',
        });

        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const links = doc.querySelectorAll('a[href*="/schedules/"]');

        const semesterCodes: string[] = [];
        links.forEach(link => {
            const match = link.getAttribute('href')?.match(/\/schedules\/(\d{3})$/);
            if (match?.[1]) {
                const fullCode = `20${match[1]}`;
                semesterCodes.push(fullCode);
            }
        });

        const uniqueSemesterCodes = Array.from(new Set(semesterCodes));
        return uniqueSemesterCodes.map(makeSemesterFromCode).filter(s => s !== undefined) as Semester[];
    } catch (e) {
        console.error('Failed to fetch latest semester code', e);
    }
    return [];
}

/**
 * QuickAddModal component
 *
 * This component renders a modal that allows users to quickly add courses to their
 * current semester's schedule by entering a unique number.
 */
export default function QuickAddModal(): JSX.Element {
    const [activeSchedule] = useSchedules();
    const uniqueNumber = useNumericInput('', UNIQUE_ID_LENGTH);
    const [currentSemester, setCurrentSemester] = useState<Semester | undefined>(undefined);
    const [availableSemesters, setSemesters] = useState<Semester[]>([]);
    const [validation, setValidation] = useState<CourseValidation>({ status: 'none' });

    const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${currentSemester?.code}/${uniqueNumber.value}/`;

    useEffect(() => {
        fetchAvailableSemesters().then(sem => {
            setSemesters(sem);
            setCurrentSemester(sem[0] ?? undefined);
        });
    }, []);

    useEffect(() => {
        if (uniqueNumber.value.length !== UNIQUE_ID_LENGTH) {
            setValidation({ status: 'none' });
            return;
        }

        let cancelled = false;

        (async () => {
            const course = await getCourseByURL(courseUrl);
            if (cancelled) return;

            if (!course) {
                setValidation({ status: 'invalid' });
                return;
            }

            if (activeSchedule.containsCourse(course)) {
                setValidation({ status: 'already_added' });
                return;
            }

            setValidation({ status: 'valid', course });
            return;
        })();

        return () => {
            cancelled = true;
        };
    }, [uniqueNumber.value, currentSemester]);

    const isDisabled = uniqueNumber.value.length !== UNIQUE_ID_LENGTH || validation.status !== 'valid';

    const handleQuickAdd = () => {
        background.validateLoginStatus({
            url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/utrp_login/',
        });
    };

    const handleAddCourse = async () => {
        if (isDisabled || !currentSemester) return;

        const course = await getCourseByURL(courseUrl);
        if (!course) {
            setValidation({ status: 'invalid' });
            return;
        }

        if (activeSchedule.containsCourse(course)) {
            setValidation({ status: 'already_added' });
            return;
        }

        await background.addCourse({ scheduleId: activeSchedule.id, course });
        uniqueNumber.reset();
    };

    return (
        <DialogProvider>
            <Popover>
                <PopoverButton className='bg-transparent' as='div'>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle} onClick={handleQuickAdd}>
                        Quick Add
                    </Button>
                </PopoverButton>
                <PopoverPanel
                    as={ExtensionRootWrapper}
                    className={clsx([
                        'mt-spacing-3',
                        'origin-top rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                        'flex flex-col gap-spacing-7 px-spacing-7 py-spacing-6 w-[400px] z-20',
                    ])}
                    transition
                    anchor='bottom start'
                >
                    <div className='flex flex-row gap-spacing-3'>
                        <Input
                            className='flex-1 min-w-0'
                            value={uniqueNumber.value}
                            onChange={uniqueNumber.handleChange}
                            maxLength={UNIQUE_ID_LENGTH}
                            placeholder='Enter unique number'
                        />
                        <Dropdown
                            className='w-40 flex-shrink-0'
                            selectedOption={
                                currentSemester
                                    ? ({
                                          id: currentSemester.code,
                                          label: `${currentSemester.season} ${currentSemester.year}`,
                                      } as DropdownOption)
                                    : null
                            }
                            placeholderText='Semester'
                            noOptionsText='No semesters found'
                            onOptionChange={opt => {
                                const sem = availableSemesters.find(s => s.code === opt.id);
                                if (sem) setCurrentSemester(sem);
                            }}
                            options={availableSemesters.map(
                                sem =>
                                    ({
                                        id: sem.code,
                                        label: `${sem.season} ${sem.year}`,
                                    }) as DropdownOption
                            )}
                        />
                    </div>
                    {validation.status === 'none' && (
                        <Text variant='small' className='text-ut-black'>
                            Enter the unique number of the course you want.
                        </Text>
                    )}
                    {validation.status === 'already_added' && (
                        <Text variant='small' className='text-ut-black'>
                            This course is already in your schedule.
                        </Text>
                    )}
                    {validation.status === 'invalid' && (
                        <Text variant='small' className='text-ut-black'>
                            No courses found with this unique number.
                        </Text>
                    )}
                    {validation.status === 'valid' && (
                        <div className='flex flex-col gap-0.5 border border-ut-offwhite/50 rounded px-spacing-5 py-spacing-3 shadow-md'>
                            <Text variant='h4' className='text-black font-bold!'>
                                {validation.course.department} {validation.course.number}
                                {' \u2013 '}
                                {validation.course.courseName}
                            </Text>
                            {validation.course.schedule.meetings.map((m, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Text key={i} variant='small' className='text-ut-black'>
                                    {m.getDaysString({ format: 'short' })} {m.getTimeString({ separator: '\u2013' })}
                                    {m.location ? `, ${m.location.building} ${m.location.room}` : ''}
                                </Text>
                            ))}
                        </div>
                    )}
                    <PopoverGroup className='w-full flex flex-row justify-end gap-spacing-5'>
                        <PopoverPanel>
                            {({ close }) => (
                                <Button
                                    color='ut-burntorange'
                                    size='regular'
                                    variant='minimal'
                                    onClick={() => {
                                        uniqueNumber.reset();
                                        close();
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </PopoverPanel>
                        <Button
                            color={isDisabled ? 'ut-gray' : 'ut-green'}
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            onClick={handleAddCourse}
                            disabled={isDisabled}
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </PopoverPanel>
            </Popover>
        </DialogProvider>
    );
}
