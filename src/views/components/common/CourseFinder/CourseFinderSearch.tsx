import { Button } from '@views/components/common/Button';
import Dropdown from '@views/components/common/Dropdown';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { LEVEL_OPTIONS, type LevelOptionId, type UseCourseFinderFormReturn } from '@views/hooks/useCourseFinderForm';
import type { CourseFinderQuery } from '@views/lib/courseFinder';
import clsx from 'clsx';
import type { JSX } from 'react';
import MagnifyingGlassIcon from '~icons/ph/magnifying-glass';

import FieldOfStudyCombobox from './FieldOfStudyCombobox';

/**
 * Props for the CourseFinderSearch component
 */
export interface CourseFinderSearchProps {
    finder: Pick<UseCourseFinderReturn, 'semester' | 'fieldsOfStudy' | 'search' | 'status' | 'filters'>;
    form: UseCourseFinderFormReturn;
}

/**
 * The search form of the Course Finder. Searches UT's course schedule by field of study and level, or by the
 * core curriculum area picked in the filters when no field of study is picked.
 */
export default function CourseFinderSearch({ finder, form }: CourseFinderSearchProps): JSX.Element {
    const { semester, fieldsOfStudy, search, status, filters } = finder;
    const { department, setDepartment, levelId, setLevelId } = form;

    const level = LEVEL_OPTIONS.find(l => l.id === levelId) ?? LEVEL_OPTIONS[0];
    const semesterCode = semester.selectedItem?.code;

    const getQuery = (): CourseFinderQuery | null => {
        if (!semesterCode) return null;
        if (department) {
            return { searchBy: 'major', semesterCode, department: department.code, levels: [...level.levels] };
        }
        if (filters.coreCode) {
            return { searchBy: 'core', semesterCode, coreCode: filters.coreCode };
        }
        return null;
    };

    const query = getQuery();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            void search(query);
        }
    };

    return (
        <form className='flex flex-row flex-wrap items-center gap-spacing-3' onSubmit={handleSubmit}>
            <FieldOfStudyCombobox
                className='min-w-0 flex-[2_1_14rem]'
                fieldsOfStudy={fieldsOfStudy}
                value={department}
                onChange={setDepartment}
            />
            <Dropdown
                className='flex-[1_1_12rem]'
                selectedOption={level}
                options={LEVEL_OPTIONS}
                onOptionChange={option => setLevelId(option.id as LevelOptionId)}
                disabled={!department}
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
        </form>
    );
}
