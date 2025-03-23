type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Year = `20${Digit}${Digit}`;
type Month = `0${Exclude<Digit, 0>}` | `1${'0' | '1' | '2'}`;
type Day = `0${Exclude<Digit, 0>}` | `${1 | 2}${Digit}` | '30' | '31';
type DateStr = `${Year}-${Month}-${Day}`;
type SemesterDigit = 2 | 6 | 9;
type SemesterIdentifier = `20${Digit}${Digit}${SemesterDigit}`;

type AcademicCalendarSemester = {
    year: number;
    semester: 'Fall' | 'Spring' | 'Summer';
    firstClassDate: DateStr;
    lastClassDate: DateStr;
    breakDates: (DateStr | [DateStr, DateStr])[];
};

/**
 * UT Austin's academic calendars, split by semester.
 *
 * See https://registrar.utexas.edu/calendars for future years.
 */
export const academicCalendars = {
    '20229': {
        year: 2022,
        semester: 'Fall',
        firstClassDate: '2022-08-22',
        lastClassDate: '2022-12-05',
        breakDates: [
            '2022-09-05', // Labor Day holiday
            ['2022-11-21', '2022-11-26'], // Fall break / Thanksgiving
        ],
    },
    '20232': {
        year: 2023,
        semester: 'Spring',
        firstClassDate: '2023-01-09',
        lastClassDate: '2023-04-24',
        breakDates: [
            '2023-01-16', // Martin Luther King, Jr. Day
            ['2023-03-13', '2023-03-18'], // Spring Break
        ],
    },
    '20236': {
        year: 2023,
        semester: 'Summer',
        firstClassDate: '2023-06-01',
        lastClassDate: '2023-08-11',
        breakDates: [
            '2023-06-19', // Juneteenth holiday
            '2023-07-04', // Independence Day holiday
        ],
    },
    '20239': {
        year: 2023,
        semester: 'Fall',
        firstClassDate: '2023-08-21',
        lastClassDate: '2023-12-04',
        breakDates: [
            '2023-09-04', // Labor Day holiday
            ['2023-11-20', '2023-11-25'], // Fall break / Thanksgiving
        ],
    },
    '20242': {
        year: 2024,
        semester: 'Spring',
        firstClassDate: '2024-01-16',
        lastClassDate: '2024-04-29',
        breakDates: [
            '2024-01-15', // Martin Luther King, Jr. Day
            ['2024-03-11', '2024-03-16'], // Spring Break
        ],
    },
    '20246': {
        year: 2024,
        semester: 'Summer',
        firstClassDate: '2024-06-06',
        lastClassDate: '2024-08-16',
        breakDates: [
            '2024-06-19', // Juneteenth holiday
            '2024-07-04', // Independence Day holiday
        ],
    },
    '20249': {
        year: 2024,
        semester: 'Fall',
        firstClassDate: '2024-08-26',
        lastClassDate: '2024-12-09',
        breakDates: [
            '2024-09-02', // Labor Day holiday
            ['2024-11-25', '2024-11-30'], // Fall break / Thanksgiving
        ],
    },
    '20252': {
        year: 2025,
        semester: 'Spring',
        firstClassDate: '2025-01-13',
        lastClassDate: '2025-04-28',
        breakDates: [
            '2025-01-20', // Martin Luther King, Jr. Day
            ['2025-03-17', '2025-03-22'], // Spring Break
        ],
    },
    '20256': {
        year: 2025,
        semester: 'Summer',
        firstClassDate: '2025-06-05',
        lastClassDate: '2025-08-15',
        breakDates: [
            '2025-06-19', // Juneteenth holiday
            '2025-07-04', // Independence Day holiday
        ],
    },
    '20259': {
        year: 2025,
        semester: 'Fall',
        firstClassDate: '2025-08-25',
        lastClassDate: '2025-12-08',
        breakDates: [
            '2025-09-01', // Labor Day holiday
            ['2025-11-24', '2025-11-29'], // Fall break / Thanksgiving
        ],
    },
    '20262': {
        year: 2026,
        semester: 'Spring',
        firstClassDate: '2026-01-12',
        lastClassDate: '2026-04-27',
        breakDates: [
            '2026-01-19', // Martin Luther King, Jr. Day
            ['2026-03-16', '2026-03-21'], // Spring Break
        ],
    },
    '20266': {
        year: 2026,
        semester: 'Summer',
        firstClassDate: '2026-06-04',
        lastClassDate: '2026-08-14',
        breakDates: [
            '2026-06-19', // Juneteenth holiday
            '2026-07-04', // Independence Day holiday
        ],
    },
    '20269': {
        year: 2026,
        semester: 'Fall',
        firstClassDate: '2026-08-24',
        lastClassDate: '2026-12-07',
        breakDates: [
            '2026-09-07', // Labor Day holiday
            ['2026-11-23', '2026-11-28'], // Fall break / Thanksgiving
        ],
    },
    '20272': {
        year: 2027,
        semester: 'Spring',
        firstClassDate: '2027-01-11',
        lastClassDate: '2027-04-26',
        breakDates: [
            '2027-01-18', // Martin Luther King, Jr. Day
            ['2027-03-15', '2027-03-20'], // Spring Break
        ],
    },
    '20276': {
        year: 2027,
        semester: 'Summer',
        firstClassDate: '2027-06-03',
        lastClassDate: '2027-08-13',
        breakDates: [
            '2027-07-04', // Independence Day holiday
        ],
    },
    '20279': {
        year: 2027,
        semester: 'Fall',
        firstClassDate: '2027-08-23',
        lastClassDate: '2027-12-06',
        breakDates: [
            '2027-09-06', // Labor Day holiday
            ['2027-11-22', '2027-11-27'], // Fall break / Thanksgiving
        ],
    },
    '20282': {
        year: 2028,
        semester: 'Spring',
        firstClassDate: '2028-01-18',
        lastClassDate: '2028-05-01',
        breakDates: [
            ['2028-03-13', '2028-03-18'], // Spring Break
        ],
    },
    '20286': {
        year: 2028,
        semester: 'Summer',
        firstClassDate: '2028-06-08',
        lastClassDate: '2028-08-18',
        breakDates: [
            '2028-07-04', // Independence Day holiday
        ],
    },
} as const satisfies Partial<Record<SemesterIdentifier, AcademicCalendarSemester>>;
