/**
 * Each of the possible letter grades that can be given in a course
 */
export type LetterGrade = 'A' | 'A-' | 'B' | 'B+' | 'B-' | 'C' | 'C+' | 'C-' | 'D' | 'D+' | 'D-' | 'F' | 'Other';

/**
 * A distribution of grades for a course,
 * with the keys being the letter grades and the values being the number of students that got that grade
 */
// export type Distribution = {
//     [key in LetterGrade]: number;
// };

/**
 * This is a object-ified version of a row in the SQL table that is used to store the distribution data.
 */
export type CourseSQLRow = {
    semester: string;
    section: number;
    department: string;
    department_code: string;
    courseNumber: string;
    courseTitle: string;
    courseFullTitle: string;
    a: number;
    aMinus: number;
    bPlus: number;
    b: number;
    bMinus: number;
    cPlus: number;
    c: number;
    cMinus: number;
    dPlus: number;
    d: number;
    dMinus: number;
    f: number;
    other: number;
};
