import type { Course, Semester } from '@shared/types/Course';
import type { CourseSQLRow, Distribution } from '@shared/types/Distribution';
import type { QueryExecResult } from 'sql.js';

import { initializeDB } from './initializeDB';

type GradeDistributionParams = {
    ':department_code': string;
    ':course_number': string;
    ':instructor_last'?: string;
    ':semester'?: string;
};

/**
 * Fetches the aggregate distribution of grades for a given course from the course db, and the semesters that we have data for
 *
 * @param course - the course to fetch the distribution for
 * @returns a Distribution object containing the distribution of grades for the course, and
 * an array of semesters that we have the distribution for
 */
export async function queryAggregateDistribution(course: Course): Promise<[Distribution, Semester[], boolean]> {
    const db = await initializeDB();
    const [query, params] = generateQuery(course, null, true);

    let res: QueryExecResult | undefined;
    let instructorIncluded = params[':instructor_last'] !== undefined;
    if (instructorIncluded) {
        // Only check for data on an instructor if the course has an instructor
        res = db.exec(query, params)?.[0];
    }

    if (!instructorIncluded || !res?.columns?.length) {
        // Either no instructor for the class, or no data for the instructor
        instructorIncluded = false;
        const [queryWithoutInstructor, paramsWithoutInstructor] = generateQuery(course, null, false);
        res = db.exec(queryWithoutInstructor, paramsWithoutInstructor)?.[0];

        if (!res?.columns?.length) {
            throw new NoDataError(course);
        }
    }

    const row: Required<CourseSQLRow> = {} as Required<CourseSQLRow>;
    for (let i = 0; i < res.columns.length; i++) {
        const col = res.columns[i] as keyof CourseSQLRow;
        switch (col) {
            case 'A':
            case 'A_Minus':
            case 'B_Plus':
            case 'B':
            case 'B_Minus':
            case 'C_Plus':
            case 'C':
            case 'C_Minus':
            case 'D_Plus':
            case 'D':
            case 'D_Minus':
            case 'F':
            case 'Other':
                row[col] = res.values.reduce((acc, cur) => acc + (cur[i] as number), 0) as never;
                break;
            default:
                row[col] = res.columns[i]![0]! as never;
        }
    }

    const distribution: Distribution = {
        A: row.A,
        'A-': row.A_Minus,
        'B+': row.B_Plus,
        B: row.B,
        'B-': row.B_Minus,
        'C+': row.C_Plus,
        C: row.C,
        'C-': row.C_Minus,
        'D+': row.D_Plus,
        D: row.D,
        'D-': row.D_Minus,
        F: row.F,
        Other: row.Other,
    };

    // get unique semesters from the data
    const rawSemesters = res.values.reduce((acc, cur) => acc.add(cur[0] as string), new Set<string>());

    const semesters: Semester[] = [];

    rawSemesters.forEach((sem: string) => {
        const [season, year] = sem.split(' ');
        if (!season || !year) {
            throw new Error('Season is undefined');
        }
        semesters.push({ year: parseInt(year, 10), season: season as Semester['season'] });
    });

    return [distribution, semesters, instructorIncluded];
}

/**
 * Creates a SQL query that we can execute on the database to get the distribution of grades for a given course in a given semester
 *
 * @param course - the course to fetch the distribution for
 * @param semester - the semester to fetch the distribution for OR null if we want the aggregate distribution
 * @returns a SQL query string
 */
function generateQuery(
    course: Course,
    semester: Semester | null,
    includeInstructor: boolean
): [string, GradeDistributionParams] {
    const query = `
        SELECT * FROM grade_distributions
        WHERE Department_Code = :department_code
        AND Course_Number COLLATE NOCASE IN (
            :course_number,
            concat('F', :course_number), -- Check summer courses with prefix, too
            concat('S', :course_number),
            concat('N', :course_number),
            concat('W', :course_number)
        )
        ${includeInstructor ? `AND Instructor_Last = :instructor_last COLLATE NOCASE` : ''}
        ${semester ? `AND Semester = :semester` : ''}
    `;

    const params: GradeDistributionParams = {
        ':department_code': course.department,
        ':course_number': course.getNumberWithoutTerm(),
    };

    if (includeInstructor) {
        params[':instructor_last'] = course.instructors[0]?.lastName;
    }

    if (semester) {
        params[':semester'] = `${semester.season} ${semester.year}`;
    }

    return [query, params];
}

/**
 * Fetches the distribution of grades for a semester for a given course from the course db
 *
 * @param course - the course to fetch the distribution for
 * @param semester - the semester to fetch the distribution for
 * @returns a Distribution object containing the distribution of grades for the course
 */
export async function querySemesterDistribution(course: Course, semester: Semester): Promise<[Distribution, boolean]> {
    const db = await initializeDB();
    const [query, params] = generateQuery(course, semester, true);

    let res = db.exec(query, params)?.[0];
    let instructorIncluded = true;
    if (!res?.columns?.length) {
        instructorIncluded = false;
        const [queryWithoutInstructor, paramsWithoutInstructor] = generateQuery(course, semester, false);
        res = db.exec(queryWithoutInstructor, paramsWithoutInstructor)?.[0];
        if (!res?.columns?.length) {
            throw new NoDataError(course);
        }
    }

    const row: Required<CourseSQLRow> = {} as Required<CourseSQLRow>;
    for (let i = 0; i < res.columns.length; i++) {
        const col = res.columns[i] as keyof CourseSQLRow;
        switch (col) {
            case 'A':
            case 'A_Minus':
            case 'B_Plus':
            case 'B':
            case 'B_Minus':
            case 'C_Plus':
            case 'C':
            case 'C_Minus':
            case 'D_Plus':
            case 'D':
            case 'D_Minus':
            case 'F':
            case 'Other':
                row[col] = res.values.reduce((acc, cur) => acc + (cur[i] as number), 0) as never;
                break;
            default:
                row[col] = res.columns[i]![0]! as never;
        }
    }

    return [
        {
            A: row.A,
            'A-': row.A_Minus,
            'B+': row.B_Plus,
            B: row.B,
            'B-': row.B_Minus,
            'C+': row.C_Plus,
            C: row.C,
            'C-': row.C_Minus,
            'D+': row.D_Plus,
            D: row.D,
            'D-': row.D_Minus,
            F: row.F,
            Other: row.Other,
        },
        instructorIncluded,
    ];
}

/**
 * A custom error class for when we don't have data for a course
 */
export class NoDataError extends Error {
    constructor(course: Course) {
        super(`No data for #${course.uniqueId} ${course.department} ${course.number}`);
        this.name = 'NoDataError';
    }
}
