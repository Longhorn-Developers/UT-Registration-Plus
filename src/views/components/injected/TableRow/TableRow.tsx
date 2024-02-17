import { Course, ScrapedRow } from '@shared/types/Course';
import { UserSchedule } from '@shared/types/UserSchedule';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import Text from '../../common/Text/Text';
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

    // the courses in the active schedule that conflict with the course for this row
    const [conflicts, setConflicts] = useState<Course[]>([]);

    const { element, course } = row;

    useEffect(() => {
        element.classList.add(styles.row);
        const portalContainer = document.createElement('td');
        portalContainer.style.textAlign = 'right';
        const lastTableCell = element.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setContainer(portalContainer);

        return () => {
            portalContainer.remove();
            element.classList.remove(styles.row);
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

        let conflicts: Course[] = [];

        for (const c of activeSchedule.courses) {
            if (c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0) {
                conflicts.push(c);
            }
        }

        element.classList[conflicts.length ? 'add' : 'remove'](styles.isConflict);
        setConflicts(conflicts);

        return () => {
            element.classList.remove(styles.isConflict);
            setConflicts([]);
        };
    }, [activeSchedule, course, element.classList]);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <>
            <Button className={styles.rowButton} onClick={onClick} variant='secondary'>
                <Icon name='bar_chart' color='white' size='medium' />
            </Button>
            {conflicts.length > 0 && (
                <div className={styles.conflictTooltip}>
                    <div className={styles.body}>
                        {conflicts.map(c => (
                            <Text /*    size='small'    */ key={c.uniqueId}>
                                {c.department} {c.number} ({c.uniqueId})
                            </Text>
                        ))}
                    </div>
                </div>
            )}
        </>,
        container
    );
}
