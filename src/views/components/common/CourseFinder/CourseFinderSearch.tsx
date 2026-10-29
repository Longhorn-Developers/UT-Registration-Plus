import Dropdown from '@views/components/common/Dropdown';
import Text from '@views/components/common/Text/Text';
import type { UseCourseFinderReturn } from '@views/hooks/useCourseFinder';
import { LEVEL_OPTIONS, type LevelOptionId, type UseCourseFinderFormReturn } from '@views/hooks/useCourseFinderForm';
import type { CourseFinderQuery } from '@views/lib/courseFinder';
import type { JSX, Ref } from 'react';
import { useEffect, useMemo } from 'react';

import FieldOfStudyCombobox from './FieldOfStudyCombobox';

/**
 * How long to wait after the form changes before replacing the current search, so a form that's passing through
 * something searchable on the way to something else (like an emptied field of study, with a core picked) doesn't
 * start a search that's thrown away right after
 */
const SEARCH_DELAY_MS = 250;

/**
 * Props for the CourseFinderSearch component
 */
export interface CourseFinderSearchProps {
    finder: Pick<
        UseCourseFinderReturn,
        'semester' | 'areSemestersLoading' | 'fieldsOfStudy' | 'search' | 'reset' | 'filters' | 'query'
    >;
    form: UseCourseFinderFormReturn;
    /** The field of study input, to focus it when the Course Finder opens */
    inputRef?: Ref<HTMLInputElement>;
}

/**
 * The search form of the Course Finder. The results follow the form: picking a field of study searches it at the
 * picked level, and with no field of study, picking a core curriculum area in the filters searches that instead.
 * With neither picked, there's nothing to search, so the results are cleared. While a field of study is being typed,
 * the results stay as they are until one is picked.
 */
export default function CourseFinderSearch({ finder, form, inputRef }: CourseFinderSearchProps): JSX.Element {
    const { semester, areSemestersLoading, fieldsOfStudy, search, reset, filters } = finder;
    const { department, setDepartment, fieldOfStudySearch, setFieldOfStudySearch, levelId, setLevelId } = form;

    const level = LEVEL_OPTIONS.find(l => l.id === levelId) ?? LEVEL_OPTIONS[0];
    const semesterCode = semester.selectedItem?.code;

    const query = useMemo((): CourseFinderQuery | null => {
        if (!semesterCode) return null;
        if (department) {
            return { searchBy: 'major', semesterCode, department: department.code, levels: [...level.levels] };
        }
        if (filters.coreCode) {
            return { searchBy: 'core', semesterCode, coreCode: filters.coreCode };
        }
        return null;
    }, [semesterCode, department, level, filters.coreCode]);

    const isPickingFieldOfStudy = !department && fieldOfStudySearch.trim() !== '';

    useEffect(() => {
        if (isPickingFieldOfStudy) return undefined;
        if (!query) {
            // Don't leave results up that the form no longer explains
            if (finder.query) reset();
            return undefined;
        }
        if (JSON.stringify(query) === JSON.stringify(finder.query)) return undefined;

        // With nothing to replace, there's nothing to wait for
        if (!finder.query) {
            void search(query);
            return undefined;
        }
        const timer = setTimeout(() => void search(query), SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [isPickingFieldOfStudy, query, finder.query, search, reset]);

    return (
        <div className='flex flex-col gap-spacing-3'>
            <FieldOfStudyCombobox
                fieldsOfStudy={fieldsOfStudy}
                value={department}
                onChange={setDepartment}
                search={fieldOfStudySearch}
                onSearchChange={setFieldOfStudySearch}
                inputRef={inputRef}
            />
            {/* Each Dropdown is its own z-30 layer, so the open one goes above the Dropdowns after it */}
            <Dropdown
                className='data-[open]:z-35'
                selectedOption={level}
                options={LEVEL_OPTIONS}
                onOptionChange={option => setLevelId(option.id as LevelOptionId)}
                disabled={!department}
            />
            <Dropdown
                className='data-[open]:z-35'
                selectedOption={semester.selectedOption}
                placeholderText='Semester'
                noOptionsText={areSemestersLoading ? 'Loading semesters…' : 'No semesters found'}
                onOptionChange={semester.onOptionChange}
                options={semester.dropdownOptions}
            />
            {department && !semesterCode && !areSemestersLoading && (
                <Text variant='mini' className='text-theme-red'>
                    {semester.dropdownOptions.length === 0
                        ? "Couldn't load UT's semesters, so there's nothing to search yet. Try reopening the calendar."
                        : 'Pick a semester to search.'}
                </Text>
            )}
        </div>
    );
}
