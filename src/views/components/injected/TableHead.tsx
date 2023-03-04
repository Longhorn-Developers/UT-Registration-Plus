import React, { PropsWithChildren, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * This adds a new column to the course catalog table header.
 * @returns
 */
export default function TableHead({ children }: PropsWithChildren) {
    const [portalContainer, setPortalContainer] = useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('th');
        portalContainer.setAttribute('scope', 'col');
        portalContainer.setAttribute('id', 'ut-registration-plus-table-head');
        const lastTableHeadCell = document.querySelector('table thead th:last-child');
        lastTableHeadCell!.after(portalContainer);
        setPortalContainer(portalContainer);
    }, []);

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(<span>{children}</span>, portalContainer);
}
