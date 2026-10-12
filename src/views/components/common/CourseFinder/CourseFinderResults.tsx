import createSchedule from '@pages/background/lib/createSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import { background } from '@shared/messages';
import { type Course, Status, type StatusType } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { UTRP_LOGIN_URL } from '@shared/util/appUrls';
import { englishStringifyList } from '@shared/util/string';
import { Button } from '@views/components/common/Button';
import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
import ExpandableText from '@views/components/common/ExpandableText';
import Link from '@views/components/common/Link';
import Spinner from '@views/components/common/Spinner';
import Text from '@views/components/common/Text/Text';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import type { CourseFinderGroup } from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useState } from 'react';
import CaretDownIcon from '~icons/ph/caret-down';
import ChartBarFillIcon from '~icons/ph/chart-bar-fill';
import MinusIcon from '~icons/ph/minus';
import PlusIcon from '~icons/ph/plus';

// The colors go on a dot next to the label, since the text itself wouldn't have enough contrast in them
const STATUS_LABELS: Record<StatusType, { label: string; dotClassName: string }> = {
    [Status.OPEN]: { label: 'Open', dotClassName: 'bg-ut-green' },
    [Status.WAITLISTED]: { label: 'Waitlist', dotClassName: 'bg-ut-orange' },
    [Status.CLOSED]: { label: 'Closed', dotClassName: 'bg-theme-red' },
    [Status.CANCELLED]: { label: 'Cancelled', dotClassName: 'bg-ut-gray' },
};

/**
 * Props for the CourseFinderResults component
 */
export interface CourseFinderResultsProps {
    finder: Pick<
        UseCourseFinderReturn,
        | 'status'
        | 'query'
        | 'results'
        | 'groups'
        | 'matchCount'
        | 'hasMore'
        | 'loadMore'
        | 'expandedGroups'
        | 'toggleGroup'
    >;
}

/**
 * The results of a Course Finder search, as one card per course. Clicking a card shows its sections, each with
 * buttons to see its stats (grade distribution, RateMyProf, CES, ...) and to add or remove it from the schedule.
 */
export default function CourseFinderResults({ finder }: CourseFinderResultsProps): JSX.Element {
    const { status, query, results, groups, matchCount, hasMore, loadMore, expandedGroups, toggleGroup } = finder;
    const activeSchedule = useActiveSchedule();
    const enforceScheduleLimit = useEnforceScheduleLimit();
    const [statsCourse, setStatsCourse] = useState<Course | null>(null);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const openStats = (course: Course) => {
        setStatsCourse(course);
        setIsStatsOpen(true);
    };

    if (status === 'logged_out') {
        return (
            <EmptyState>
                <Link href={UTRP_LOGIN_URL} variant='small' className='text-ut-burntorange!'>
                    Log in to UT
                </Link>{' '}
                to search the course schedule. Your search will run as soon as you're back.
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
                    <Spinner className='mx-auto mb-spacing-3 h-8! w-8!' />
                    Searching the course schedule...
                </EmptyState>
            );
        }

        if (status === 'idle') {
            return (
                <EmptyState>
                    Pick a field of study, or a core area in the filters, to see what UT is offering.
                </EmptyState>
            );
        }

        return (
            <EmptyState>
                {query?.searchBy === 'core'
                    ? 'No courses were found for this core area. Try picking a field of study along with it.'
                    : 'No courses were found for this search.'}
            </EmptyState>
        );
    }

    return (
        <div className='flex flex-col gap-spacing-3'>
            <Text variant='mini' className='text-ut-black/80' aria-live='polite'>
                {matchCount === results.length
                    ? pluralize(groups.length, 'course')
                    : `${pluralize(groups.length, 'course')} ${groups.length === 1 ? 'matches' : 'match'} your filters`}
            </Text>
            {groups.length === 0 ? (
                <EmptyState>
                    {status === 'loading'
                        ? 'No sections match your filters yet, still loading the rest of the results...'
                        : 'No sections match your filters.'}
                </EmptyState>
            ) : (
                <ul className='m-0 flex list-none flex-col gap-spacing-3 p-0'>
                    {groups.map(group => (
                        <CourseCard
                            key={group.fullName}
                            group={group}
                            activeSchedule={activeSchedule}
                            onOpenStats={openStats}
                            enforceScheduleLimit={enforceScheduleLimit}
                            isExpanded={expandedGroups.has(group.fullName)}
                            onToggle={() => toggleGroup(group.fullName)}
                        />
                    ))}
                </ul>
            )}
            {status === 'loading' && groups.length > 0 && (
                <div className='flex flex-row items-center justify-center gap-spacing-2'>
                    <Spinner className='h-4! w-4!' />
                    <Text variant='mini' className='text-ut-black/80'>
                        Loading the rest of the results...
                    </Text>
                </div>
            )}
            {/* Only after a huge search, which stops loading partway */}
            {hasMore && status !== 'loading' && (
                <Button color='ut-burntorange' size='small' variant='outline' onClick={loadMore}>
                    Load more results
                </Button>
            )}
            {statsCourse && (
                <CourseCatalogInjectedPopup
                    course={statsCourse}
                    open={isStatsOpen}
                    onClose={() => setIsStatsOpen(false)}
                    afterLeave={() => setStatsCourse(null)}
                />
            )}
        </div>
    );
}

function EmptyState({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <Text as='div' variant='small' className='py-spacing-6 text-center text-ut-black/80' aria-live='polite'>
            {children}
        </Text>
    );
}

function pluralize(count: number, noun: string): string {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

interface CourseCardProps {
    group: CourseFinderGroup;
    activeSchedule: UserSchedule;
    onOpenStats: (course: Course) => void;
    enforceScheduleLimit: () => boolean;
    isExpanded: boolean;
    onToggle: () => void;
}

function CourseCard({
    group,
    activeSchedule,
    onOpenStats,
    enforceScheduleLimit,
    isExpanded,
    onToggle,
}: CourseCardProps) {
    // biome-ignore lint/style/noNonNullAssertion: groups always have at least one section
    const { department, number, courseName, creditHours } = group.sections[0]!;
    const openCount = group.sections.filter(c => c.status === Status.OPEN).length;

    return (
        <li className='border border-ut-offwhite/50 rounded'>
            <button
                type='button'
                className='w-full flex flex-row cursor-pointer items-start gap-spacing-2 border-none rounded bg-transparent px-spacing-4 py-spacing-3 text-left hover:bg-ut-offwhite/15 focusable'
                onClick={onToggle}
                aria-expanded={isExpanded}
                title={isExpanded ? 'Hide sections' : 'Show sections'}
            >
                <div className='min-w-0 flex flex-1 flex-col gap-0.5'>
                    <div className='flex flex-row items-baseline gap-spacing-2'>
                        <Text variant='h4' className='whitespace-nowrap text-ut-black font-bold!'>
                            {department} {number}
                        </Text>
                        <Text variant='mini' className='whitespace-nowrap text-ut-black/80'>
                            {pluralize(creditHours, 'hr')}
                        </Text>
                    </div>
                    <Text variant='small' className='truncate text-ut-black' title={courseName}>
                        {courseName}
                    </Text>
                    <Text variant='mini' className='text-ut-black/80'>
                        {pluralize(group.sections.length, 'section')} · {openCount} open
                    </Text>
                </div>
                <CaretDownIcon
                    className={clsx('mt-1 h-4 w-4 flex-shrink-0 text-ut-black/80 transition-transform duration-150', {
                        'rotate-180': isExpanded,
                    })}
                />
            </button>
            {isExpanded && (
                <ul className='m-0 list-none p-0'>
                    {group.sections.map(course => (
                        <SectionRow
                            key={course.uniqueId}
                            course={course}
                            activeSchedule={activeSchedule}
                            onOpenStats={onOpenStats}
                            enforceScheduleLimit={enforceScheduleLimit}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

interface SectionRowProps {
    course: Course;
    activeSchedule: UserSchedule;
    onOpenStats: (course: Course) => void;
    /** Checks that another schedule can be made, explaining why not if it can't */
    enforceScheduleLimit: () => boolean;
}

function SectionRow({ course, activeSchedule, onOpenStats, enforceScheduleLimit }: SectionRowProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const showDialog = usePrompt();
    const isAdded = activeSchedule.containsCourse(course);
    const conflicts = activeSchedule.courses.filter(
        c => c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0
    );
    const instructors = course.instructors.map(i => i.toString({ format: 'last' })).join(', ');
    const status = STATUS_LABELS[course.status];
    const name = `${course.department} ${course.number} (${String(course.uniqueId).padStart(5, '0')})`;

    const update = async (change: () => Promise<unknown>) => {
        setIsUpdating(true);
        try {
            await change();
        } catch (error) {
            console.error('Failed to update the schedule', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddOrRemove = () => {
        if (isUpdating) return;
        if (isAdded) {
            void update(() => background.removeCourse({ scheduleId: activeSchedule.id, course }));
            return;
        }

        // Warn before mixing semesters in one schedule, the same way the course popup does
        const semesterCode = course.semester.code;
        const isOtherSemester =
            activeSchedule.courses.length > 0 && activeSchedule.courses.every(c => c.semester.code !== semesterCode);
        if (!isOtherSemester) {
            void update(() => background.addCourse({ scheduleId: activeSchedule.id, course }));
            return;
        }

        // In order, like the course popup lists them
        const scheduleSemesters = englishStringifyList([
            ...new Set(
                activeSchedule.courses
                    .filter(c => c.semester.code)
                    .sort((a, b) => (a.semester.code ?? '').localeCompare(b.semester.code ?? ''))
                    .map(c => `${c.semester.season} ${c.semester.year}`)
            ),
        ]);
        showDialog({
            title: 'This course section is from a different semester!',
            description: (
                <>
                    The section you&apos;re adding is for{' '}
                    <span className='whitespace-nowrap text-ut-burntorange'>
                        {course.semester.season} {course.semester.year}
                    </span>
                    , but your current schedule contains sections in{' '}
                    <span className='whitespace-nowrap text-ut-burntorange'>{scheduleSemesters}</span>. Mixing semesters
                    in one schedule may cause confusion.
                </>
            ),
            buttons: close => (
                <>
                    <Button variant='minimal' color='ut-black' onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        variant='filled'
                        color='ut-burntorange'
                        onClick={() => {
                            close();
                            if (!enforceScheduleLimit()) return;
                            void update(async () => {
                                const scheduleId = await createSchedule(
                                    `${course.semester.season} ${course.semester.year}`
                                );
                                await switchSchedule(scheduleId);
                                await background.addCourse({ scheduleId, course });
                            });
                        }}
                    >
                        Start a new schedule
                    </Button>
                </>
            ),
        });
    };

    return (
        <li className='flex flex-row items-center gap-spacing-2 border-t border-ut-offwhite/50 px-spacing-4 py-spacing-2'>
            <div className='min-w-0 flex flex-1 flex-col'>
                {course.schedule.meetings.length > 0 ? (
                    course.schedule.meetings.map(m => (
                        <Text key={`${m.getDaysString({ format: 'short' })}-${m.startTime}`} variant='small'>
                            {m.getDaysString({ format: 'short' })} {m.getTimeString({ separator: '–' })}
                        </Text>
                    ))
                ) : (
                    <Text variant='small'>No meeting times</Text>
                )}
                {/* The status sits on this line rather than its own column, so the meeting times get the width */}
                <ExpandableText lines={1} variant='mini' className='text-ut-black/80'>
                    <span
                        aria-hidden
                        className={clsx('mr-1 inline-block size-2 rounded-full align-middle', status.dotClassName)}
                    />
                    {status.label} · {String(course.uniqueId).padStart(5, '0')} · {instructors || 'Instructor TBA'}
                    {course.instructionMode !== 'In Person' && ` · ${course.instructionMode}`}
                </ExpandableText>
                {conflicts.length > 0 && (
                    <Text variant='mini' className='text-theme-red'>
                        Conflicts with {conflicts.map(c => `${c.department} ${c.number}`).join(', ')}
                    </Text>
                )}
            </div>
            <Button
                className='flex-shrink-0'
                color='ut-burntorange'
                size='mini'
                variant='minimal'
                icon={ChartBarFillIcon}
                onClick={() => onOpenStats(course)}
                title='Grade distribution, RateMyProf, and more'
                aria-label={`Stats for ${name}`}
            />
            <Button
                className='flex-shrink-0 aria-disabled:(cursor-wait opacity-50 scale-100 shadow-none!)'
                color={isAdded ? 'theme-red' : 'ut-green'}
                size='mini'
                variant='filled'
                icon={isAdded ? MinusIcon : PlusIcon}
                onClick={handleAddOrRemove}
                // Not disabled, which would drop focus from it while the schedule updates
                aria-disabled={isUpdating}
                title={isAdded ? 'Remove from your schedule' : 'Add to your schedule'}
                aria-label={isAdded ? `Remove ${name}` : `Add ${name}`}
            />
        </li>
    );
}
