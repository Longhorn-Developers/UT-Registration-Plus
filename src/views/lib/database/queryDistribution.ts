import type { Course, Semester } from '@shared/types/Course';
import type { CourseSQLRow, Distribution } from '@shared/types/Distribution';

import { initializeDB } from './initializeDB';

/**
 * fetches the aggregate distribution of grades for a given course from the course db, and the semesters that we have data for
 * @param course the course to fetch the distribution for
 * @returns a Distribution object containing the distribution of grades for the course, and
 * an array of semesters that we have the distribution for
 */
export async function queryAggregateDistribution(course: Course): Promise<[Distribution, Semester[]]> {
    const db = await initializeDB();
    const query = generateQuery(course, null);

    const res = db.exec(query)?.[0];
    if (!res?.columns?.length) {
        throw new NoDataError(course);
    }

    let row: Required<CourseSQLRow> = {} as Required<CourseSQLRow>;
    res.columns.forEach((col, i) => {
        const columnName = col as keyof CourseSQLRow;
        if (columnName in row) {
            const value = res.values[0]?.[i];
            if (value !== undefined) {
                row[columnName] = value as never;
            }
        }
    });

    const distribution: Distribution = {
        A: row.a2,
        'A-': row.a3,
        'B+': row.b1,
        B: row.b2,
        'B-': row.b3,
        'C+': row.c1,
        C: row.c2,
        'C-': row.c3,
        'D+': row.d1,
        D: row.d2,
        'D-': row.d3,
        F: row.f,
    };

    // the db file for some reason has duplicate semesters, so we use a set to remove duplicates
    const rawSemesters = new Set<string>();
    row.semesters.split(',').forEach((sem: string) => {
        rawSemesters.add(sem);
    });

    const semesters: Semester[] = [];

    rawSemesters.forEach((sem: string) => {
        const [season, year] = sem.split(' ');
        if (!season || !year) {
            throw new Error('Season is undefined');
        }
        semesters.push({ year: parseInt(year, 10), season: season as Semester['season'] });
    });

    return [distribution, semesters];
}

/**
 * Creates a SQL query that we can execute on the database to get the distribution of grades for a given course in a given semester
 * @param course the course to fetch the distribution for
 * @param semester the semester to fetch the distribution for OR null if we want the aggregate distribution
 * @returns a SQL query string
 */
function generateQuery(course: Course, semester: Semester | null): string {
    const profName = course.instructors[0]?.fullName;

    const query = `
        select * from ${semester ? 'grades' : 'agg'}
        where dept like '%${course.department}%'
        ${profName ? `and prof like '%${profName}%'` : ''}
        and course_nbr like '%${course.number}%'
        ${semester ? `and sem like '%${semester.season} ${semester.year}%'` : ''}
        order by a1+a2+a3+b1+b2+b3+c1+c2+c3+d1+d2+d3+f desc
    `;

    return query;
}

/**
 * fetches the distribution of grades for a semester for a given course from the course db
 * @param course the course to fetch the distribution for
 * @param semester the semester to fetch the distribution for
 * @returns a Distribution object containing the distribution of grades for the course
 */
export async function querySemesterDistribution(course: Course, semester: Semester): Promise<Distribution> {
    const db = await initializeDB();
    const query = generateQuery(course, semester);

    const res = db.exec(query)?.[0];
    if (!res?.columns?.length) {
        throw new NoDataError(course);
    }

    let row: Required<CourseSQLRow> = {} as Required<CourseSQLRow>;
    res.columns.forEach((col, i) => {
        const columnName = col as keyof CourseSQLRow;
        if (columnName in row) {
            const value = res.values[0]?.[i];
            if (value !== undefined) {
                row[columnName] = value as never;
            }
        }
    });

    const distribution: Distribution = {
        A: row.a2,
        'A-': row.a3,
        'B+': row.b1,
        B: row.b2,
        'B-': row.b3,
        'C+': row.c1,
        C: row.c2,
        'C-': row.c3,
        'D+': row.d1,
        D: row.d2,
        'D-': row.d3,
        F: row.f,
    };

    return distribution;
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
