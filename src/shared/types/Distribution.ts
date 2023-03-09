/* eslint-disable max-classes-per-file */
import { PointOptionsObject } from 'highcharts';
import { Semester } from './Course';
/**
 * Each of the possible letter grades that can be given in a course
 */
export type LetterGrade = 'A' | 'A-' | 'B' | 'B+' | 'B-' | 'C' | 'C+' | 'C-' | 'D' | 'D+' | 'D-' | 'F';

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
    sem?: string;
    prof?: string;
    dept?: string;
    course_nbr?: string;
    course_name?: string;
    a1?: number;
    a2?: number;
    a3?: number;
    b1?: number;
    b2?: number;
    b3?: number;
    c1?: number;
    c2?: number;
    c3?: number;
    d1?: number;
    d2?: number;
    d3?: number;
    f?: number;
    semesters?: string;
};
