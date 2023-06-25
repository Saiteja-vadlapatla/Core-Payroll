import React from 'react';
import './styles/Calendar.css';
import { getMonthMatrix, monthsMap } from 'utils/dateUtils';

const Calendar = (props) => {
  const propMonth = props.month;
  const absentDays = props.absentDays || [];
  const attendance = props.attendance
    ? props.attendance[monthsMap[propMonth]] || {}
    : {};
  console.log('CALENDAR: ', attendance, monthsMap[propMonth], props.attendance);
  // Show the current month with each day occupying a cell and
  // Tuesdays as weekend aligned to the right side
  const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
  const daysMap = {
    Wed: 0,
    Thu: 1,
    Fri: 2,
    Sat: 3,
    Sun: 4,
    Mon: 5,
    Tue: 6,
  };
  const today = new Date();
  const currentMonth = propMonth;
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const firstDayIndex = firstDay.getDay();
  const lastDayIndex = lastDay.getDay();
  const nextDays = 7 - lastDayIndex - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = firstDayIndex - 1;
  const month = [
    // ...Array(prevDays).fill(0),
    ...Array(daysInMonth)
      .fill(0)
      .map((_, i) => i + 1),
    // ...Array(nextDays).fill(0),
  ];

  const renderMonth = () => {
    const monthMatrix = getMonthMatrix(currentMonth, currentYear);
    // Month matrix has 6 or fewer rows and 7 columns
    // Each row is a week and each column is a day
    // Each cell is a day number
    // If the cell is 0, treat it is inactive and add inactive classname
    // If the cell is not 0, treat it as active and add active classname
    // If the cell is today, add today classname
    // If the cell is last cell in the row, add tuesday classname

    const monthElements = monthMatrix.map((week, i) => {
      return (
        <tr className="calendar__week" key={i}>
          {week.map((day, j) => {
            if (day === 0 || attendance[day] === '') {
              return (
                <td
                  key={j}
                  className="calendar__day calendar__day__inactive"
                ></td>
              );
            } else if (attendance[day] === 'A') {
              return (
                <td key={j} className="calendar__day calendar__day__absent">
                  {day}
                </td>
              );
            } else if (attendance[day] === 'P') {
              return (
                <td key={j} className="calendar__day calendar__day__paidleave">
                  {day}
                </td>
              );
            } else if (attendance[day] === 'H') {
              return (
                <td key={j} className="calendar__day calendar__day__halfday">
                  {day}
                </td>
              );
            } else if (j === 6) {
              return (
                <td key={j} className="calendar__day calendar__day__tuesday">
                  {day}
                </td>
              );
            } else {
              return (
                <td key={j} className="calendar__day calendar__day__active">
                  {day}
                </td>
              );
            }
          })}
        </tr>
      );
    });

    return monthElements;
  };

  return (
    <div className="calendar">
      <div className="calendar__month"></div>
      <div className="calendar__header">
        <div className="calendar__weekdays">
          {days.map((day) => (
            <div key={day} className="calendar__weekday">
              {day}
            </div>
          ))}
        </div>
      </div>
      <table className="calendar__days">
        <tbody className="calendar__days">{renderMonth()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
