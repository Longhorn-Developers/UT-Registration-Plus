import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course, CourseRow, CourseScraper } from 'src/shared/types/Course';
import { CourseCatalogDetailsScraper } from 'src/shared/types/CourseCatalogDetailsScraper';
import { CourseCatalogRowScraper } from 'src/shared/types/CourseCatalogRowScraper';
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
    const [rows, setRows] = React.useState<CourseRow[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const isScrolling = useInfiniteScroll(async () => {
        console.log('infinite scroll');
        return false;
    });

    useEffect(() => {
        populateSearchInputs();
    }, []);

    useEffect(() => {
        const rows = scrapeCourseRows(support);
        setRows(rows);
    }, []);

    const handleRowButtonClick = (course: Course) => {
        setSelectedCourse(course);
    };

    return (
        <div>
            <TableHead>Plus</TableHead>
            {rows.map(row => (
                <TableRow element={row.rowElement} support={support} onClick={handleRowButtonClick} />
            ))}
            {isScrolling && <div>Scrolling...</div>}
        </div>
    );
}

function scrapeCourseRows(support: SiteSupport): CourseRow[] {
    const rows: CourseRow[] = [];

    let name: string | null = null;
    if (support === SiteSupport.COURSE_CATALOG_DETAILS) {
        const header = document.querySelector('#details h2');
        if (!header?.textContent) {
            throw new Error('Could not find course name on course details page.');
        }
        name = header.textContent.trim();
    }

    document.querySelectorAll<HTMLTableRowElement>('table tbody tr').forEach(row => {
        // rows that have a course header are the start of a new section, so save the section name and skip
        const header = row.querySelector('td.course_header');
        if (header?.textContent) {
            name = header.textContent.trim();
            return;
        }
        if (!name) {
            throw new Error('Could not find any course sections.');
        }

        const course = scrapeCourseFromRow(name, support, row);
    });
    return rows;
}

function scrapeCourseFromRow(name: string, support: SiteSupport, row: HTMLTableRowElement): Course {
    let url = support === SiteSupport.COURSE_CATALOG_DETAILS ? window.location.href : null;


    
}
