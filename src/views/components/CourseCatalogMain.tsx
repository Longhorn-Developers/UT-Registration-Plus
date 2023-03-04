import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { bMessenger } from 'src/shared/messages';
import { Course } from 'src/shared/types/Course';
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
            {rows.map(row => (
                <TableRow key={row.id} row={row} />
            ))}
        </div>
    );
}

const TableRow: (props: { row: HTMLTableRowElement }) => JSX.Element | null = ({ row }) => {
    const [portalContainer, setPortalContainer] = React.useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        portalContainer.setAttribute('id', 'ut-registration-plus-table-row-portal');
        const lastTableCell = row.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setPortalContainer(portalContainer);
    }, []);

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
