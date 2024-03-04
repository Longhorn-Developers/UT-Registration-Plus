import type { PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * This adds a new column to the course catalog table header.
 * @returns a react portal to the new column or null if the column has not been created yet.
 */
export default function TableHead({ children }: PropsWithChildren): JSX.Element | null {
    const [container, setContainer] = useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const container = document.createElement('th');
        container.setAttribute('scope', 'col');
        container.setAttribute('id', 'ut-registration-plus-table-head');
        const lastTableHeadCell = document.querySelector('table thead th:last-child');
        lastTableHeadCell!.after(container);
        setContainer(container);
        return () => {
            container.remove();
        };
    }, []);

    if (!container) {
        return null;
    }

    return ReactDOM.createPortal(<span>{children}</span>, container);
}
