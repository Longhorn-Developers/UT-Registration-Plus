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
    // res.columns.forEach((col, i) => {
    //     row[col as keyof CourseSQLRow] = res.values.reduce((acc, cur) => acc + cur[i]!, 0) as never;
    // });

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

    // the db file for some reason has duplicate semesters, so we use a set to remove duplicates
    const rawSemesters = res.values.reduce((acc, cur) => acc.add(cur[0] as string), new Set<string>());
    console.log({ rawSemesters });

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

const allTables = [
    'grade_distributions_2010_2011',
    'grade_distributions_2011_2012',
    'grade_distributions_2012_2013',
    'grade_distributions_2013_2014',
    'grade_distributions_2014_2015',
    'grade_distributions_2015_2016',
    'grade_distributions_2016_2017',
    'grade_distributions_2017_2018',
    'grade_distributions_2018_2019',
    'grade_distributions_2019_2020',
    'grade_distributions_2020_2021',
    'grade_distributions_2021_2022',
    'grade_distributions_2022_2023',
] as const;

/**
 * Creates a SQL query that we can execute on the database to get the distribution of grades for a given course in a given semester
 * @param course the course to fetch the distribution for
 * @param semester the semester to fetch the distribution for OR null if we want the aggregate distribution
 * @returns a SQL query string
 */
function generateQuery(course: Course, semester: Semester | null): string {
    // const profName = course.instructors[0]?.fullName;
    // eslint-disable-next-line no-nested-ternary
    const yearDelta = semester ? (semester.season === 'Fall' ? 0 : -1) : 0;

    const query = `
        select * from ${semester ? `grade_distributions_${semester.year + yearDelta}_${semester.year + yearDelta + 1}` : `(select * from ${allTables.join(' union all select * from ')})`}
        where Department_Code = '${course.department}'
        and Course_Number = '${course.number}'
        ${semester ? `and Semester = '${semester.season} ${semester.year}'` : ''}
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
        row[col as keyof CourseSQLRow] = res.values[0]![i]! as never;
    });

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
