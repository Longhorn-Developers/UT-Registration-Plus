import { isExtensionPage, isExtensionPopup } from 'chrome-extension-toolkit';

/**
 * An enum that represents the different types of pages that we support
 * a given url/page can correspond to many of these enum values
 */
export const SiteSupport = {
    COURSE_CATALOG_LIST: 'COURSE_CATALOG_LIST',
    COURSE_CATALOG_DETAILS: 'COURSE_CATALOG_DETAILS',
    UT_PLANNER: 'UT_PLANNER',
    WAITLIST: 'WAITLIST',
    EXTENSION_POPUP: 'EXTENSION_POPUP',
    MY_CALENDAR: 'MY_CALENDAR',
    REPORT_ISSUE: 'REPORT_ISSUE',
    MY_UT: 'MY_UT',
    COURSE_CATALOG_SEARCH: 'COURSE_CATALOG_SEARCH',
    CLASSLIST: 'CLASSLIST',
    COURSE_CATALOG_KWS: 'COURSE_CATALOG_KWS',
} as const;

/**
 * Represents the type of SiteSupport.
 * It is a union type that includes all the values of the SiteSupport object.
 */
export type SiteSupportType = (typeof SiteSupport)[keyof typeof SiteSupport];

/**
 * We use this function to determine what page the user is on, and then we can use that information to determine what to do
 *
 * @param url - the url of the current page
 * @returns a list of page types that the current page is
 */
export default function getSiteSupport(url: string): SiteSupportType | null {
    if (isExtensionPopup()) {
        return SiteSupport.EXTENSION_POPUP;
    }
    if (isExtensionPage('my_calendar.html')) {
        return SiteSupport.MY_CALENDAR;
    }
    if (url.includes('utexas.collegescheduler.com')) {
        return SiteSupport.UT_PLANNER;
    }
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        if (url.includes('kws_results')) {
            return SiteSupport.COURSE_CATALOG_KWS;
        }
        if (url.includes('results')) {
            return SiteSupport.COURSE_CATALOG_LIST;
        }
        if (document.querySelector('#details')) {
            return SiteSupport.COURSE_CATALOG_DETAILS;
        }
        return SiteSupport.COURSE_CATALOG_SEARCH;
    }
    if (url.includes('utdirect.utexas.edu') && (url.includes('waitlist') || url.includes('classlist'))) {
        return SiteSupport.WAITLIST;
    }
    if (url.includes('my.utexas.edu/student/student/index') || url.includes('my.utexas.edu/student/')) {
        return SiteSupport.MY_UT;
    }
    if (url.includes('registration/classlist.WBX')) {
        return SiteSupport.CLASSLIST;
    }
    return null;
}
