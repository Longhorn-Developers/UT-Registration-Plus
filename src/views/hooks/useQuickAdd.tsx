import type { ICourseDataStore } from '@shared/storage/courseDataStore';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseNumberItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { CourseDataService } from '@views/lib/getCoursesAndSections';
import { useCallback, useEffect, useState } from 'react';

const courseDataService = new CourseDataService();

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
 * @param onChange - An optional callback function to be called when any of the options change.
 */
export function useQuickAddDropdowns(onChange?: () => void) {
    // Course Data Store
    const [courseData, setCourseData] = useState<ICourseDataStore>({ courseData: {} });

    // Selected values
    const [semester, setSemester] = useState<SemesterItem | null>(null);
    const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudyItem | null>(null);
    const [courseNumber, setCourseNumber] = useState<CourseNumberItem | null>(null);
    const [section, setSection] = useState<SectionItem | null>(null);

    // Available options
    const [semesters, setSemesters] = useState<SemesterItem[]>([]);
    const [fieldsOfStudy, setFieldsOfStudy] = useState<FieldOfStudyItem[]>([]);
    const [courseNumbers, setCourseNumbers] = useState<CourseNumberItem[]>([]);
    const [sections, setSections] = useState<SectionItem[]>([]);

    useEffect(() => {
        const initializeData = async () => {
            const data = await CourseDataStore.get('courseData');
            setCourseData({ courseData: data });
        };
        const semesters = courseDataService.getSemesters();
        setSemesters(semesters);

        initializeData();
    }, []);

    useEffect(() => {
        const dataListener = CourseDataStore.listen('courseData', newCourseData => {
            setCourseData(prev => ({
                ...prev,
                courseData: newCourseData.newValue || {},
            }));
        });

        return () => {
            CourseDataStore.removeListener(dataListener);
        };
    }, []);

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
            setFieldOfStudy(null);
            setCourseNumber(null);

            courseDataService.getFieldsOfStudy(newSemester);

            onChange?.();
        },
        [semester, onChange]
    );

    const handleFieldOfStudyChange = useCallback(
        (newFieldOfStudy: FieldOfStudyItem) => {
            if (newFieldOfStudy === fieldOfStudy || !semester) {
                return;
            }

            setFieldOfStudy(newFieldOfStudy);
            setCourseNumber(null);
            setSection(null);

            courseDataService.getCourseNumbers(semester, newFieldOfStudy);

            onChange?.();
        },
        [semester, fieldOfStudy, onChange]
    );

    const handleCourseNumberChange = useCallback(
        (newCourseNumber: CourseNumberItem) => {
            if (newCourseNumber === courseNumber || !semester || !fieldOfStudy) {
                return;
            }

            setCourseNumber(newCourseNumber);
            setSection(null);

            courseDataService.getSections(semester, fieldOfStudy, newCourseNumber);

            onChange?.();
        },
        [semester, fieldOfStudy, courseNumber, onChange]
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
        setSemester(null);
        setFieldOfStudy(null);
        setCourseNumber(null);
        setSection(null);

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
        fieldOfStudyDisabled: semester === null,
        courseNumberDisabled: fieldOfStudy === null,
        sectionDisabled: courseNumber === null,

        handleSemesterChange,
        handleFieldOfStudyChange,
        handleCourseNumberChange,
        handleSectionChange,

        resetDropdowns,
    };
}
