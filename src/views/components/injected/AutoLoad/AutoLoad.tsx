import { ScrapedRow } from '@src/shared/types/Course';
import useInfiniteScroll from '@src/views/hooks/useInfiniteScroll';
import { CourseCatalogScraper } from '@src/views/lib/CourseCatalogScraper';
import { SiteSupport } from '@src/views/lib/getSiteSupport';
import {
    AutoLoadStatus,
    loadNextCourseCatalogPage,
    removePaginationButtons,
} from '@src/views/lib/loadNextCourseCatalogPage';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AutoLoad.module.scss';

type Props = {
    addRows: (rows: ScrapedRow[]) => void;
};

/**
 * This component is responsible for loading the next page of courses when the user scrolls to the bottom of the page.
 * @returns
 */
export default function AutoLoad({ addRows }: Props) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [status, setStatus] = useState<AutoLoadStatus>(AutoLoadStatus.IDLE);

    useEffect(() => {
        const portalContainer = document.createElement('div');
        const lastTableCell = document.querySelector('table')!;
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);
    }, []);

    useEffect(() => {
        removePaginationButtons(document);
        console.log(`AutoLoad is now ${status}`);
        // FOR DEBUGGING
    }, [status]);

    // This hook will call the callback when the user scrolls to the bottom of the page.
    useInfiniteScroll(async () => {
        // fetch the next page of courses
        const [status, nextRows] = await loadNextCourseCatalogPage();
        setStatus(status);
        if (!nextRows) {
            return;
        }
        // scrape the courses from the page
        const ccs = new CourseCatalogScraper(SiteSupport.COURSE_CATALOG_LIST);
        const scrapedRows = await ccs.scrape(nextRows, true);

        // add the scraped courses to the current page
        addRows(scrapedRows);
    }, [addRows]);

    if (!container || status === AutoLoadStatus.DONE) {
        return null;
    }

    return createPortal(
        <div>
            {status !== AutoLoadStatus.ERROR && (
                <div
                    style={{
                        height: '500px',
                        backgroundColor: '#f4f4f4',
                    }}
                >
                    {/* <Spinner />
                    <h2>Loading Next Page...</h2> */}
                </div>
            )}
            {status === AutoLoadStatus.ERROR && (
                <div className={styles.error}>
                    <h2>Something went wrong</h2>
                    <p>Try refreshing the page</p>
                    <button onClick={() => window.location.reload()}>Refresh</button>
                </div>
            )}
        </div>,
        container
    );
}
