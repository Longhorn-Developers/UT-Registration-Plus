const TABLE_ROW_SELECTOR = 'table tbody tr';

/**
 * Returns an array of all the rows in the course table on the passed in document
 *
 * @param doc - the document to get the course table rows from
 * @returns an array of all the rows in the course table on the passed in document
 */
export default function getCourseTableRows(doc: Document): HTMLTableRowElement[] {
    const courseRows = doc.querySelectorAll<HTMLTableRowElement>(TABLE_ROW_SELECTOR);
    return Array.from(courseRows);
}
