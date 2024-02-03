import React from 'react';
import styles from './CalendarGrid.module.scss';
import CalendarCell from '../CalendarGridCell/CalendarGridCell';

const Calendar: React.FC = (props) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hoursOfDay = Array.from({ length: 14 }, (_, index) => index + 8);
  
    return (
      <div className="calendar">
        <div className="day-label-container"></div>
        {daysOfWeek.map((day, dayIndex) => (
          <div key={dayIndex} className="day">
            <div className="day-label-container">
              <div className="day-label">{day}</div>
            </div>
            {hoursOfDay.map((hour) => (
              <div key={`${day}-${hour}`} className="time-block">
                <div className="time-label-container">
                  <span>{hour}:00</span>
                </div>
                <CalendarCell />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  export default Calendar;