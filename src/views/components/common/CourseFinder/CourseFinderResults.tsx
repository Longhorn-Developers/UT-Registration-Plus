import createSchedule from '@pages/background/lib/createSchedule';
import switchSchedule from '@pages/background/lib/switchSchedule';
import { background } from '@shared/messages';
import { OptionsStore } from '@shared/storage/OptionsStore';
import { type Course, Status, type StatusType } from '@shared/types/Course';
import type { CustomBlock } from '@shared/types/CustomBlock';
import type { UserSchedule } from '@shared/types/UserSchedule';
import { UTRP_LOGIN_URL } from '@shared/util/appUrls';
import { getCustomBlockConflicts } from '@shared/util/customBlocks';
import { StatusIcon } from '@shared/util/icons';
import { englishStringifyList } from '@shared/util/string';
import { Button } from '@views/components/common/Button';
import Collapse from '@views/components/common/CourseFinder/Collapse';
import { usePrompt } from '@views/components/common/DialogProvider/DialogProvider';
import Divider from '@views/components/common/Divider';
import Link from '@views/components/common/Link';
import Spinner from '@views/components/common/Spinner';
import Text from '@views/components/common/Text/Text';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import type { CourseFinderPreview } from '@views/contexts/CourseFinderContext';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import useCustomBlocks from '@views/hooks/useCustomBlocks';
import { useEnforceScheduleLimit } from '@views/hooks/useEnforceScheduleLimit';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import {
    type CourseFinderGroup,
    type CourseFinderQuery,
    CourseLevel,
    type CourseLevelType,
    getCourseFinderURLs,
} from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { Dispatch, JSX, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import OutwardArrowIcon from '~icons/material-symbols/arrow-outward';
import CaretDownIcon from '~icons/ph/caret-down';
import InfoIcon from '~icons/ph/info';
import MinusIcon from '~icons/ph/minus';
import PlusIcon from '~icons/ph/plus';

// A section that isn't open gets the icon the calendar shows for its status, colored so it stands out in the list (in
// colors that are still clear against the background: UT's lighter orange isn't, so a waitlist is burnt orange)
const STATUS_LABELS: Record<StatusType, { label: string; iconClassName: string }> = {
    [Status.OPEN]: { label: 'Open', iconClassName: '' },
    [Status.WAITLISTED]: { label: 'Waitlisted', iconClassName: 'text-ut-burntorange' },
    [Status.CLOSED]: { label: 'Closed', iconClassName: 'text-theme-red' },
    [Status.CANCELLED]: { label: 'Cancelled', iconClassName: 'text-content-muted' },
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
    /** Sets the section to preview on the calendar, as sections are hovered over or focused */
    onPreviewChange?: Dispatch<SetStateAction<CourseFinderPreview | null>>;
}

/**
 * The results of a Course Finder search, as a list with one row per course, like the schedules list. Clicking a course
 * shows its sections under it. Clicking a section shows its details (grade distribution, RateMyProf, CES, ...), and
 * its button adds it to the schedule or removes it. Hovering over a section (or focusing in it) previews it on the calendar.
 */
export default function CourseFinderResults({ finder, onPreviewChange }: CourseFinderResultsProps): JSX.Element {
    const { status, query, results, groups, matchCount, hasMore, loadMore, expandedGroups, toggleGroup } = finder;
    const activeSchedule = useActiveSchedule();
    const blocks = useCustomBlocks(activeSchedule.id);
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
                    Pick a field of study, type a course like {'C\u00a0S\u00a0314'}, or pick a core area in the filters
                    to see what UT is offering.
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
            {/* A heading between lines, like the custom block form's "Advanced options" */}
            <div className='flex flex-row items-center gap-spacing-3'>
                <Divider className='flex-1' orientation='horizontal' size='100%' />
                <Text variant='small' className='flex-shrink-0 uppercase' aria-live='polite'>
                    {matchCount === results.length
                        ? pluralize(groups.length, 'course')
                        : `${groups.length} matching course${groups.length === 1 ? '' : 's'}`}
                </Text>
                <Divider className='flex-1' orientation='horizontal' size='100%' />
            </div>
            {groups.length === 0 ? (
                <EmptyState>
                    {status === 'loading'
                        ? 'No sections match your filters yet, still loading the rest of the results...'
                        : 'No sections match your filters.'}
                </EmptyState>
            ) : (
                <ul className='m-0 flex list-none flex-col p-0'>
                    {groups.map(group => (
                        <CourseRow
                            key={group.fullName}
                            group={group}
                            activeSchedule={activeSchedule}
                            blocks={blocks}
                            onOpenStats={openStats}
                            enforceScheduleLimit={enforceScheduleLimit}
                            isExpanded={expandedGroups.has(group.fullName)}
                            onToggle={() => toggleGroup(group.fullName)}
                            onPreviewChange={onPreviewChange}
                        />
                    ))}
                </ul>
            )}
            {status === 'loading' && groups.length > 0 && (
                <div className='flex flex-row items-center justify-center gap-spacing-2'>
                    <Spinner className='h-4! w-4!' />
                    <Text variant='mini' className='text-content-muted'>
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
            {/* After the results, for looking further on UT's own site */}
            {query && status !== 'loading' && <SourceLinks query={query} />}
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
        <Text as='div' variant='small' className='py-spacing-6 text-center text-content-muted' aria-live='polite'>
            {children}
        </Text>
    );
}

function pluralize(count: number, noun: string): string {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

const LEVEL_NAMES: Record<CourseLevelType, { label: string; description: string }> = {
    [CourseLevel.LOWER]: { label: 'Lower', description: 'Lower division' },
    [CourseLevel.UPPER]: { label: 'Upper', description: 'Upper division' },
    [CourseLevel.GRADUATE]: { label: 'Graduate', description: 'Graduate' },
};

/**
 * Links to the search on UT's course schedule, where the results come from. A search of more than one level is a
 * separate search on UT's site for each, so it gets a link for each.
 */
function SourceLinks({ query }: { query: CourseFinderQuery }): JSX.Element {
    const urls = getCourseFinderURLs(query);
    const links = urls.map((url, i) => {
        const level = query.searchBy === 'major' ? query.levels[i] : undefined;
        const name = urls.length > 1 && level ? LEVEL_NAMES[level] : undefined;
        return {
            url,
            label: name?.label ?? 'View on UT',
            // Starting with the text shown, so it's what voice control users can say to click it
            description: name ? `${name.description} results on UT's course schedule` : "View on UT's course schedule",
        };
    });

    return (
        <Text variant='mini' className='flex flex-row items-baseline justify-center gap-spacing-3 text-content-muted'>
            {links.length > 1 && 'View on UT:'}
            {links.map(link => (
                <a
                    key={link.url}
                    href={link.url}
                    target='_blank'
                    rel='noreferrer'
                    title={link.description}
                    aria-label={link.description}
                    className='inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-ut-burntorange btn-transition hover:bg-ut-burntorange/10 active:scale-95 focusable'
                >
                    {link.label}
                    <OutwardArrowIcon className='h-3 w-3' />
                </a>
            ))}
        </Text>
    );
}

interface CourseRowProps {
    group: CourseFinderGroup;
    activeSchedule: UserSchedule;
    /** The active schedule's custom time blocks, which a section can conflict with */
    blocks: CustomBlock[];
    onOpenStats: (course: Course) => void;
    enforceScheduleLimit: () => boolean;
    isExpanded: boolean;
    onToggle: () => void;
    onPreviewChange?: Dispatch<SetStateAction<CourseFinderPreview | null>>;
}

function CourseRow({
    group,
    activeSchedule,
    blocks,
    onOpenStats,
    enforceScheduleLimit,
    isExpanded,
    onToggle,
    onPreviewChange,
}: CourseRowProps) {
    // biome-ignore lint/style/noNonNullAssertion: groups always have at least one section
    const { department, number, courseName } = group.sections[0]!;
    const openCount = group.sections.filter(c => c.status === Status.OPEN).length;

    return (
        // Pressed in a little as it's clicked, like the app's buttons (which shrink to 96%, too much for a wide row).
        // Toward the top, so the course stays under the pointer: shrinking toward the middle of a long, expanded row
        // would slide it out from under the pointer, and the click would miss.
        <li className='origin-top border-b border-divider transition-transform duration-100 ease-out has-[>button:active]:scale-98'>
            {/* Its hover color reaches a little past the text on each side, which lines up with the fields above */}
            <button
                type='button'
                className='-mx-spacing-2 w-[calc(100%+0.5rem)] flex flex-row cursor-pointer items-center gap-spacing-3 border-none rounded bg-transparent px-spacing-2 py-spacing-3 text-left btn-transition hover:bg-surface-hover focusable'
                onClick={onToggle}
                aria-expanded={isExpanded}
                title={isExpanded ? 'Hide sections' : 'Show sections'}
            >
                <div className='min-w-0 flex flex-1 flex-col gap-0.5'>
                    {/* How many of its sections are open, kept short and next to the course code, where there's room
                        for it, so the course name below gets the whole width */}
                    <div className='flex flex-row items-center gap-spacing-3'>
                        <Text variant='h4' className='whitespace-nowrap text-content font-bold!'>
                            {department} {number}
                        </Text>
                        <Text
                            variant='mini'
                            className='flex flex-shrink-0 items-center gap-1 whitespace-nowrap border border-divider rounded-full px-spacing-3 py-px text-content-muted'
                        >
                            <span
                                aria-hidden
                                className={clsx(
                                    'size-2 rounded-full',
                                    openCount > 0 ? 'bg-ut-green' : 'bg-content-muted'
                                )}
                            />
                            <span aria-hidden>
                                {openCount}/{group.sections.length} open
                            </span>
                            <span className='sr-only'>
                                {openCount} of {pluralize(group.sections.length, 'section')} open
                            </span>
                        </Text>
                    </div>
                    <Text variant='small' className='truncate text-content-muted' title={courseName}>
                        {courseName}
                    </Text>
                </div>
                <CaretDownIcon
                    className={clsx('h-4 w-4 flex-shrink-0 text-content-muted transition-transform duration-150', {
                        'rotate-180': isExpanded,
                    })}
                />
            </button>
            {/* Set in under the course by a rule down their side, like a list's sub-items */}
            <Collapse show={isExpanded}>
                <ul className='m-0 mb-spacing-3 ml-0.5 list-none border-l-2 border-divider p-0'>
                    {group.sections.map(course => (
                        <SectionRow
                            key={course.uniqueId}
                            course={course}
                            activeSchedule={activeSchedule}
                            blocks={blocks}
                            onOpenStats={onOpenStats}
                            enforceScheduleLimit={enforceScheduleLimit}
                            onPreviewChange={onPreviewChange}
                        />
                    ))}
                </ul>
            </Collapse>
        </li>
    );
}

interface SectionRowProps {
    course: Course;
    activeSchedule: UserSchedule;
    blocks: CustomBlock[];
    onOpenStats: (course: Course) => void;
    /** Checks that another schedule can be made, explaining why not if it can't */
    enforceScheduleLimit: () => boolean;
    onPreviewChange?: Dispatch<SetStateAction<CourseFinderPreview | null>>;
}

function SectionRow({
    course,
    activeSchedule,
    blocks,
    onOpenStats,
    enforceScheduleLimit,
    onPreviewChange,
}: SectionRowProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const showDialog = usePrompt();
    const highlightConflicts = OptionsStore.useStore(store => store.enableHighlightConflicts);
    const isAdded = activeSchedule.containsCourse(course);
    // The courses and the custom time blocks (the ones set to highlight conflicts) it overlaps with
    const conflicts = [
        ...activeSchedule.courses
            .filter(c => c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0)
            .map(c => `${c.department} ${c.number}`),
        ...getCustomBlockConflicts(course.schedule.meetings, blocks).map(block => block.name),
    ];

    // Only stops previewing this section, so moving straight from one section to the next keeps the next one
    const { uniqueId } = course;
    const isThisSection = (previewed: CourseFinderPreview | null) => previewed?.course.uniqueId === uniqueId;
    // Keeps what the add/remove button set, since focus reaches the row (bubbling up from the button) after it
    const showPreview = () =>
        onPreviewChange?.(previewed => (isThisSection(previewed) ? previewed : { course, isRemoving: false }));
    const hidePreview = () => onPreviewChange?.(previewed => (isThisSection(previewed) ? null : previewed));
    // Set as the pointer or focus reaches the add/remove button and cleared as either leaves it (whichever happened
    // last), rather than from whether the button removes right now: clicking it turns + into − under the pointer, and
    // the calendar shows a removal only for a section that's in the schedule
    const previewRemoving = (isRemoving: boolean) => onPreviewChange?.({ course, isRemoving });

    // A section can go away while it's previewed (its card collapsing, a filter, a new search), without the mouse
    // ever leaving it
    useEffect(
        () => () => onPreviewChange?.(previewed => (previewed?.course.uniqueId === uniqueId ? null : previewed)),
        [uniqueId, onPreviewChange]
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
        // The row previews its section on the calendar while it's hovered over or has focus
        <li
            className='flex flex-row items-center gap-spacing-2 rounded-r py-spacing-2 pl-spacing-4 pr-0 btn-transition hover:bg-surface-hover'
            onMouseEnter={showPreview}
            onMouseLeave={hidePreview}
            onFocus={showPreview}
            onBlur={e => {
                // Not while focus is only moving between the row's buttons
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hidePreview();
            }}
        >
            {/* Opens the section's details, like a course on the calendar: its grade distribution, RateMyProf, CES, and
                more. Only text and icons inside, since it's a button. */}
            <button
                type='button'
                className='group/details min-w-0 flex flex-1 cursor-pointer flex-col border-none rounded bg-transparent p-0 text-left focusable'
                onClick={() => onOpenStats(course)}
                title='Details, grade distribution, and more'
            >
                {/* Says what the button does before the times and status it shows */}
                <span className='sr-only'>Details for {name}: </span>
                {course.schedule.meetings.length > 0 ? (
                    course.schedule.meetings.map(m => (
                        <Text
                            key={`${m.getDaysString({ format: 'short' })}-${m.startTime}-${m.location?.building}-${m.location?.room}`}
                            variant='small'
                            // Every meeting is struck through when any of them conflicts, since the section can only
                            // be taken whole, like the row on UT's course schedule (if that's turned on). Hovering
                            // over the section shows on the calendar which meeting overlaps.
                            className={clsx('block text-content', {
                                'text-theme-red!': conflicts.length > 0,
                                'line-through': conflicts.length > 0 && highlightConflicts,
                            })}
                        >
                            {m.getDaysString({ format: 'short' })} {m.getTimeString({ separator: '–' })}
                        </Text>
                    ))
                ) : (
                    <Text variant='small' className='block text-content'>
                        No meeting times
                    </Text>
                )}
                {/* A section that isn't open starts with its status icon, like on the calendar. The unique number comes
                    before the instructors, so a long list of them is what gets cut short (they're shown whole in the
                    details). */}
                <span className='flex flex-row items-center gap-spacing-2'>
                    <Text
                        variant='mini'
                        className='min-w-0 flex-1 truncate text-content-muted'
                        title={instructors || undefined}
                    >
                        {course.status === Status.OPEN ? (
                            <span className='sr-only'>{status.label}, </span>
                        ) : (
                            <span
                                title={status.label}
                                className={clsx('mr-1 inline-flex align-[-2px]', status.iconClassName)}
                            >
                                <StatusIcon aria-hidden status={course.status} className='size-3.5' />
                                <span className='sr-only'>{status.label}, </span>
                            </span>
                        )}
                        {String(course.uniqueId).padStart(5, '0')} · {instructors || 'Instructor TBA'}
                        {course.instructionMode !== 'In Person' && ` · ${course.instructionMode}`}
                    </Text>
                    {/* Shows that clicking opens the details, as the section's text is hovered over or focused. On
                            this line, which has room for it, rather than beside the meeting times, which need the width. */}
                    <InfoIcon
                        aria-hidden
                        className='size-3.5 flex-shrink-0 text-content-muted opacity-0 transition-opacity group-hover/details:opacity-100 group-focus-visible/details:opacity-100'
                    />
                </span>
                {conflicts.length > 0 && (
                    <Text variant='mini' className='block text-theme-red'>
                        Conflicts with {conflicts.join(', ')}
                    </Text>
                )}
            </button>
            <Button
                // As wide as "Remove", so it doesn't change size (and move the text beside it) as it's clicked
                className='w-[5.25rem] flex-shrink-0 justify-center gap-spacing-1 aria-disabled:(cursor-wait opacity-50 scale-100 shadow-none!)'
                color={isAdded ? 'theme-red' : 'ut-green'}
                size='mini'
                // Outlined rather than filled, so a long list of sections isn't a column of bright buttons
                variant='outline'
                icon={isAdded ? MinusIcon : PlusIcon}
                iconProps={{ className: 'h-4! w-4!' }}
                onClick={handleAddOrRemove}
                // Shows on the calendar which blocks removing the section takes away
                onMouseEnter={() => previewRemoving(true)}
                onMouseLeave={() => previewRemoving(false)}
                onFocus={() => previewRemoving(true)}
                onBlur={() => previewRemoving(false)}
                // Not disabled, which would drop focus from it while the schedule updates
                aria-disabled={isUpdating}
                title={isAdded ? 'Remove from your schedule' : 'Add to your schedule'}
                aria-label={isAdded ? `Remove ${name}` : `Add ${name}`}
            >
                {isAdded ? 'Remove' : 'Add'}
            </Button>
        </li>
    );
}
