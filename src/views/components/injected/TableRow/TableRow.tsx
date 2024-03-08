import type { Course, ScrapedRow } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import ConflictsWithWarning from '@views/components/common/ConflictsWithWarning/ConflictsWithWarning';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import RowIcon from '~icons/material-symbols/bar-chart-rounded';

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
        element.classList.add('group');
        const portalContainer = document.createElement('td');
        // portalContainer.style.textAlign = 'right';
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
    }, [activeSchedule, course, element.classList]);

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
        <div className='relative'>
            <button
                className='bg-ut-burntorange w-6 h-6 items-center justify-center color-white! flex m1 rounded'
                onClick={onClick}
            >
                <RowIcon color='ut-white' />
            </button>
            {conflicts.length > 0 && (
                <ConflictsWithWarning
                    className='group-hover:visible invisible text-white absolute left-13 top--3'
                    conflicts={conflicts}
                />
            )}
        </div>,
        container
    );
}
