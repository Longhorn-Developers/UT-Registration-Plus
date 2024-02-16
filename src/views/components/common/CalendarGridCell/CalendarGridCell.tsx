import React from 'react';

/**
 * Component representing each 1 hour time block of a calendar
 * @param props 
 */
const CalendarCell: React.FC = (props) => {
  return (
    <div className="flex w-56 h-12 min-w-12 min-h-10 flex-col justify-center items-start border border-gray-300">
      <div className="w-full h-1 border-none rounded-none bg-gray-300 bg-opacity-25"></div>
    </div>
  );
};

export default CalendarCell;
