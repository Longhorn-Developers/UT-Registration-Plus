import type { Semester } from './Course';

/**
 * A type that represents a field with an id and label
 */
export type SemesterItem = Semester & {
    id: string;
    label: string;
};

/**
 * Fields of study, e.g. "Computer Science", "Mathematics"
 */
export type FieldOfStudyItem = {
    id: string;
    label: string;
};

/**
 * Course numbers, e.g. "C S 311", "M 408C"
 *
 */
export type CourseNumberItem = {
    id: string;
    label: string;
};

/**
 * Course sections, e.g. "55015", "55020"
 *
 * The id is the section number, and the label is a combination of the section number and time
 */
export type SectionItem = {
    id: string;
    label: string;
};
