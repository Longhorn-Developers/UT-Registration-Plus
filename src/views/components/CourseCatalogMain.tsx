import React, { useEffect, useState } from 'react';
import { Course, ScrapedRow } from 'src/shared/types/Course';
import { useKeyPress } from '../hooks/useKeyPress';
import { CourseCatalogScraper } from '../lib/CourseCatalogScraper';
import getCourseTableRows from '../lib/getCourseTableRows';
import { SiteSupport } from '../lib/getSiteSupport';
import { populateSearchInputs } from '../lib/populateSearchInputs';
import colors from '../styles/colors.module.scss';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';
import Icon from './common/Icon/Icon';
import Text from './common/Text/Text';
import AutoLoad from './injected/AutoLoad/AutoLoad';
import CoursePopup from './injected/CoursePopup/CoursePopup';
import Link from 'src/views/components/common/Link/Link';
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
    const validCourseTypes = ["C S", "ECE", "MIS"]

    useEffect(() => {
        populateSearchInputs();
    }, []);


    const isComputerScience = () => {
        const element = document.getElementById("filter_form");
        if(element == null) {
            return false;
        }
        if (validCourseTypes.includes(element[12].value) || validCourseTypes.includes(element[16].value)) {
            return true;
        }
        return false;
    }


    useEffect(() => {
        const tableRows = getCourseTableRows(document);
        const ccs = new CourseCatalogScraper(support);
        const scrapedRows = ccs.scrape(tableRows);
        setRows(scrapedRows);
    }, [support]);
    

    useEffect(() => {
        if (isComputerScience()) {
            const banner = document.createElement("div");
            banner.innerHTML = "Interested in helping develop UT Registration Plus? Join our <a style='color:#FFFFFF' href='https://discord.gg/qjcvgyVJbT'>Discord Server</a> and check out our <a style='color:#FFFFFF' href='https://github.com/sghsri/UT-Registration-Plus'>Github Page!</a>";
            banner.style.backgroundColor = colors.burnt_orange;
            banner.style.color = "white";
            banner.style.textAlign = "center";
            banner.style.padding = "10px";
            banner.style.marginBottom = "10px";
            const table = document.getElementsByClassName("rwd-table results");
            table[0].parentNode!.insertBefore(banner, table[0]);
        }
    }, []);



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
            <TableHead>Plus</TableHead>
            {rows.map(row => {
                if (!row.course) {
                    // TODO: handle the course section headers
                    return null;
                }
                return (
                    <TableRow
                        key={row.course.uniqueId}
                        row={row}
                        isSelected={row.course.uniqueId === selectedCourse?.uniqueId}
                        onClick={handleRowButtonClick(row.course)}
                    />
                );
            })}
            {selectedCourse && <CoursePopup course={selectedCourse} onClose={handleClearSelectedCourse} />}
            <AutoLoad addRows={addRows} />
        </ExtensionRoot>
    );
}
