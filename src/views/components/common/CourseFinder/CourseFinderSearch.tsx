import type { FieldOfStudy } from '@shared/types/FieldOfStudy';
import { Button } from '@views/components/common/Button';
import Dropdown, { type DropdownOption } from '@views/components/common/Dropdown';
import Input from '@views/components/common/Input';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import {
    CORE_CURRICULUM,
    type CoreCode,
    type CourseFinderQuery,
    CourseLevel,
    type CourseLevelType,
} from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX } from 'react';
import { useState } from 'react';
import MagnifyingGlassIcon from '~icons/ph/magnifying-glass';

import FieldOfStudyCombobox from './FieldOfStudyCombobox';

const LEVEL_OPTIONS = [
    { id: 'LU', label: 'Lower & upper division', levels: [CourseLevel.LOWER, CourseLevel.UPPER] },
    { id: 'L', label: 'Lower division', levels: [CourseLevel.LOWER] },
    { id: 'U', label: 'Upper division', levels: [CourseLevel.UPPER] },
    { id: 'G', label: 'Graduate', levels: [CourseLevel.GRADUATE] },
] as const satisfies (DropdownOption & { levels: CourseLevelType[] })[];

const ANY_CORE_ID = 'any';

const CORE_OPTIONS: DropdownOption[] = [
    { id: ANY_CORE_ID, label: 'Any core' },
    ...CORE_CURRICULUM.map(core => ({ id: core.code, label: core.label })),
];

/**
 * Props for the CourseFinderSearch component
 */
export interface CourseFinderSearchProps {
    finder: Pick<UseCourseFinderReturn, 'semester' | 'fieldsOfStudy' | 'search' | 'setFilters' | 'status' | 'query'>;
}

/**
 * The search form of the Course Finder. Searches UT's course schedule by field of study (narrowed down to a
 * course number or level), by core curriculum area, or by both, which searches the field of study and filters
 * the results to the core area.
 */
export default function CourseFinderSearch({ finder }: CourseFinderSearchProps): JSX.Element {
    const { semester, fieldsOfStudy, search, setFilters, status } = finder;
    const isFieldOfStudySearch = finder.query?.searchBy === 'major' || finder.query?.searchBy === 'course';
    const [department, setDepartment] = useState<FieldOfStudy | null>(null);
    const [courseNumber, setCourseNumber] = useState('');
    const [levelId, setLevelId] = useState<(typeof LEVEL_OPTIONS)[number]['id']>('LU');
    const [coreCode, setCoreCode] = useState<CoreCode | null>(null);

    const level = LEVEL_OPTIONS.find(l => l.id === levelId) ?? LEVEL_OPTIONS[0];
    const semesterCode = semester.selectedItem?.code;

    const getQuery = (): CourseFinderQuery | null => {
        if (!semesterCode) return null;
        if (department && courseNumber) {
            return { searchBy: 'course', semesterCode, department: department.code, courseNumber };
        }
        if (department) {
            return { searchBy: 'major', semesterCode, department: department.code, levels: [...level.levels] };
        }
        if (coreCode) {
            return { searchBy: 'core', semesterCode, coreCode };
        }
        return null;
    };

    const query = getQuery();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        void search(query);
        // A field of study search with a core area picked shows only the courses in that core area
        setFilters(prev => ({ ...prev, coreCode: department ? coreCode : null }));
    };

    return (
        <form className='flex flex-col gap-spacing-3' onSubmit={handleSubmit}>
            <div className='flex flex-row flex-wrap items-center gap-spacing-3'>
                <FieldOfStudyCombobox
                    className='min-w-0 flex-[2_1_14rem]'
                    fieldsOfStudy={fieldsOfStudy}
                    value={department}
                    onChange={setDepartment}
                />
                <Input
                    className='w-36 flex-shrink-0'
                    value={courseNumber}
                    onChange={e => setCourseNumber(e.target.value.replace(/[^\da-z]/gi, '').toUpperCase())}
                    maxLength={5}
                    placeholder='Course #'
                    aria-label='Course number'
                    disabled={!department}
                />
                <Dropdown
                    className='flex-[1_1_12rem]'
                    selectedOption={level}
                    options={LEVEL_OPTIONS}
                    onOptionChange={option => setLevelId(option.id as typeof levelId)}
                    disabled={!department || Boolean(courseNumber)}
                />
            </div>
            <div className='flex flex-row flex-wrap items-center gap-spacing-3'>
                <Dropdown
                    className='flex-[2_1_14rem]'
                    selectedOption={CORE_OPTIONS.find(o => o.id === (coreCode ?? ANY_CORE_ID)) ?? null}
                    options={CORE_OPTIONS}
                    onOptionChange={option => {
                        const newCoreCode = option.id === ANY_CORE_ID ? null : (option.id as CoreCode);
                        setCoreCode(newCoreCode);
                        // Narrow down field of study results right away, without searching again
                        if (department && isFieldOfStudySearch) {
                            setFilters(prev => ({ ...prev, coreCode: newCoreCode }));
                        }
                    }}
                />
                <Dropdown
                    className='w-40 flex-shrink-0'
                    selectedOption={semester.selectedOption}
                    placeholderText='Semester'
                    noOptionsText='No semesters found'
                    onOptionChange={semester.onOptionChange}
                    options={semester.dropdownOptions}
                />
                <Button
                    className={clsx('flex-shrink-0', { 'cursor-progress': status === 'loading' })}
                    color={query ? 'ut-burntorange' : 'ut-gray'}
                    size='small'
                    variant='filled'
                    icon={MagnifyingGlassIcon}
                    type='submit'
                    disabled={!query}
                    title={query ? undefined : 'Pick a field of study or a core curriculum area'}
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
