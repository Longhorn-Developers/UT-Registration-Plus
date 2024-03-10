import type { Course, ScrapedRow } from '@shared/types/Course';
import AutoLoad from '@views/components/injected/AutoLoad/AutoLoad';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import RecruitmentBanner from '@views/components/injected/RecruitmentBanner/RecruitmentBanner';
import TableHead from '@views/components/injected/TableHead';
import TableRow from '@views/components/injected/TableRow/TableRow';
import TableSubheading from '@views/components/injected/TableSubheading/TableSubheading';
import { useKeyPress } from '@views/hooks/useKeyPress';
import useSchedules from '@views/hooks/useSchedules';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import type { SiteSupportType } from '@views/lib/getSiteSupport';
import { populateSearchInputs } from '@views/lib/populateSearchInputs';
import React, { useEffect, useState } from 'react';

import ExtensionRootAlternate from './common/ExtensionRootAlternate/ExtensionRootAlternate';

interface Props {
    support: Extract<SiteSupportType, 'COURSE_CATALOG_DETAILS' | 'COURSE_CATALOG_LIST'>;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props): JSX.Element {
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
        <ExtensionRootAlternate>
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
        </ExtensionRootAlternate>
    );
}
