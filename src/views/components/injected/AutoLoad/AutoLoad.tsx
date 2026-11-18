import 'react-loading-skeleton/dist/skeleton.css';

import type { ScrapedRow } from '@shared/types/Course';
import useInfiniteScroll from '@views/hooks/useInfiniteScroll';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import { SiteSupport } from '@views/lib/getSiteSupport';
import type { AutoLoadStatusType } from '@views/lib/loadNextCourseCatalogPage';
import {
    AutoLoadStatus,
    getNextButton,
    loadNextCourseCatalogPage,
    removePaginationButtons,
} from '@views/lib/loadNextCourseCatalogPage';
import type { JSX } from 'react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Skeleton from 'react-loading-skeleton';

import styles from './AutoLoad.module.scss';

type Props = {
    addRows: (rows: ScrapedRow[]) => void;
};

/**
 * This component is responsible for loading the next page of courses when the user scrolls to the bottom of the page.
 * @returns
 */
export default function AutoLoad({ addRows }: Props): JSX.Element | null {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<AutoLoadStatusType>(AutoLoadStatus.IDLE);
    const [isSinglePage, setIsSinglePage] = useState(false);
    // Tracks the last course header seen so paginated pages that start mid-course still parse correctly
    const lastFullNameRef = useRef<string>('');

    useEffect(() => {
        const table = document.querySelector('table');
        if (!table) return;
        const portalContainer = document.createElement('div');
        table.after(portalContainer);
        setContainer(portalContainer);
    }, []);

    useEffect(() => {
        setIsSinglePage(!getNextButton(document));
        removePaginationButtons(document);
    }, []);

    useEffect(() => {
        if (import.meta.env.DEV) console.log(`AutoLoad is now ${status}`);
        // FOR DEBUGGING
    }, [status]);

    // This hook will call the callback when the user scrolls to the bottom of the page.
    useInfiniteScroll(async () => {
        if (isSinglePage) return;
        // fetch the next page of courses
        const [status, nextRows] = await loadNextCourseCatalogPage();
        setStatus(status);
        if (nextRows.length === 0) {
            console.log('AutoLoad: no more rows to load');
            return;
        }
        // scrape the courses from the page, passing the last known course name so pages
        // that start mid-course (no header row at the top) are parsed correctly
        const ccs = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_LIST);
        const scrapedRows = ccs.scrape(nextRows, true, lastFullNameRef.current);

        // remember the last header seen for the next page
        const lastHeader = scrapedRows.findLast(r => r.course === null);
        if (lastHeader) {
            lastFullNameRef.current = ccs.getFullName(lastHeader.element) || lastFullNameRef.current;
        }

        // add the scraped courses to the current page
        addRows(scrapedRows);
    }, [addRows, isSinglePage]);

    if (!container || status === AutoLoadStatus.DONE || isSinglePage) {
        return null;
    }

    return createPortal(
        <div>
            {status !== AutoLoadStatus.ERROR && (
                <div className=''>
                    {Array.from({ length: 8 }).map(() => (
                        // biome-ignore lint/correctness/useJsxKeyInIterable: TODO:
                        <Skeleton style={{ marginBottom: 30 }} height={40} />
                    ))}
                </div>
            )}
            {status === AutoLoadStatus.ERROR && (
                <div className={styles.error}>
                    <h2>Something went wrong</h2>
                    <p>Try refreshing the page</p>
                    <button type='button' onClick={() => window.location.reload()}>
                        Refresh
                    </button>
                </div>
            )}
        </div>,
        container
    );
}
