import type { ICourseDataStore } from '@shared/storage/courseDataStore';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import { generateSemesters } from '@shared/util/generateSemesters';
import type { FetchStatusType } from '@views/lib/getCoursesAndSections';
import { CourseDataService, FetchStatus } from '@views/lib/getCoursesAndSections';
import { FIELDS_OF_STUDY, type StudyField } from '@views/resources/studyFields';
import { useCallback, useEffect, useState } from 'react';

const AVAILABLE_SEMESTERS = generateSemesters({ year: 2025, season: 'Spring' }, { year: 2025, season: 'Fall' });

/**
 * useQuickAddDropdowns
 *
 * A custom hook to manage the QuickAdd modal dropdowns.
 *
 * This hook manages the dropdowns for the QuickAdd modal. These dropdowns are hierarchical, which means that
 * selecting an option in a higher level will affect the options available in the lower levels. For example,
 * selecting a field of study will change the available course numbers to only those available in that field.
 * Similarly, selecting a course number will change the sections to only those available for that course.
 *
 * In the context of the QuickAdd modal, these levels represent:
 * - Level 1: The Semester & Fields of Study (Fall 2024, Spring 2025, etc.) (CS, GOV, etc.)
 * - Level 2: Course Number (CS 439, GOV 312L, etc.)
 * - Level 3: Section Number (unique sections of this course)
 *
 * Note: that the "fields of study" is always the same, so they isn't a dynamic level for it.
 *
 * @param onChange - An optional callback function to be called when any of the options change.
 */
export function useQuickAddDropdowns() {
    // Course Data Store
    const [{ courseData }, setCourseData] = useState<ICourseDataStore>({ courseData: {} });

    // Selected values
    const [semester, setSemester] = useState<SemesterItem | null>(null);
    const [fieldOfStudy, setFieldOfStudy] = useState<StudyField | null>(null);
    const [courseNumber, setCourseNumber] = useState<CourseItem | null>(null);
    const [section, setSection] = useState<SectionItem | null>(null);

    // Track fetching state
    const [fetchStatus, setFetchStatus] = useState<FetchStatusType>(FetchStatus.DONE);

    // Available options
    const semesters = AVAILABLE_SEMESTERS;
    const fieldsOfStudy = FIELDS_OF_STUDY;

    useEffect(() => {
        const initializeData = async () => {
            const data = await CourseDataStore.get('courseData');
            setCourseData({ courseData: data });
        };
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

    const handleSemesterChange = useCallback(
        (newSemester: SemesterItem) => {
            if (newSemester === semester) {
                return;
            }

            setSemester(newSemester);
            setFieldOfStudy(null);
            setCourseNumber(null);
            setSection(null);
        },
        [semester]
    );

    const handleFieldOfStudyChange = useCallback(
        (newFieldOfStudy: StudyField) => {
            if (newFieldOfStudy.id === fieldOfStudy?.id || !semester) {
                return;
            }

            setFieldOfStudy(newFieldOfStudy);
            setCourseNumber(null);
            setSection(null);

            const fetchCourseNumbers = async () => {
                setFetchStatus(FetchStatus.LOADING);
                const res = await CourseDataService.getCourseNumbers(semester, newFieldOfStudy.id);
                setFetchStatus(res);
            };

            fetchCourseNumbers();
        },
        [semester, fieldOfStudy]
    );

    const handleCourseNumberChange = useCallback(
        (newCourseNumber: CourseItem) => {
            if (newCourseNumber === courseNumber || !semester || !fieldOfStudy) {
                return;
            }

            setCourseNumber(newCourseNumber);
            setSection(null);

            const fetchSections = async () => {
                setFetchStatus(FetchStatus.LOADING);
                const res = await CourseDataService.getSections(semester, newCourseNumber);
                setFetchStatus(res);
            };
            fetchSections();
        },
        [semester, fieldOfStudy, courseNumber]
    );

    const handleSectionChange = useCallback(
        (newSection: SectionItem) => {
            if (newSection === section) {
                return;
            }

            setSection(newSection);
        },
        [section]
    );

    // Reset all selections and options
    const resetDropdowns = useCallback(() => {
        setSemester(null);
        setFieldOfStudy(null);
        setCourseNumber(null);
        setSection(null);
        setFetchStatus(FetchStatus.DONE);
    }, []);

    const courseNumbers =
        semester && fieldOfStudy
            ? courseData[semester.id]?.courses.filter((course: CourseItem) => course.fieldOfStudyId === fieldOfStudy.id)
            : [];

    const sections =
        semester && fieldOfStudy && courseNumber
            ? courseData[semester.id]?.courses.find((course: CourseItem) => course.id === courseNumber.id)?.sections
            : [];

    console.log('Course Numbers:', courseNumbers);
    console.log('Sections:', sections);

    return {
        semester,
        fieldOfStudy,
        courseNumber,
        section,

        semesters,
        fieldsOfStudy,
        courseNumbers,
        sections,

        fetchStatus,

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
