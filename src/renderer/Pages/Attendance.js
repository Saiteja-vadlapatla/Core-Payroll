import React from 'react';
import './Attendance.css';

const Attendance = () => {
  /* Show the current month with each day occupying a cell and
    Tuesdays as weekend aligned to the right side */
  const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const firstDayIndex = firstDay.getDay();
  const lastDayIndex = lastDay.getDay();
  const nextDays = 7 - lastDayIndex - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = firstDayIndex - 1;
  const month = [
    ...Array(prevDays).fill(0),
    ...Array(daysInMonth)
      .fill(0)
      .map((_, i) => i + 1),
    ...Array(nextDays).fill(0),
  ];

  return (
    <div className="calendar">
      <div className="calendar__header">
        <div className="calendar__month">
          <i className="fas fa-angle-left"></i>
          <h1>August</h1>
          <i className="fas fa-angle-right"></i>
        </div>
        <div className="calendar__weekdays">
          {days.map((day) => (
            <div key={day} className="calendar__weekday">
              {day}
            </div>
          ))}
        </div>
        <table className="calendar__days">
          <tbody>
            {month.map((day, i) => {
              if (i % 7 === 0) {
                return (
                  <tr key={i}>
                    <td>{day}</td>
                  </tr>
                );
              } else {
                return (
                  <tr key={i}>
                    <td>{day}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
