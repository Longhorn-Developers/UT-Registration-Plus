import { background } from '@shared/messages';
import type { Course } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { UTRP_LOGIN_URL } from '@shared/util/appUrls';
import { Button } from '@views/components/common/Button';
import { Chip, coreMap, flagMap } from '@views/components/common/Chip';
import CourseStatus from '@views/components/common/CourseStatus';
import Link from '@views/components/common/Link';
import Spinner from '@views/components/common/Spinner';
import Text from '@views/components/common/Text/Text';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import type { CourseFinderGroup } from '@views/lib/courseFinder';
import type { JSX } from 'react';
import { useState } from 'react';
import MinusIcon from '~icons/ph/minus';
import PlusIcon from '~icons/ph/plus';

/**
 * Props for the CourseFinderResults component
 */
export interface CourseFinderResultsProps {
    finder: Pick<
        UseCourseFinderReturn,
        'status' | 'results' | 'groups' | 'matchCount' | 'hasMore' | 'loadMore' | 'setFilters'
    >;
}

/**
 * The results of a Course Finder search, grouped by course, with a button to add or remove each section
 * from the active schedule.
 */
export default function CourseFinderResults({ finder }: CourseFinderResultsProps): JSX.Element {
    const { status, results, groups, matchCount, hasMore, loadMore } = finder;
    const activeSchedule = useActiveSchedule();

    if (status === 'logged_out') {
        return (
            <EmptyState>
                <Link href={UTRP_LOGIN_URL} variant='p' className='text-ut-burntorange!'>
                    Log in to UT
                </Link>{' '}
                to search the course schedule, then search again.
            </EmptyState>
        );
    }

    if (status === 'error') {
        return <EmptyState>Something went wrong while searching the course schedule. Please try again.</EmptyState>;
    }

    if (results.length === 0) {
        if (status === 'loading') {
            return (
                <EmptyState>
                    <Spinner className='mx-auto mb-spacing-4 h-10! w-10!' />
                    Searching the course schedule...
                </EmptyState>
            );
        }

        return (
            <EmptyState>
                {status === 'idle'
                    ? 'Search by major, core curriculum, or course number to see what UT is offering.'
                    : 'No courses were found for this search.'}
            </EmptyState>
        );
    }

    return (
        <div className='flex flex-col gap-spacing-4'>
            <Text variant='small' className='text-ut-black/70' aria-live='polite'>
                {matchCount === results.length
                    ? `${pluralize(groups.length, 'course')}, ${pluralize(matchCount, 'section')}`
                    : `${pluralize(matchCount, 'section')} of ${results.length} match your filters`}
            </Text>
            {groups.length === 0 ? (
                <EmptyState>No sections match your filters.</EmptyState>
            ) : (
                <ul className='m-0 flex list-none flex-col gap-spacing-4 p-0'>
                    {groups.map(group => (
                        <CourseGroup key={group.fullName} group={group} activeSchedule={activeSchedule} />
                    ))}
                </ul>
            )}
            {(hasMore || status === 'loading') && (
                <div className='flex justify-center'>
                    <Button
                        color='ut-burntorange'
                        size='small'
                        variant='outline'
                        onClick={loadMore}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Loading more results...' : 'Load more results'}
                    </Button>
                </div>
            )}
        </div>
    );
}

function EmptyState({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <Text as='div' variant='p' className='py-spacing-8 text-center text-ut-black/70' aria-live='polite'>
            {children}
        </Text>
    );
}

function pluralize(count: number, noun: string): string {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function CourseGroup({ group, activeSchedule }: { group: CourseFinderGroup; activeSchedule: UserSchedule }) {
    // biome-ignore lint/style/noNonNullAssertion: groups always have at least one section
    const { department, number, courseName, creditHours, core } = group.sections[0]!;
    const coreChips = core.flatMap(c => (c in coreMap ? [coreMap[c as keyof typeof coreMap]] : []));

    return (
        <li className='overflow-hidden border border-ut-offwhite/50 rounded'>
            <div className='flex flex-row items-center gap-spacing-3 bg-ut-offwhite/15 px-spacing-5 py-spacing-3'>
                <Text variant='h4' className='flex-shrink-0 text-ut-black font-bold!'>
                    {department} {number}
                </Text>
                <Text variant='h4' className='min-w-0 flex-1 truncate text-ut-black' title={courseName}>
                    {courseName}
                </Text>
                <div className='flex flex-shrink-0 items-center gap-spacing-2'>
                    {[...new Set(coreChips)].map(chip => (
                        <Chip key={chip} variant='core' label={chip} />
                    ))}
                    <Text variant='small' className='whitespace-nowrap text-ut-black/70'>
                        {pluralize(creditHours, 'hr')}
                    </Text>
                </div>
            </div>
            <ul className='m-0 list-none p-0'>
                {group.sections.map(course => (
                    <SectionRow key={course.uniqueId} course={course} activeSchedule={activeSchedule} />
                ))}
            </ul>
        </li>
    );
}

function SectionRow({ course, activeSchedule }: { course: Course; activeSchedule: UserSchedule }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const isAdded = activeSchedule.containsCourse(course);
    const conflicts = activeSchedule.courses.filter(
        c => c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0
    );
    const flagChips = course.flags.flatMap(f => (f in flagMap ? [flagMap[f as keyof typeof flagMap]] : []));
    const instructors = course.instructors.map(i => i.toString({ format: 'first_last' })).join(', ');

    const handleAddOrRemove = async () => {
        setIsUpdating(true);
        try {
            if (isAdded) {
                await background.removeCourse({ scheduleId: activeSchedule.id, course });
            } else {
                await background.addCourse({ scheduleId: activeSchedule.id, course });
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <li className='flex flex-row items-center gap-spacing-5 border-t border-ut-offwhite/50 px-spacing-5 py-spacing-3'>
            <Link href={course.url} variant='small' className='w-12 flex-shrink-0' title='Open in the course schedule'>
                {String(course.uniqueId).padStart(5, '0')}
            </Link>
            <div className='min-w-0 flex flex-1 flex-col gap-0.5'>
                {course.schedule.meetings.length > 0 ? (
                    course.schedule.meetings.map(m => (
                        <Text key={`${m.getDaysString({ format: 'short' })}-${m.startTime}`} variant='small'>
                            {m.getDaysString({ format: 'short' })} {m.getTimeString({ separator: '–' })}
                            {m.location ? `, ${m.location.building} ${m.location.room}` : ''}
                        </Text>
                    ))
                ) : (
                    <Text variant='small'>No meeting times</Text>
                )}
                <Text variant='mini' className='truncate text-ut-black/70'>
                    {instructors || 'Instructor TBA'}
                    {course.instructionMode !== 'In Person' && ` · ${course.instructionMode}`}
                </Text>
                {conflicts.length > 0 && (
                    <Text variant='mini' className='text-theme-red'>
                        Conflicts with {conflicts.map(c => `${c.department} ${c.number}`).join(', ')}
                    </Text>
                )}
            </div>
            {flagChips.length > 0 && (
                <div className='flex flex-shrink-0 items-center gap-spacing-1'>
                    {flagChips.map(chip => (
                        <Chip key={chip} variant='flag' label={chip} />
                    ))}
                </div>
            )}
            <div className='w-28 flex-shrink-0'>
                <CourseStatus status={course.status} size='mini' />
            </div>
            <Button
                className='w-26 flex-shrink-0'
                color={isAdded ? 'theme-red' : 'ut-green'}
                size='small'
                variant={isAdded ? 'outline' : 'filled'}
                icon={isAdded ? MinusIcon : PlusIcon}
                onClick={handleAddOrRemove}
                disabled={isUpdating}
            >
                {isAdded ? 'Remove' : 'Add'}
            </Button>
        </li>
    );
}
