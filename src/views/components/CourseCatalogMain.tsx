import React, { useEffect, useState } from 'react';
import { Course, ScrapedRow } from 'src/shared/types/Course';
import { useKeyPress } from '../hooks/useKeyPress';
import { CourseCatalogScraper } from '../lib/CourseCatalogScraper';
import getCourseTableRows from '../lib/getCourseTableRows';
import { SiteSupport } from '../lib/getSiteSupport';
import { populateSearchInputs } from '../lib/populateSearchInputs';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';
import Icon from './common/Icon/Icon';
import Text from './common/Text/Text';
import AutoLoad from './injected/AutoLoad/AutoLoad';
import CoursePopup from './injected/CoursePopup/CoursePopup';
import TableHead from './injected/TableHead';
import TableRow from './injected/TableRow/TableRow';

interface Props {
    support: SiteSupport.COURSE_CATALOG_DETAILS | SiteSupport.COURSE_CATALOG_LIST;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props) {
    const [rows, setRows] = React.useState<ScrapedRow[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        populateSearchInputs();
    }, []);

    useEffect(() => {
        const tableRows = getCourseTableRows(document);
        const ccs = new CourseCatalogScraper(support);
        const scrapedRows = ccs.scrape(tableRows);
        setRows(scrapedRows);
    }, [support]);

    const addRows = (newRows: ScrapedRow[]) => {
        newRows.forEach(row => {
            document.querySelector('table tbody')!.appendChild(row.element);
        });
        setRows([...rows, ...newRows]);
    };

    const handleRowButtonClick = (course: Course) => () => {
        setSelectedCourse(course);
    };

    const handleClearSelectedCourse = () => {
        setSelectedCourse(null);
    };

    useKeyPress('Escape', handleClearSelectedCourse);

    return (
        <ExtensionRoot>
            <TableHead>
                Plus
                <Icon name='add' />
            </TableHead>
            {rows.map(row => {
                if (!row.course) {
                    // TODO: handle the course section headers
                    return null;
                }
                return (
                    <TableRow
                        key={row.course.uniqueId}
                        element={row.element}
                        course={row.course}
                        isSelected={row.course.uniqueId === selectedCourse?.uniqueId}
                        support={support}
                        onClick={handleRowButtonClick(row.course)}
                    />
                );
            })}
            {selectedCourse && <CoursePopup course={selectedCourse} onClose={handleClearSelectedCourse} />}
            <AutoLoad addRows={addRows} />
        </ExtensionRoot>
    );
}
