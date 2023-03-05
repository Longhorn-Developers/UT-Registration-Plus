import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course, CourseRow } from 'src/shared/types/Course';
import { SiteSupport } from 'src/views/lib/getSiteSupport';
import { Button } from '../common/Button/Button';

interface Props {
    support: SiteSupport;
    course: Course;
    element: HTMLTableRowElement;
    onClick: (...args: any[]) => any;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableRow({ support, course, element, onClick }: Props): JSX.Element | null {
    const [container, setContainer] = useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = element.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);
    }, []);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(<Button onClick={onClick}>Plus</Button>, container);
}
