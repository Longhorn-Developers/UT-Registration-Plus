import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course } from 'src/shared/types/Course';
import { Button } from '../common/Button/Button';

interface Props {
    row: HTMLTableRowElement;
    onClick: (course: Course) => void;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableRow({ row, onClick }: Props): JSX.Element | null {
    const [container, setContainer] = useState<HTMLTableCellElement | null>(null);
    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = row.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);
    }, []);

    useEffect(() => {
        const course = scrapeCourseFromRow(row);
        setCourse(course);
    }, [row]);

    if (!container || !course) {
        return null;
    }

    const handleOnClick = () => {
        onClick(course);
    };

    return ReactDOM.createPortal(<Button onClick={handleOnClick}>Plus</Button>, container);
}

function scrapeCourseFromRow(row): Course {
    return null as any;
}
