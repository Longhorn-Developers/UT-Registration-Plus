import React from 'react';

interface Props {
    row: number;
    col: number;
}

/**
 * Component representing each 1 hour time block of a calendar
 * @param props
 */
function CalendarCell(props: Props): JSX.Element {
    return (
        <div
            className='h-full w-full flex items-center border-b border-r border-gray-300'
            style={{
                gridColumn: props.col + 3,
                gridRow: `${2 * props.row + 2} / ${2 * props.row + 4}`,
            }}
        >
            <div className='h-0 w-full border-t border-gray-300/25' />
        </div>
    );
}

export default CalendarCell;
