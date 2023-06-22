import { Button } from 'antd';
import React, { useState } from 'react';
import Calendar from 'renderer/Components/Calendar';
import './styles/Attendance.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { months } from '../../utils/dateUtils';
const Attendance = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const handleMonthChange = (e) => {
    let newCurrentMonth = currentMonth;
    if (e === 'prev') {
      newCurrentMonth = currentMonth - 1;
    } else if (e === 'next') {
      newCurrentMonth = currentMonth + 1;
    }

    if (newCurrentMonth < 0) {
      newCurrentMonth = 0;
    }
    if (newCurrentMonth > 11) {
      newCurrentMonth = 11;
    }
    setCurrentMonth(newCurrentMonth);
  };

  return (
    <div className='attendance-container'>
     <div className='month-selector'>
        <Button type='primary' shape='round' icon={<LeftOutlined />} disabled={currentMonth===0} onClick={() => {
          handleMonthChange('prev');
        }}/>
        <h1 style={{marginInline: "20px"}}>{months[currentMonth]}</h1>
        <Button type='primary' shape='round' icon={<RightOutlined />} disabled={currentMonth===11} onClick={() => {
          handleMonthChange('next');
        }}/>
     </div>
      <Calendar month={currentMonth} absentDays={[5,7,8]}/>
    </div>
  );
};

export default Attendance;
