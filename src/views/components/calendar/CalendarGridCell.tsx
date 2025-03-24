import React from 'react';

interface Props {
    row: number;
    col: number;
}

/**
 * Component representing each 1 hour time block of a calendar
 *
 * @param row - The row of the cell
 * @param col - The column of the cell
 * @returns The CalendarCell component
 */
function CalendarCell({ row, col }: Props): JSX.Element {
    return (
        <div
            className='h-full w-full flex items-center border-b border-r border-gray-300'
            style={{
                gridColumn: col + 3, // start in the 3rd 1-index column
                gridRow: `${2 * row + 3} / ${2 * row + 5}`, // Span 2 rows, skip 2 header rows
            }}
        >
            <div className='h-0 w-full border-t border-gray-300/25' />
        </div>
    );
}

export default CalendarCell;
