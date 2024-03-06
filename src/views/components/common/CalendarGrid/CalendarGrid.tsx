import React from 'react';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';
import { DAY_MAP } from 'src/shared/types/CourseMeeting';

const daysOfWeek = Object.keys(DAY_MAP).filter(key => !['S', 'SU'].includes(key));
const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);
const grid = [];
for (let i = 0; i < 13; i++) {
  const row = [];
  let hour = hoursOfDay[i];
  row.push(
    <div key={hour} className="flex">
      <div className="flex flex-col items-end">
        <p className="text-left">{(hour % 12 === 0 ? 12 : hour % 12) + (hour < 12 ? ' AM' : ' PM')}</p>
      </div>
    </div>
  );
  row.push(Array.from({ length: 5 }, (_, j) => <CalendarCell key={j} />));
  grid.push(row);
}

/**
 * Grid of CalendarGridCell components forming the user's course schedule calendar view
 * @param props
 */
const Calendar: React.FC = (props) => {
  return (
    <div className="grid grid-cols-7">
      <div className="flex justify-center items-center h-13 min-w-40 min-h-13 pb-15 gap-10 flex-1">
      </div>
      {/* Displaying the rest of the calendar */}
      <div className="flex">
        {/* <div className="flex flex-col justify-between items-start flex-1">
          <div className="flex"></div>
          {hoursOfDay.map((hour) => (
            <div key={hour} className="flex">
              <div className="flex flex-col items-end">
                <p>{hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? 'AM' : 'PM'}</p>
              </div>
            </div>
          ))}
        </div> */}
        <div className="grid grid-cols-6 grid-rows-13">
          {/* Displaying day labels */}
          <div className="flex"></div>
          {daysOfWeek.map(day => (
            <div key={day} className="border border-solid border-gray-300 text-center">
              {day}
            </div>
          ))}
          {grid.map((row, rowIndex) => (row))}
        </div>
      </div>
    </div>
  )
};

export default Calendar;
