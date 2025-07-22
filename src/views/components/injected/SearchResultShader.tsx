import React, { useEffect } from 'react';
// @TODO Get a better name for this class

/**
 * The existing search results (kws), only with alternate shading for easier readability
 *
 */
export default function ShadedResults(): null {
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
    });
    return null;
}
