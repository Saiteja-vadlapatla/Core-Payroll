import { Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import Calendar from 'renderer/Components/Calendar';
import './styles/Attendance.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { months } from '../../utils/dateUtils';
import { employeeLeaveSchema } from '../../utils/schemas';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from 'renderer/firebase';

const Attendance = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  console.log('currentMonth', currentMonth);
  console.log('currentYear', currentYear);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState([]);

  useEffect(() => {
    // Get the employeeLeaves data on first render
    // const getLeavesData = async () => {
    //   const querySnapshot = await getDocs(collection(db, 'employeeLeaves'));
    //   const temp = [];
    //   querySnapshot.forEach((doc) => {
    //     temp.push({ ...doc.data(), id: doc.id });
    //   });
    //   return temp;
    // };

    const getAllData = async () => {
      const querySnapshot1 = await getDocs(collection(db, 'employeeLeaves'));
      const leaveData = [];
      querySnapshot1.forEach((doc) => {
        leaveData.push({ ...doc.data(), id: doc.id });
      });

      const querySnapshot2 = await getDocs(collection(db, 'attendanceData'));
      const attendanceData = [];
      querySnapshot2.forEach((doc) => {
        attendanceData.push({ ...doc.data(), id: doc.id });
      });

      return { leaveData, attendanceData };
    };

    // getLeavesData().then((data) => {
    //   console.log('data', data);
    //   setEmployeeLeaves(data);
    // });

    // getAttendanceData().then((data) => {
    //   console.log('data', data);
    //   setEmployeeAttendance(data);
    // });
    getAllData().then((data) => {
      console.log('data', data);
      setEmployeeLeaves(data.leaveData);
      setEmployeeAttendance(data.attendanceData);
    });
  }, []);

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

  const handleSelectEmployee = (employeeId) => {
    // set currentEmployee to the value of employeeId matching object from employeeLeaves
    const employee = {};
    employee.leaves = employeeLeaves.find(
      (employee) => employee.employeeId === employeeId
    );
    console.log('employee', employee);

    const attendance = employeeAttendance.find(
      (employee) => employee.employeeId === employeeId
    );
    console.log('employeeAttendance', attendance);
    employee.attendance = attendance;
    employee.employeeId = employeeId;
    employee.employeeName = employee.leaves.employeeName;
    console.log(employee);
    setCurrentEmployee(employee);
  };

  const handleSyncLeaves = () => {
    // Get the list of all employees from firebase.
    // For each employee, get the doj from firebase.
    // For each employee, create an object matching the employeeLeaveSchema.
    // If the employee has doj available, fill the availableTotalLeaves value based on two conditions:
    // If the employee doj is more than on year, then availableTotalLeaves = 12
    // If the employee doj is less than one year, then availableTotalLeaves = (currentMonth - dojMonth)
    // If the employee has doj not available, then availableTotalLeaves = 0
    // Implement now.

    const getEmployees = async () => {
      const employeesRef = collection(db, 'employeeInfo');
      const employeesSnapshot = await getDocs(employeesRef);
      const employeesList = employeesSnapshot.docs.map((doc) => doc.data());
      console.log('employeesList', employeesList);
      return employeesList;
    };

    getEmployees().then((employees) => {
      console.log('employees fetched');
      console.log(employees);
      employees.forEach((employee) => {
        const employeeLeave = JSON.parse(JSON.stringify(employeeLeaveSchema));
        employeeLeave.employeeId = employee.employeeId;
        employeeLeave.employeeName = employee.employeeName;
        employeeLeave.doj = employee.doj;
        if (employee.status === 'inactive') {
          return;
        }
        if (employee.doj) {
          const dojMonth = new Date(employee.doj).getMonth();
          const dojYear = new Date(employee.doj).getFullYear();
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();
          const monthsWorked =
            (currentYear - dojYear) * 12 + (currentMonth - dojMonth);
          if (monthsWorked >= 12) {
            employeeLeave.availableTotalLeaves = 12;
          } else {
            employeeLeave.availableTotalLeaves = monthsWorked;
          }
        } else {
          employeeLeave.availableTotalLeaves = 0;
        }
        console.log('employeeLeave', employeeLeave);
        //Save employeeLeave to firebase in a new collection called employeeLeaves.

        addDoc(collection(db, 'employeeLeaves'), {
          ...JSON.parse(JSON.stringify(employeeLeave)),
        })
          .then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      });
    });
  };

  return (
    <div className="attendance-container">
      <div className="employee__leave__info">
        <Select
          showSearch
          style={{ width: 300, marginBottom: 20 }}
          placeholder="Select an employee"
          optionFilterProp="children"
          onChange={handleSelectEmployee}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {employeeLeaves.map((employeeLeave) => (
            <Select.Option
              key={employeeLeave.employeeId}
              value={employeeLeave.employeeId}
            >
              {employeeLeave.employeeName}
            </Select.Option>
          ))}
        </Select>
        {currentEmployee && (
          <div className="employee-container">
            <div className="employee-name-group">
              <span>
                <strong>Employee Name:</strong> {currentEmployee.employeeName}
              </span>
              <span>
                <strong>Employee ID:</strong> {currentEmployee.employeeId}
              </span>
            </div>
            <div className="employee-leave-group">
              <span>
                <strong>DOJ:</strong>{' '}
                {new Date(currentEmployee.leaves.doj).toDateString()}
              </span>
              <span>
                <strong>Total Eligible Leaves:</strong>{' '}
                {currentEmployee.leaves.availableTotalLeaves}
              </span>
              <span>
                <strong>Leaves Taken:</strong>{' '}
                {currentEmployee.leaves.totalLeavesTaken}
              </span>
              <span>
                <strong>Available Leaves:</strong>{' '}
                {currentEmployee.leaves.availableTotalLeaves -
                  currentEmployee.leaves.totalLeavesTaken}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="month-selector">
        <Button
          type="primary"
          shape="round"
          icon={<LeftOutlined />}
          disabled={currentMonth === 0}
          onClick={() => {
            handleMonthChange('prev');
          }}
        />
        <h1 style={{ marginInline: '20px' }}>{months[currentMonth]}</h1>
        <Button
          type="primary"
          shape="round"
          icon={<RightOutlined />}
          disabled={currentMonth === 11}
          onClick={() => {
            handleMonthChange('next');
          }}
        />
      </div>
      <Calendar
        month={currentMonth}
        absentDays={[5, 7, 8]}
        attendance={currentEmployee?.attendance[currentYear]}
      />
    </div>
  );
};

export default Attendance;
