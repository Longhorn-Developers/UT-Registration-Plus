import { OptionsStore } from '@shared/storage/OptionsStore';
import type { Course, ScrapedRow } from '@shared/types/Course';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import AutoLoad from '@views/components/injected/AutoLoad/AutoLoad';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import NewSearchLink from '@views/components/injected/NewSearchLink';
import RecruitmentBanner from '@views/components/injected/RecruitmentBanner/RecruitmentBanner';
import TableHead from '@views/components/injected/TableHead';
import TableRow from '@views/components/injected/TableRow/TableRow';
import { useActiveSchedule } from '@views/hooks/useSchedules';
import { CourseCatalogScraper } from '@views/lib/CourseCatalogScraper';
import getCourseTableRows from '@views/lib/getCourseTableRows';
import type { SiteSupportType } from '@views/lib/getSiteSupport';
import { populateSearchInputs } from '@views/lib/populateSearchInputs';
import React, { useEffect, useRef, useState } from 'react';

import DialogProvider from './common/DialogProvider/DialogProvider';

interface Props {
    support: Extract<SiteSupportType, 'COURSE_CATALOG_DETAILS' | 'COURSE_CATALOG_LIST'>;
}

/**
 * This is the top level react component orchestrating the course catalog page.
 */
export default function CourseCatalogMain({ support }: Props): React.JSX.Element | null {
    const [rows, setRows] = React.useState<ScrapedRow[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const enableScrollToLoad = OptionsStore.useStore(store => store.enableScrollToLoad);
    const prevCourseTitleRef = useRef<string | null>(null);
    // biome-ignore lint/style/noNonNullAssertion: TODO: add checks
    const tbody = document.querySelector('table tbody')!;

    useEffect(() => {
        populateSearchInputs();
    }, []);

    useEffect(() => {
        const tableRows = getCourseTableRows(document);
        const ccs = new CourseCatalogScraper(support);
        const scrapedRows = ccs.scrape(tableRows, true);
        setRows(scrapedRows);
        prevCourseTitleRef.current =
            scrapedRows.findLast(row => row.course === null)?.element.querySelector('.course_header')?.textContent ??
            null;
    }, [support]);

    const addRows = (newRows: ScrapedRow[]) => {
        newRows.forEach(row => {
            const courseTitle = row.element.querySelector('.course_header')?.textContent ?? null;
            if (row.course === null) {
                if (courseTitle !== prevCourseTitleRef.current) {
                    tbody.appendChild(row.element);
                    prevCourseTitleRef.current = courseTitle;
                }
            } else {
                tbody.appendChild(row.element);
            }
        });

        setRows([...rows, ...newRows]);
    };

    const openCoursePopup = (course: Course) => () => {
        setCourse(course);
        setIsPopupOpen(true);
    };

    const activeSchedule = useActiveSchedule();

    if (!activeSchedule) {
        return null;
    }

    return (
        <ExtensionRoot>
            <DialogProvider>
                <NewSearchLink />
                <RecruitmentBanner />
                <TableHead>Plus</TableHead>
                {rows.map(
                    row =>
                        row.course && (
                            <TableRow
                                key={row.course.uniqueId}
                                row={row}
                                isSelected={row.course.uniqueId === course?.uniqueId}
                                activeSchedule={activeSchedule}
                                onClick={openCoursePopup(row.course)}
                            />
                        )
                )}
                {course && (
                    <CourseCatalogInjectedPopup
                        course={course}
                        open={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}
                        afterLeave={() => setCourse(null)}
                    />
                )}
                {enableScrollToLoad && <AutoLoad addRows={addRows} />}
            </DialogProvider>
        </ExtensionRoot>
    );
}
