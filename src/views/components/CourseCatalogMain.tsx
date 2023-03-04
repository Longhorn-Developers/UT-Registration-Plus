import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Course } from 'src/shared/types/Course';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { populateSearchInputs } from '../lib/courseCatalog/populateSearchInputs';
import { SiteSupport } from '../lib/getSiteSupport';
import { Button } from './common/Button/Button';

interface Props {
    support: SiteSupport.COURSE_CATALOG_DETAILS | SiteSupport.COURSE_CATALOG_LIST;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props) {
    const [rows, setRows] = React.useState<HTMLTableRowElement[]>([]);
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

    const [shouldHighlight, setShouldHighlight] = React.useState(false);

    const isInfiniteScrollLoading = useInfiniteScroll(async () => {
        console.log('infinite scroll');
        return false;
    });

    useEffect(() => {
        populateSearchInputs();
    }, []);

    useEffect(() => {
        const rows = scrapeRowsFromCourseTable();
        setRows(rows);
    }, []);

    return (
        <div>
            <TableHead />
            <Button onClick={() => setRows([])}>{shouldHighlight ? 'Unhighlight' : 'Highlight'}</Button>
            {rows.map(row => (
                <TableRow row={row} shouldHighlight={shouldHighlight} />
            ))}
            {isInfiniteScrollLoading && <div>Scrolling...</div>}
        </div>
    );
}

const TableRow: (props: { row: HTMLTableRowElement; shouldHighlight: boolean }) => JSX.Element | null = ({
    row,
    shouldHighlight,
}) => {
    const [portalContainer, setPortalContainer] = React.useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = row.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setPortalContainer(portalContainer);
    }, []);

    useEffect(() => {
        console.log('shouldHighlight', shouldHighlight);
        // make the color of the row change when the button is clicked
        if (shouldHighlight) {
            row.querySelectorAll('td').forEach(td => {
                td.style.color = 'red';
            });
        } else {
            row.querySelectorAll('td').forEach(td => {
                td.style.color = '';
            });
        }
    }, [shouldHighlight, row]);

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(<Button>Plus</Button>, portalContainer);
};

const TableHead = () => {
    const [portalContainer, setPortalContainer] = React.useState<HTMLTableHeaderCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('th');
        portalContainer.setAttribute('scope', 'col');
        portalContainer.setAttribute('id', 'ut-registration-plus-table-head-portal');
        const lastTableHeadCell = document.querySelector('table thead th:last-child');
        lastTableHeadCell!.after(portalContainer);
        setPortalContainer(portalContainer);
    }, []);

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(<span>Plus</span>, portalContainer);
};

function scrapeRowsFromCourseTable(): HTMLTableRowElement[] {
    const rows = Array.from(document.querySelectorAll('table tbody tr')) as HTMLTableRowElement[];

    return Array.from(rows).filter(row => {
        if (row.querySelector('th')) {
            return false;
        }
        if (row.querySelector('td.course_header')) {
            return false;
        }
        return true;
    });
}
