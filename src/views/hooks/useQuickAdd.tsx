import type { ICourseDataStore } from '@shared/storage/courseDataStore';
import { CourseDataStore } from '@shared/storage/courseDataStore';
import type { CourseItem, FieldOfStudyItem, SectionItem, SemesterItem } from '@shared/types/CourseData';
import type { FetchStatusType } from '@views/lib/getCoursesAndSections';
import { CourseDataService, FetchStatus } from '@views/lib/getCoursesAndSections';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
 * Note: that the "fields of study" is always the same, so there isn't a dynamic level for it.
 *
 * @param onChange - An optional callback function to be called when any of the options change.
 */
export function useQuickAddDropdowns() {
    // Course Data Store
    const [{ semesterData }, setSemesterData] = useState<ICourseDataStore>({ semesterData: [] });

    // Selected values
    const [semester, setSemester] = useState<SemesterItem | null>(null);
    const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudyItem | null>(null);
    const [courseNumber, setCourseNumber] = useState<CourseItem | null>(null);
    const [section, setSection] = useState<SectionItem | null>(null);

    // Track fetching state
    const [fetchStatus, setFetchStatus] = useState<FetchStatusType>(FetchStatus.DONE);

    useEffect(() => {
        const initializeData = async () => {
            const data = await CourseDataStore.get('semesterData');
            if (data.length > 0) {
                setSemesterData({ semesterData: data });
                return;
            }

            setFetchStatus(FetchStatus.LOADING);
            console.log('Fetching semesters...');
            const res = await CourseDataService.getAvailableSemesters();
            console.log('Fetched semesters Response:', res);
            setFetchStatus(res);
            if (res !== FetchStatus.DONE) {
                return;
            }

            const newData = await CourseDataStore.get('semesterData');
            setSemesterData({ semesterData: newData });
        };
        initializeData();
    }, []);

    useEffect(() => {
        const dataListener = CourseDataStore.listen('semesterData', newCourseData => {
            setSemesterData(prev => ({
                ...prev,
                semesterData: newCourseData.newValue || {},
            }));
        });

        console.log('CourseDataStore listener added');

        return () => {
            CourseDataStore.removeListener(dataListener);
            console.log('CourseDataStore listener removed');
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

            const fetchData = async () => {
                setFetchStatus(FetchStatus.LOADING);
                const res1 = await CourseDataService.getAllCourseNumbers(newSemester);
                const res2 = await CourseDataService.getAllFieldsOfStudy(newSemester);
                if (res1 !== FetchStatus.DONE || res2 !== FetchStatus.DONE) {
                    setFetchStatus(FetchStatus.ERROR);
                } else {
                    setFetchStatus(FetchStatus.DONE);
                }
            };
            fetchData();
        },
        [semester]
    );

    const handleFieldOfStudyChange = useCallback(
        (newFieldOfStudy: FieldOfStudyItem) => {
            if (newFieldOfStudy?.id === fieldOfStudy?.id || !semester) {
                return;
            }

            setFieldOfStudy(newFieldOfStudy);
            setCourseNumber(null);
            setSection(null);
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

    const semesters = useMemo(() => semesterData.map(semester => semester.info), [semesterData]);

    const fieldsOfStudy = useMemo(() => {
        if (!semester) {
            return [];
        }

        return semesterData.find(semesterData => semesterData.info.id === semester.id)?.fieldsOfStudy;
    }, [semesterData, semester]);

    const courseNumbers = useMemo(() => {
        if (!semester || !fieldOfStudy) {
            return [];
        }

        return semesterData
            .find(semesterData => semesterData.info.id === semester.id)
            ?.courses.filter(course => course.fieldOfStudyId === fieldOfStudy.id);
    }, [semesterData, semester, fieldOfStudy]);

    const sections = useMemo(() => {
        if (!semester || !courseNumber) {
            return [];
        }

        return semesterData
            .find(semesterData => semesterData.info.id === semester.id)
            ?.courses.find(
                course => course.id === courseNumber.id && course.fieldOfStudyId === courseNumber.fieldOfStudyId
            )?.sections;
    }, [semesterData, semester, courseNumber]);

    // console.log('Course Numbers:', courseNumbers);
    // console.log('Fields of Study:', fieldsOfStudy);
    // console.log('Sections:', sections);
    // console.log('Semesters:', semesters);

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
