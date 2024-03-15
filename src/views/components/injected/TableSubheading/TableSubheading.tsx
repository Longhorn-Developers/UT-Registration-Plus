import type { ScrapedRow } from '@shared/types/Course';
import { useEffect } from 'react';

import styles from './TableSubheading.module.scss';

interface Props {
    row: ScrapedRow;
}

/**
 * This component is injected into each row of the course catalog table.
 * @returns a react portal to the new td in the column or null if the column has not been created yet.
 */
export default function TableSubheading({ row }: Props): JSX.Element | null {
    const { element } = row;

    useEffect(() => {
        element.classList.add(styles.subheader!);

        return () => {
            element.classList.remove(styles.subheader!);
        };
    }, [element]);

    return null;
}
