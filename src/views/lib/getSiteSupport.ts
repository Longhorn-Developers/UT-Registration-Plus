import { isExtensionPage, isExtensionPopup } from 'chrome-extension-toolkit';

/**
 * An enum that represents the different types of pages that we support
 * a given url/page can correspond to many of these enum values
 */
export enum SiteSupport {
    COURSE_CATALOG_LIST = 'COURSE_CATALOG_LIST',
    COURSE_CATALOG_DETAILS = 'COURSE_CATALOG_DETAILS',
    UT_PLANNER = 'UT_PLANNER',
    WAITLIST = 'WAITLIST',
    EXTENSION_POPUP = 'EXTENSION_POPUP',
    MY_CALENDAR = 'MY_CALENDAR',
}

/**
 * We use this function to determine what page the user is on, and then we can use that information to determine what to do
 * @param url the url of the current page
 * @returns a list of page types that the current page is
 */
export default function getSiteSupport(url: string): SiteSupport | null {
    if (isExtensionPopup()) {
        return SiteSupport.EXTENSION_POPUP;
    }
    if (isExtensionPage('MyCalendar.html')) {
        return SiteSupport.MY_CALENDAR;
    }
    if (url.includes('utexas.collegescheduler.com')) {
        return SiteSupport.UT_PLANNER;
    }
    if (url.includes('utdirect.utexas.edu/apps/registrar/course_schedule')) {
        if (url.includes('results')) {
            return SiteSupport.COURSE_CATALOG_LIST;
        }
        if (document.querySelector('#details')) {
            return SiteSupport.COURSE_CATALOG_DETAILS;
        }
    }
    if (url.includes('utdirect.utexas.edu') && (url.includes('waitlist') || url.includes('classlist'))) {
        return SiteSupport.WAITLIST;
    }
    return null;
}
