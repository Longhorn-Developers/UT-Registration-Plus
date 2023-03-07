import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course, ScrapedRow } from 'src/shared/types/Course';
import { SiteSupport } from 'src/views/lib/getSiteSupport';
import { Button } from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import styles from './TableRow.module.scss';

interface Props {
    support: SiteSupport;
    isSelected: boolean;
    course: Course;
    element: HTMLTableRowElement;
    onClick: (...args: any[]) => any;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableRow({ support, course, element, isSelected, onClick }: Props): JSX.Element | null {
    const [container, setContainer] = useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = element.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);
    }, []);

    useEffect(() => {
        element.classList[isSelected ? 'add' : 'remove'](styles.selectedRow);
    }, [course, isSelected, element.classList]);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <Button onClick={onClick} type='secondary'>
            <Icon name='bar_chart' color='white' size='medium' />
        </Button>,
        container
    );
}
