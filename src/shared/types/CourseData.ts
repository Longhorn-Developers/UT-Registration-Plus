import type { Semester } from './Course';

/**
 * A type that represents a field with an id and label
 */
export type SemesterItem = Semester & {
    /* id of the semester, equals year + code, e.g. "20252" for Spring 2025 */
    id: string;

    /* label of the semester, e.g. "Spring 2025" */
    label: string;
};

/**
 * A type that represents a field of study in a course catalog.
 */
export type FieldOfStudyItem = {
    /* id of the field of study, e.g. "C S" or "ECE" */
    id: string;

    /* name of the field of study, e.g. "Computer Science" or "Electrical and Computer Engineering" */
    name: string;

    /* formatted field of study details, e.g. "<FIELD_OF_STUDY> - <FIELD_OF_STUDY_NAME>" */
    label: string;
};

/**
 * A type that represents a course in a course catalog. A course might contain multiple sections.
 */
export type CourseItem = {
    /*  id of the course, concating fieldOfStudyId and courseNumber, e.g. "C S 311" or "ECE 306H" */
    id: string;

    /* id of the field of study of this course, e.g. "C S" or "ECE" */
    fieldOfStudyId: string;

    /* course number of this section, e.g. "311" or "306H" */
    courseNumber: string;

    /* course name, e.g. "Data Structures" */
    courseName: string;

    /* formatted course details, e.g. "<FIELD_OF_STUDY> <COURSE_NUMBER> - <COURSE_NAME>" */
    label: string;

    /* the sections of this course */
    sections: SectionItem[];
};

/**
 * A type that represents a section in a course catalog.
 */
export type SectionItem = {
    /* unique number, e.g. "55015", "55020" */
    id: string;

    /* formatted section details, e.g. "<UNIQUE_ID> (<COURSE_NAME>) with <INSTRUCTOR>, <MEETING_TIME>" */
    label: string;
};
