import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react';
import { addCourseByURL } from '@pages/background/lib/addCourseByURL';
import { HashStraight, Plus, PlusCircle } from '@phosphor-icons/react';
import { background } from '@shared/messages';
import type { Course, Semester } from '@shared/types/Course';
import { UNIQUE_ID_LENGTH } from '@shared/types/Course';
import Text from '@views/components/common/Text/Text';
import { useNumericInput } from '@views/hooks/useNumericInput';
import useSchedules from '@views/hooks/useSchedules';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import { SiteSupport } from '@views/lib/getSiteSupport';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import { ExtensionRootWrapper } from './ExtensionRoot/ExtensionRoot';
import Input from './Input';

type CourseValidation = { status: 'none' } | { status: 'valid'; course: Course } | { status: 'invalid' };

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
            try {
                const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${currentSemester?.code}/${uniqueNumber.value}/`;
                const htmlText = await background.addCourseByURL({
                    url: courseUrl,
                    method: 'GET',
                    response: 'text',
                });
                if (cancelled) return;

                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const scraper = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_DETAILS, doc, courseUrl);
                const tableRows = getCourseTableRows(doc);
                const scrapedCourses = scraper.scrape(tableRows, false);

                if (scrapedCourses.length !== 1 || !scrapedCourses[0]?.course) {
                    if (!cancelled) setValidation({ status: 'invalid' });
                    return;
                }

                if (!cancelled) setValidation({ status: 'valid', course: scrapedCourses[0].course });
            } catch {
                if (!cancelled) setValidation({ status: 'invalid' });
            }
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

        const courseUrl = `https://utdirect.utexas.edu/apps/registrar/course_schedule/${currentSemester.code}/${uniqueNumber.value}/`;
        await addCourseByURL(activeSchedule, courseUrl);
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
                    <Input
                        value={uniqueNumber.value}
                        onChange={uniqueNumber.handleChange}
                        maxLength={UNIQUE_ID_LENGTH}
                        placeholder='Enter Unique Number...'
                        icon={HashStraight}
                    />
                    <div className='w-full flex flex-row items-center justify-between gap-spacing-2 whitespace-nowrap px-spacing-2'>
                        <Text variant='mini'>Choose from:</Text>
                        <Text className='flex flex-row items-center gap-spacing-2' variant='mini'>
                            {availableSemesters.map(sem => (
                                <Button
                                    key={sem.code}
                                    size='mini'
                                    variant={sem === currentSemester ? 'filled' : 'minimal'}
                                    color='ut-burntorange'
                                    onClick={() => setCurrentSemester(sem)}
                                    className={clsx(
                                        'whitespace-nowrap',
                                        sem === currentSemester && 'pointer-events-none'
                                    )}
                                >
                                    {`${sem.season} ${sem.year}`}
                                </Button>
                            ))}
                        </Text>
                    </div>
                    {validation.status === 'invalid' && (
                        <Text variant='mini' className='text-ut-black'>
                            There are no courses associated with this unique number.
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
                                    color='ut-black'
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
                            color='ut-green'
                            size='regular'
                            variant='filled'
                            icon={Plus}
                            onClick={handleAddCourse}
                            disabled={isDisabled}
                            className={isDisabled ? 'bg-[#9CADB7]!' : ''}
                        >
                            Add Course
                        </Button>
                    </PopoverGroup>
                </PopoverPanel>
            </Popover>
        </DialogProvider>
    );
}
