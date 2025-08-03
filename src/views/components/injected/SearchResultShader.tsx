import { useEffect } from 'react';
// @TODO Get a better name for this class

/**
 * The existing search results (kws), only with alternate shading for easier readability
 *
 */
export default function ShadedResults(): null {
    console.log('TEMP');

    useEffect(() => {
        const table = document.getElementById('kw_results_table');
        if (!table) {
            console.error('Results table not found');
            return;
        }

        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.error('Table tbody not found');
            return;
        }

        const rows = tbody.querySelectorAll('tr');

        rows.forEach((row, index) => {
            if (index % 2 === 1) {
                row.style.setProperty('background-color', '#f5f5f5', 'important');
            } else {
                row.style.setProperty('background-color', 'transparent', 'important');
            }
        });

        const style = document.createElement('style');
        style.textContent = `
            #kw_results_table tbody tr:nth-child(even) {
                background-color: #f0f0f0 !important;
            }
            #kw_results_table tbody tr:nth-child(even) td {
                background-color: #f0f0f0 !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            style.remove();
        };
    }, []);

    return null;
}
