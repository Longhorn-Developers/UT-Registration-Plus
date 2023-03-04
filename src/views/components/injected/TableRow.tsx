import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '../common/Button/Button';

interface Props {
    row: HTMLTableRowElement;
}

export default function TableRow({ row }: Props) {
    const [portalContainer, setPortalContainer] = useState<HTMLTableCellElement | null>(null);

    useEffect(() => {
        const portalContainer = document.createElement('td');
        const lastTableCell = row.querySelector('td:last-child');
        lastTableCell!.after(portalContainer);
        setPortalContainer(portalContainer);
    }, []);

    if (!portalContainer) {
        return null;
    }

    return ReactDOM.createPortal(<Button>Plus</Button>, portalContainer);
}
