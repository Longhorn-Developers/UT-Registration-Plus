import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function getCourseSections() {
    const table = document.querySelector('table');
    if (!table) return [];

    const rows = Array.from(table.querySelectorAll('tr'));
    const sections: { header: HTMLTableRowElement; children: HTMLTableRowElement[] }[] = [];
    let currentSection: { header: HTMLTableRowElement; children: HTMLTableRowElement[] } | null = null;

    for (const row of rows) {
        const headerCell = row.querySelector('td.course_header');
        if (headerCell) {
            if (currentSection) sections.push(currentSection);
            currentSection = { header: row, children: [] };
        } else if (currentSection) {
            currentSection.children.push(row);
        }
    }
    if (currentSection) sections.push(currentSection);
    return sections;
}

const CollapsibleSection: React.FC<{
    header: HTMLTableRowElement;
    childrenRows: HTMLTableRowElement[];
}> = ({ header, childrenRows }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Hide children rows initially
        childrenRows.forEach(row => (row.style.display = open ? '' : 'none'));
        // Clean up on unmount
        return () => {
            childrenRows.forEach(row => (row.style.display = ''));
        };
    }, [open, childrenRows]);

    // Inject a button into the header cell
    useEffect(() => {
        const cell = header.querySelector('td.course_header');
        if (!cell) return;
        let button = cell.querySelector('.utrp-collapse-btn') as HTMLButtonElement | null;
        if (!button) {
            button = document.createElement('button');
            button.className = 'utrp-collapse-btn';
            button.style.marginRight = '8px';
            cell.prepend(button);
        }
        button.textContent = open ? '▼' : '►';
        button.onclick = () => setOpen(o => !o);
        // Clean up
        return () => {
            button?.remove();
        };
    }, [header, open]);

    return null;
};

export default
