export enum PageType {
    EXTENSION_POPUP,
    COURSE_SCHEDULE,
    COURSE_SCHEDULE_LIST,
    COURSE_DETAILS,
    UT_PLANNER,
    WAITLIST,
}

/**
 * We use this function to determine what page the user is on, and then we can use that information to determine what to do
 * @param url the url of the current page
 * @returns a list of page types that the current page is
 */
export default function getPageTypes(url: string): PageType[] {
    if (url.includes('chrome-extension://')) {
        return [PageType.EXTENSION_POPUP];
    }
    if (url.includes('utexas.collegescheduler.com')) {
        return [PageType.UT_PLANNER];
    }
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        const types = [PageType.COURSE_SCHEDULE];
        if (url.includes('results')) {
            types.push(PageType.COURSE_SCHEDULE_LIST);
        }
        if (document.querySelector('#details')) {
            types.push(PageType.COURSE_DETAILS);
        }
        return types;
    }
    if (url.includes('utdirect.utexas.edu') && (url.includes('waitlist') || url.includes('classlist'))) {
        return [PageType.WAITLIST];
    }
    return [];
}
