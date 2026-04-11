import getCourseTableRows from './getCourseTableRows';

const NEXT_PAGE_BUTTON_SELECTOR = '#next_nav_link';
const PREV_PAGE_BUTTON_SELECTOR = '#prev_nav_link';

/**
 * Represents all the states that we care about when autoloading the next page of courses
 */
export const AutoLoadStatus = {
    LOADING: 'LOADING',
    IDLE: 'IDLE',
    ERROR: 'ERROR',
    DONE: 'DONE',
} as const;

/**
 * Represents the type of the auto load status.
 * It is a union type that includes all the values of the AutoLoadStatus object.
 */
export type AutoLoadStatusType = (typeof AutoLoadStatus)[keyof typeof AutoLoadStatus];

let isLoading = false;
let nextPageURL = getNextButton(document)?.href;

/**
 * Extracts the raw href attribute from the next-page link in a document.
 * Uses getAttribute instead of .href to avoid DOMParser resolving relative
 * URLs against about:blank.
 */
function getNextPageURL(doc: Document): string | undefined {
    const raw = getNextButton(doc)?.getAttribute('href');
    if (!raw) return undefined;
    try {
        return new URL(raw, window.location.href).href;
    } catch {
        return undefined;
    }
}

/**
 * This will scrape the pagination buttons from the course list and use them to load the next page
 * and then return the table rows from the next page
 *
 * @returns a tuple of the current LoadStatus (whether are currently loading the next page, or if we have reached the end of the course catalog,
 * or if there was an error loading the next page) and an array of the table rows from the next page (or an empty array
 * if we have reached the end of the course catalog
 */
export async function loadNextCourseCatalogPage(): Promise<[AutoLoadStatusType, HTMLTableRowElement[]]> {
    // if there is no more nextPageURL, then we have reached the end of the course catalog, so we can stop
    if (!nextPageURL) {
        return [AutoLoadStatus.DONE, []];
    }
    // remove the next button so that we don't load the same page twice
    removePaginationButtons(document);
    if (isLoading) {
        // if we are already loading the next page, then we don't need to do anything
        return [AutoLoadStatus.LOADING, []];
    }

    // begin loading the next page
    isLoading = true;
    try {
        const response = await fetch(nextPageURL);
        const html = await response.text();
        const parser = new DOMParser();
        const newDocument = parser.parseFromString(html, 'text/html');

        // extract the table rows from the document of the next page
        const tableRows = getCourseTableRows(newDocument);
        if (!tableRows.length) {
            isLoading = false;
            return [AutoLoadStatus.ERROR, []];
        }

        // extract the next page url from the document of the next page, so when we scroll again we can use that
        nextPageURL = getNextPageURL(newDocument);
        isLoading = false;
        return [AutoLoadStatus.IDLE, tableRows];
    } catch (e) {
        console.error(e);
        isLoading = false;
        return [AutoLoadStatus.ERROR, []];
    }
}

/**
 * Scrapes the next button from the document
 *
 * @param doc - the document to get the next button from
 * @returns the next button from the document
 */
export function getNextButton(doc: Document) {
    return doc.querySelector<HTMLAnchorElement>(NEXT_PAGE_BUTTON_SELECTOR);
}

/**
 * Hides the next and previous buttons from the document
 *
 * @param doc - the document to remove the next and previous buttons from
 */
export function removePaginationButtons(doc: Document) {
    const nextButton = doc.querySelectorAll<HTMLAnchorElement>(NEXT_PAGE_BUTTON_SELECTOR);
    nextButton.forEach(button => {
        button.style.display = 'none';
    });

    const prevButton = doc.querySelectorAll<HTMLAnchorElement>(PREV_PAGE_BUTTON_SELECTOR);
    prevButton.forEach(button => {
        button.style.display = 'none';
    });
}
