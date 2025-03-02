import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course, ScrapedRow } from '@shared/types/Course';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import AutoLoad from '@views/components/injected/AutoLoad/AutoLoad';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import NewSearchLink from '@views/components/injected/NewSearchLink';
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
export default function CourseCatalogMain({ support }: Props): JSX.Element | null {
    const [rows, setRows] = React.useState<ScrapedRow[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [enableScrollToLoad, setEnableScrollToLoad] = useState<boolean>(false);

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

    useEffect(() => {
        OptionsStore.get('enableScrollToLoad').then(setEnableScrollToLoad);
    }, []);

    const addRows = (newRows: ScrapedRow[]) => {
        let lastCourse: Course | null = null;
    
        newRows.forEach(row => {
            const course = row.course;
    
            // Only append the row if the course is different from the last one
            if (course !== lastCourse) {
                document.querySelector('table tbody')!.appendChild(row.element);
                lastCourse = course;
            }
        });
    
        setRows([...rows, ...newRows]);
    };

    const handleRowButtonClick = (course: Course) => () => {
        setSelectedCourse(course);
    };

    const [activeSchedule] = useSchedules();

    if (!activeSchedule) {
        return null;
    }

    return (
        <ExtensionRoot>
            <NewSearchLink />
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
                course={selectedCourse!} // always defined when showPopup is true
                show={showPopup}
                onClose={() => setShowPopup(false)}
                afterLeave={() => setSelectedCourse(null)}
            />
            {enableScrollToLoad && <AutoLoad addRows={addRows} />}
        </ExtensionRoot>
    );
}
