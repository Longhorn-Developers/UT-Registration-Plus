export interface LinkItem {
    text: string;
    url: string;
}

/**
 * The single source of truth for the "useful links" shown in both the calendar and UT map views.
 */
export const USEFUL_LINKS: LinkItem[] = [
    // {
    //     text: "Fall '25 Course Schedule",
    //     url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20259/',
    // },
    // {
    //     text: 'Course Schedule Archives',
    //     url: 'https://registrar.utexas.edu/schedules/archive',
    // },
    {
        text: "Spring '27 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20272/',
    },
    {
        text: "Fall '26 Course Schedule",
        url: 'https://utdirect.utexas.edu/apps/registrar/course_schedule/20269/',
    },
    {
        text: 'Other Course Schedules',
        url: 'https://registrar.utexas.edu/schedules',
    },
    {
        text: 'My Degree Audit (IDA)',
        url: 'https://utdirect.utexas.edu/apps/degree/audits/',
    },
    {
        text: "'26–'27 Academic Calendar",
        url: 'https://registrar.utexas.edu/calendars/26-27',
    },
    {
        text: 'Registration Info Sheet (RIS)',
        url: 'https://utdirect.utexas.edu/registrar/ris.WBX',
    },
    {
        text: 'Register for Courses',
        url: 'https://utdirect.utexas.edu/registration/chooseSemester.WBX',
    },
];
