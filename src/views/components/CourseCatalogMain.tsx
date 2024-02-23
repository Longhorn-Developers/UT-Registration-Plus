import type { Course, ScrapedRow } from '@shared/types/Course';
import React, { useEffect, useState } from 'react';

import { useKeyPress } from '../hooks/useKeyPress';
import useSchedules from '../hooks/useSchedules';
import { CourseCatalogScraper } from '../lib/CourseCatalogScraper';
import getCourseTableRows from '../lib/getCourseTableRows';
import type { SiteSupport } from '../lib/getSiteSupport';
import { populateSearchInputs } from '../lib/populateSearchInputs';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';
import AutoLoad from './injected/AutoLoad/AutoLoad';
import CourseCatalogInjectedPopup from './injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import RecruitmentBanner from './injected/RecruitmentBanner/RecruitmentBanner';
import TableHead from './injected/TableHead';
import TableRow from './injected/TableRow/TableRow';
import TableSubheading from './injected/TableSubheading/TableSubheading';

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
        const scrapedRows = ccs.scrape(tableRows, true);
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

    const [activeSchedule] = useSchedules();

    if (!activeSchedule) {
        return null;
    }

    return (
        <ExtensionRoot>
            <RecruitmentBanner />
            <TableHead>Plus</TableHead>
            {rows.map((row, i) => {
                if (!row.course) {
                    // TODO: handle the course section headers
                    return <TableSubheading key={row.element.innerText + i.toString()} row={row} />;
                }
                return (
                    <TableRow
                        key={row.course.uniqueId}
                        row={row}
                        isSelected={row.course.uniqueId === selectedCourse?.uniqueId}
                        activeSchedule={activeSchedule}
                        onClick={handleRowButtonClick(row.course)}
                    />
                );
            })}
            {selectedCourse && (
                <CourseCatalogInjectedPopup
                    course={selectedCourse}
                    activeSchedule={activeSchedule}
                    onClose={handleClearSelectedCourse}
                />
            )}
            <AutoLoad addRows={addRows} />
        </ExtensionRoot>
    );
}
