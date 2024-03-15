import type { Course, ScrapedRow } from '@shared/types/Course';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import AutoLoad from '@views/components/injected/AutoLoad/AutoLoad';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import RecruitmentBanner from '@views/components/injected/RecruitmentBanner/RecruitmentBanner';
import TableHead from '@views/components/injected/TableHead';
import TableRow from '@views/components/injected/TableRow/TableRow';
// import TableSubheading from '@views/components/injected/TableSubheading/TableSubheading';
import useSchedules from '@views/hooks/useSchedules';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import type { SiteSupportType } from '@views/lib/getSiteSupport';
import { populateSearchInputs } from '@views/lib/populateSearchInputs';
import React, { useEffect, useState } from 'react';

interface Props {
    support: Extract<SiteSupportType, 'COURSE_CATALOG_DETAILS' | 'COURSE_CATALOG_LIST'>;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props): JSX.Element {
    const [rows, setRows] = React.useState<ScrapedRow[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        populateSearchInputs();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setShowPopup(true);
        }
    }, [selectedCourse]);

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

    // useKeyPress('Escape', handleClearSelectedCourse);

    const [activeSchedule] = useSchedules();

    if (!activeSchedule) {
        return null;
    }

    return (
        <ExtensionRoot>
            <RecruitmentBanner />
            <TableHead>Plus</TableHead>
            {rows.map(
                row =>
                    row.course && (
                        <TableRow
                            key={row.course.uniqueId}
                            row={row}
                            isSelected={row.course.uniqueId === selectedCourse?.uniqueId}
                            activeSchedule={activeSchedule}
                            onClick={handleRowButtonClick(row.course)}
                        />
                    )
            )}
            <CourseCatalogInjectedPopup
                course={selectedCourse}
                activeSchedule={activeSchedule}
                show={showPopup}
                onClose={() => setShowPopup(false)}
                afterLeave={() => setSelectedCourse(null)}
            />
            <AutoLoad addRows={addRows} />
        </ExtensionRoot>
    );
}
