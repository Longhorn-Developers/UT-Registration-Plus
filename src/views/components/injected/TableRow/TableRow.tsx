import { ChartBar } from '@phosphor-icons/react';
import { initSettings, OptionsStore } from '@shared/storage/OptionsStore';
import type { Course, ScrapedRow } from '@shared/types/Course';
import type { UserSchedule } from '@shared/types/UserSchedule';
import ConflictsWithWarning from '@views/components/common/ConflictsWithWarning';
import ExtensionRoot from '@views/components/common/ExtensionRoot/ExtensionRoot';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import styles from './TableRow.module.scss';

interface Props {
    isSelected: boolean;
    row: ScrapedRow;
    onClick: (...args: unknown[]) => unknown;
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
    const [highlightConflicts, setHighlightConflicts] = useState<boolean>(false);

    const { element, course } = row;

    useEffect(() => {
        initSettings().then(({ enableHighlightConflicts }) => {
            setHighlightConflicts(enableHighlightConflicts);
        });

        const l1 = OptionsStore.subscribe('enableHighlightConflicts', async ({ newValue }) => {
            setHighlightConflicts(newValue);
            // console.log('enableHighlightConflicts', newValue);
        });

        // Remove listeners when the component is unmounted
        return () => {
            OptionsStore.unsubscribe(l1);
        };
    }, []);

    useEffect(() => {
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        element.classList.add(styles.row!);
        element.classList.add('group');
        const portalContainer = document.createElement('td');
        // portalContainer.style.textAlign = 'right';
        const lastTableCell = element.querySelector('td:last-child');
        lastTableCell?.after(portalContainer);
        setContainer(portalContainer);

        return () => {
            portalContainer.remove();
            // biome-ignore lint/style/noNonNullAssertion: TODO:
            element.classList.remove(styles.row!);
        };
    }, [element]);

    useEffect(() => {
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        element.classList[isSelected ? 'add' : 'remove'](styles.selectedRow!);
    }, [isSelected, element.classList]);

    useEffect(() => {
        if (!activeSchedule || !course) return;

        const isInSchedule = activeSchedule.containsCourse(course);

        // biome-ignore lint/style/noNonNullAssertion: TODO:
        element.classList[isInSchedule ? 'add' : 'remove'](styles.inActiveSchedule!);

        return () => {
            // biome-ignore lint/style/noNonNullAssertion: TODO:
            element.classList.remove(styles.inActiveSchedule!);
        };
    }, [activeSchedule, course, element.classList]);

    useEffect(() => {
        if (!activeSchedule || !course) {
            return;
        }

        const conflicts: Course[] = [];

        for (const c of activeSchedule.courses) {
            if (c.uniqueId !== course.uniqueId && course.getConflicts(c).length > 0) {
                conflicts.push(c);
            }
        }

        // Clear conflict styling
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        element.classList.remove(styles.isConflict!);
        // biome-ignore lint/style/noNonNullAssertion: TODO:
        element.classList.remove(styles.isConflictNoLineThrough!);

        if (highlightConflicts) {
            // biome-ignore lint/style/noNonNullAssertion: TODO:
            element.classList[conflicts.length ? 'add' : 'remove'](styles.isConflict!);
        } else {
            // biome-ignore lint/style/noNonNullAssertion: TODO:
            element.classList[conflicts.length ? 'add' : 'remove'](styles.isConflictNoLineThrough!);
        }

        setConflicts(conflicts);

        return () => {
            // biome-ignore lint/style/noNonNullAssertion: TODO:
            element.classList.remove(styles.isConflict!);
            setConflicts([]);
        };
    }, [activeSchedule, course, element.classList, highlightConflicts]);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(
        <ExtensionRoot>
            <div className='relative'>
                <button
                    type='button'
                    className='m1 h-6 w-6 flex items-center justify-center rounded bg-ut-burntorange color-white!'
                    onClick={onClick}
                >
                    <ChartBar className='text-ut-white h-4 w-4' weight='fill' />
                </button>
                {conflicts.length > 0 && (
                    <ConflictsWithWarning
                        className='invisible absolute left-13 top--3 text-white group-hover:visible'
                        conflicts={conflicts}
                    />
                )}
            </div>
        </ExtensionRoot>,
        container
    );
}
