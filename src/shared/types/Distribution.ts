/**
 * Each of the possible letter grades that can be given in a course
 */
export type LetterGrade = 'A' | 'A-' | 'B' | 'B+' | 'B-' | 'C' | 'C+' | 'C-' | 'D' | 'D+' | 'D-' | 'F' | 'Other';

/**
 * A distribution of grades for a course,
 * with the keys being the letter grades and the values being the number of students that got that grade
 */
export type Distribution = {
    [key in LetterGrade]: number;
};

/**
 * This is a object-ified version of a row in the SQL table that is used to store the distribution data.
 */
export type CourseSQLRow = {
    Semester: string;
    Section: number;
    Department: string;
    Department_Code: string;
    Course_Number: string;
    Course_Title: string;
    Course_Full_Title: string;
    Instructor_First: string | null;
    Instructor_Last: string | null;
    A: number;
    A_Minus: number;
    B_Plus: number;
    B: number;
    B_Minus: number;
    C_Plus: number;
    C: number;
    C_Minus: number;
    D_Plus: number;
    D: number;
    D_Minus: number;
    F: number;
    Other: number;
};
