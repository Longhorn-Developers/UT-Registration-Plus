import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Course, ScrapedRow } from 'src/shared/types/Course';
import { UserSchedule } from 'src/shared/types/UserSchedule';
import { Button } from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import styles from './TableRow.module.scss';

interface Props {
    isSelected: boolean;
    row: ScrapedRow;
    onClick: (...args: any[]) => any;
    activeSchedule?: UserSchedule;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableRow({ row, isSelected, activeSchedule, onClick }: Props): JSX.Element | null {
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
        if (!activeSchedule || !course) return;

        const isInSchedule = activeSchedule.containsCourse(course);

        element.classList[isInSchedule ? 'add' : 'remove'](styles.inActiveSchedule);

        return () => {
            element.classList.remove(styles.inActiveSchedule);
        };
    }, [activeSchedule, element.classList]);

    useEffect(() => {
        if (!activeSchedule || !course) {
            return;
        }

        let hasConflicts = activeSchedule.courses.find(c => {
            let conflicts = course.getConflicts(c);
            return conflicts.length > 0;
        });

        element.classList[hasConflicts ? 'add' : 'remove'](styles.isConflict);

        return () => {
            element.classList.remove(styles.isConflict);
        };
    }, [activeSchedule, course]);

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
