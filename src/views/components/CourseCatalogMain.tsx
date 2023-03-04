import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course } from 'src/shared/types/Course';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { populateSearchInputs } from '../lib/courseCatalog/populateSearchInputs';
import { SiteSupport } from '../lib/getSiteSupport';
import TableHead from './injected/TableHead';
import TableRow from './injected/TableRow';

interface Props {
    support: SiteSupport.COURSE_CATALOG_DETAILS | SiteSupport.COURSE_CATALOG_LIST;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props) {
    const [rows, setRows] = React.useState<HTMLTableRowElement[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const isScrolling = useInfiniteScroll(async () => {
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

    const handleRowButtonClick = (course: Course) => {
        setSelectedCourse(course);
    };

    return (
        <div>
            <TableHead>Plus</TableHead>
            {rows.map(row => (
                <TableRow row={row} onClick={handleRowButtonClick} />
            ))}
            {isScrolling && <div>Scrolling...</div>}
        </div>
    );
}

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
