import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course, ScrapedRow } from 'src/shared/types/Course';
import { Button } from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import styles from './TableRow.module.scss';

interface Props {
    isSelected: boolean;
    row: ScrapedRow;
    onClick: (...args: any[]) => any;
    /**
     * Whether the course is in the user' active schedule.
     */
    isInActiveSchedule: boolean;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableRow({ row, isSelected, isInActiveSchedule, onClick }: Props): JSX.Element | null {
    const [container, setContainer] = useState<HTMLTableCellElement | null>(null);

    const { element, course } = row;

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = element.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);

        return () => {
            portalContainer.remove();
        };
    }, [element]);

    useEffect(() => {
        element.classList[isSelected ? 'add' : 'remove'](styles.selectedRow);
    }, [isSelected, element.classList]);

    useEffect(() => {
        element.classList[isInActiveSchedule ? 'add' : 'remove'](styles.inActiveSchedule);
    }, [isInActiveSchedule, element.classList]);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <Button className={styles.rowButton} onClick={onClick} type='secondary'>
            <Icon name='bar_chart' color='white' size='medium' />
        </Button>,
        container
    );
}
