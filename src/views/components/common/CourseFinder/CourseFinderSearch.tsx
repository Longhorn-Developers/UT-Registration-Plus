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
import BooksIcon from '~icons/ph/books';
import GraduationCapIcon from '~icons/ph/graduation-cap';
import HashIcon from '~icons/ph/hash';
import MagnifyingGlassIcon from '~icons/ph/magnifying-glass';

import FieldOfStudyCombobox from './FieldOfStudyCombobox';

type SearchBy = CourseFinderQuery['searchBy'];

const SEARCH_BY_OPTIONS = [
    { id: 'major', label: 'Major', icon: GraduationCapIcon },
    { id: 'core', label: 'Core', icon: BooksIcon },
    { id: 'course', label: 'Course', icon: HashIcon },
] as const satisfies { id: SearchBy; label: string; icon: unknown }[];

const LEVEL_OPTIONS = [
    { id: 'LU', label: 'Lower & upper division', levels: [CourseLevel.LOWER, CourseLevel.UPPER] },
    { id: 'L', label: 'Lower division', levels: [CourseLevel.LOWER] },
    { id: 'U', label: 'Upper division', levels: [CourseLevel.UPPER] },
    { id: 'G', label: 'Graduate', levels: [CourseLevel.GRADUATE] },
] as const satisfies (DropdownOption & { levels: CourseLevelType[] })[];

const CORE_OPTIONS: DropdownOption[] = CORE_CURRICULUM.map(core => ({ id: core.code, label: core.label }));

/**
 * Props for the CourseFinderSearch component
 */
export interface CourseFinderSearchProps {
    finder: Pick<UseCourseFinderReturn, 'semester' | 'fieldsOfStudy' | 'search' | 'status'>;
}

/**
 * The search form of the Course Finder, which searches UT's course schedule by major (field of study),
 * core curriculum area, or course number.
 */
export default function CourseFinderSearch({ finder }: CourseFinderSearchProps): JSX.Element {
    const { semester, fieldsOfStudy, search, status } = finder;
    const [searchBy, setSearchBy] = useState<SearchBy>('major');
    const [department, setDepartment] = useState<FieldOfStudy | null>(null);
    const [levelId, setLevelId] = useState<(typeof LEVEL_OPTIONS)[number]['id']>('LU');
    const [coreCode, setCoreCode] = useState<CoreCode | null>(null);
    const [courseNumber, setCourseNumber] = useState('');

    const level = LEVEL_OPTIONS.find(l => l.id === levelId) ?? LEVEL_OPTIONS[0];
    const semesterCode = semester.selectedItem?.code;

    const getQuery = (): CourseFinderQuery | null => {
        if (!semesterCode) return null;

        switch (searchBy) {
            case 'major':
                return department
                    ? { searchBy, semesterCode, department: department.code, levels: [...level.levels] }
                    : null;
            case 'core':
                return coreCode ? { searchBy, semesterCode, coreCode } : null;
            case 'course':
                return department && courseNumber
                    ? { searchBy, semesterCode, department: department.code, courseNumber }
                    : null;
            default:
                return null;
        }
    };

    const query = getQuery();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            void search(query);
        }
    };

    return (
        <form className='flex flex-col gap-spacing-4' onSubmit={handleSubmit}>
            <div role='radiogroup' aria-label='Search by' className='flex flex-row gap-spacing-3'>
                {SEARCH_BY_OPTIONS.map(option => (
                    <Button
                        key={option.id}
                        role='radio'
                        aria-checked={searchBy === option.id}
                        color='ut-burntorange'
                        size='small'
                        variant={searchBy === option.id ? 'filled' : 'minimal'}
                        icon={option.icon}
                        onClick={() => setSearchBy(option.id)}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
            <div className='flex flex-row flex-wrap items-center gap-spacing-3'>
                {searchBy !== 'core' && (
                    <FieldOfStudyCombobox
                        className='min-w-0 flex-[2_1_14rem]'
                        fieldsOfStudy={fieldsOfStudy}
                        value={department}
                        onChange={setDepartment}
                    />
                )}
                {searchBy === 'major' && (
                    <Dropdown
                        className='flex-[1_1_12rem]'
                        selectedOption={level}
                        options={LEVEL_OPTIONS}
                        onOptionChange={option => setLevelId(option.id as typeof levelId)}
                    />
                )}
                {searchBy === 'core' && (
                    <Dropdown
                        className='flex-[2_1_14rem]'
                        placeholderText='Core curriculum area'
                        selectedOption={CORE_OPTIONS.find(o => o.id === coreCode) ?? null}
                        options={CORE_OPTIONS}
                        onOptionChange={option => setCoreCode(option.id as CoreCode)}
                    />
                )}
                {searchBy === 'course' && (
                    <Input
                        className='flex-[1_1_8rem]'
                        value={courseNumber}
                        onChange={e => setCourseNumber(e.target.value.replace(/[^\da-z]/gi, '').toUpperCase())}
                        maxLength={5}
                        placeholder='Number, e.g. 314'
                        aria-label='Course number'
                    />
                )}
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
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
