/**
 * An enum that represents the different types of pages that we support
 * a given url/page can correspond to many of these enum values
 */
export enum SiteSupport {
    COURSE_CATALOG = 'COURSE_CATALOG',
    COURSE_CATALOG_LIST = 'COURSE_CATALOG_LIST',
    COURSE_CATALOG_DETAILS = 'COURSE_CATALOG_DETAILS',
    UT_PLANNER = 'UT_PLANNER',
    WAITLIST = 'WAITLIST',
}

/**
 * We use this function to determine what page the user is on, and then we can use that information to determine what to do
 * @param url the url of the current page
 * @returns a list of page types that the current page is
 */
export default function getSiteSupport(url: string): SiteSupport[] {
    if (url.includes('utexas.collegescheduler.com')) {
        return [SiteSupport.UT_PLANNER];
    }
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        const types = [SiteSupport.COURSE_CATALOG];
        if (url.includes('results')) {
            types.push(SiteSupport.COURSE_CATALOG_LIST);
        }
        if (document.querySelector('#details')) {
            types.push(SiteSupport.COURSE_CATALOG_DETAILS);
        }
        return types;
    }
    if (url.includes('utdirect.utexas.edu') && (url.includes('waitlist') || url.includes('classlist'))) {
        return [SiteSupport.WAITLIST];
    }
    return [];
}
