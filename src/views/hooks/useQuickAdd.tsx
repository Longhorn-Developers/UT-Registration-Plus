import type { ICourseDataStore } from '@shared/storage/courseDataStore';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import type { ChangeEvent, ClipboardEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type { DropdownOption } from '../components/common/Dropdown';

/**
 * useNumericInput
 *
 * A Custom hook to manage numeric input with length limit.
 * It stores and managed the value as a string.
 *
 * @param initialValue - The initial value of the input.
 * @param maxLength - The maximum length of the input.
 * @param onChange - Optional callback function to be called when the value changes.
 * @returns An object containing the input value, a function to set the value, and event handlers for change and paste events.
 */
export const useNumericInput = (initialValue: string = '', maxLength?: number, onChange?: (value: string) => void) => {
    const [value, setValue] = useState<string>(initialValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Only allow if the value consists of numbers and is within length limit
        if (/^\d*$/.test(newValue) && (maxLength === undefined || newValue.length <= maxLength)) {
            setValue(newValue);
            onChange?.(newValue);
        }
    };

    const reset = () => {
        setValue('');
        onChange?.('');
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Get pasted content
        const pastedText = e.clipboardData.getData('text');

        // Check if pasted content is numeric and within length limits
        if (/^\d*$/.test(pastedText)) {
            // Calculate what the new value would be
            const currentValue = e.currentTarget.value;
            const selectionStart = e.currentTarget.selectionStart || 0;
            const selectionEnd = e.currentTarget.selectionEnd || 0;

            const newValue =
                currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);

            // Only update if the new value is within length limit
            if (maxLength === undefined || newValue.length <= maxLength) {
                setValue(newValue);
                onChange?.(newValue);
            }
        }
    };

    return {
        value,
        handleChange,
        handlePaste,
        reset,
    };
};

/**
 * useQuickAddDropdowns
 *
 * A custom hook to manage the QuickAdd modal dropdowns.
 *
 * This hook manages the dropdowns for the QuickAdd modal. These dropdowns are hierarchical, which means that
 * selecting an option in a higher level will affect the options available in the lower levels. For example,
 * if a semester is selected, the available fields of study will change to only those available in that semester.
 * Similarly, selecting a field of study will change the available course numbers to only those available in that field.
 *
 * In the context of the QuickAdd modal, these levels represent:
 * - Level 1: The Semester (Fall 2024, Spring 2025, etc.)
 * - Level 2: The Field of Study (C.S., GOV., etc.)
 * - Level 3: Course Number (CS 439, GOV 312L, etc.)
 * - Level 4: Section Number (unique sections of this course)
 *
 * @param semesters - The list of semesters to choose from.
 * @param getFieldsOfStudy - An async function that takes the semester selected and returns its corresponding fields of study.
 * @param getCourseNumber - An async function that takes the previous options selected and returns their corresponding course numbers.
 * @param getSections - An async function that takes the previous options selected and returns their corresponding sections.
 * @param onChange - An optional callback function to be called when any of the options change.
 */
export const useQuickAddDropdowns = (
    semesters: SemesterItem[],
    getFieldsOfStudy: (semester: SemesterItem) => Promise<FieldOfStudyItem[]>,
    getCourseNumbers: (semester: SemesterItem, fieldOfStudy: FieldOfStudyItem) => Promise<CourseNumberItem[]>,
    getSections: (
        semester: SemesterItem,
        fieldOfStudy: FieldOfStudyItem,
        courseNumber: CourseNumberItem
    ) => Promise<SectionItem[]>,
    onChange?: () => void
) => {
    // Course Data Store
    const [courseData, setCourseData] = useState<ICourseDataStore>({ courseData: {} });

    // Selected values
    const [semester, setSemester] = useState<SemesterItem | undefined>(undefined);
    const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudyItem | undefined>(undefined);
    const [courseNumber, setCourseNumber] = useState<CourseNumberItem | undefined>(undefined);
    const [section, setSection] = useState<SectionItem | undefined>(undefined);

    // Available options
    const [fieldsOfStudy, setFieldsOfStudy] = useState<FieldOfStudyItem[]>([]);
    const [courseNumbers, setCourseNumbers] = useState<CourseNumberItem[]>([]);
    const [sections, setSections] = useState<SectionItem[]>([]);

    useEffect(() => {
        const initializer = async () => {
            const data = await CourseDataStore.get('courseData');
            setCourseData({ courseData: data });
        };

        initializer();
    }, []);

    useEffect(() => {
        const listener = CourseDataStore.listen('courseData', newCourseData => {
            setCourseData(prev => ({
                ...prev,
                courseData: newCourseData.newValue || {},
            }));
        });

        return () => {
            CourseDataStore.removeListener(listener);
        };
    }, [semester, fieldOfStudy, courseNumber, section]);

    useEffect(() => {
        const data = courseData.courseData;

        if (semester) {
            const studyFields = data[semester.id]?.studyFields || [];
            setFieldsOfStudy(Object.values(studyFields).map(f => f.info));
        }

        if (semester && fieldOfStudy) {
            const courseNumbers = data[semester.id]?.studyFields[fieldOfStudy.id]?.courseNumbers || [];
            setCourseNumbers(Object.values(courseNumbers).map(c => c.info));
        }

        if (semester && fieldOfStudy && courseNumber) {
            const sections =
                data[semester.id]?.studyFields[fieldOfStudy.id]?.courseNumbers[courseNumber.id]?.sections || [];
            setSections(Object.values(sections));
        }
    }, [courseData, semester, fieldOfStudy, courseNumber]);

    const handleSemesterChange = useCallback(
        (newSemester: SemesterItem) => {
            if (newSemester === semester) {
                return;
            }

            setSemester(newSemester);
            setFieldOfStudy(undefined);
            setCourseNumber(undefined);

            getFieldsOfStudy(newSemester);

            onChange?.();
        },
        [getFieldsOfStudy, semester, onChange]
    );

    const handleFieldOfStudyChange = useCallback(
        (newFieldOfStudy: FieldOfStudyItem) => {
            if (newFieldOfStudy === fieldOfStudy || !semester) {
                return;
            }

            setFieldOfStudy(newFieldOfStudy);
            setCourseNumber(undefined);
            setSection(undefined);

            getCourseNumbers(semester, newFieldOfStudy);

            onChange?.();
        },
        [getCourseNumbers, semester, fieldOfStudy, onChange]
    );

    // Handle level 3 selection
    const handleCourseNumberChange = useCallback(
        (newCourseNumber: CourseNumberItem) => {
            if (newCourseNumber === courseNumber || !semester || !fieldOfStudy) {
                return;
            }

            setCourseNumber(newCourseNumber);
            setSection(undefined);

            getSections(semester, fieldOfStudy, newCourseNumber);

            onChange?.();
        },
        [getSections, semester, fieldOfStudy, courseNumber, onChange]
    );

    const handleSectionChange = useCallback(
        (newSection: SectionItem) => {
            if (newSection === section) {
                return;
            }

            setSection(newSection);
            onChange?.();
        },
        [section, onChange]
    );

    // Reset all selections and options
    const resetDropdowns = useCallback(() => {
        setSemester(undefined);
        setFieldOfStudy(undefined);
        setCourseNumber(undefined);
        setSection(undefined);

        onChange?.();
    }, [onChange]);

    return {
        semester,
        fieldOfStudy,
        courseNumber,
        section,

        semesters,
        fieldsOfStudy,
        courseNumbers,
        sections,

        semesterDisabled: false,
        fieldOfStudyDisabled: semester === undefined,
        courseNumberDisabled: fieldOfStudy === undefined,
        sectionDisabled: courseNumber === undefined,

        handleSemesterChange,
        handleFieldOfStudyChange,
        handleCourseNumberChange,
        handleSectionChange,

        resetDropdowns,
    };
};
