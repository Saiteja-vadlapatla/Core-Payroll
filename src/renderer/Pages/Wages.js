import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Table,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';
import './styles/Wages.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'renderer/firebase';
import { monthsMap } from 'utils/dateUtils';
import { payrollColumns } from 'utils/columns';

const { Text, Title, Link } = Typography;

const Wages = () => {
  const [showWageEditPermission, setShowWageEditPermission] =
    React.useState(false);
  const [showWageViewPermission, setShowWageViewPermission] =
    React.useState(false);
  const [password, setPassword] = React.useState('');
  const [showWageEdit, setShowWageEdit] = React.useState(false);
  const [activeEmployeeList, setActiveEmployeeList] = React.useState(null);
  const [wageHistory, setWageHistory] = React.useState([]);
  const [wageInfo, setWageInfo] = React.useState(null);
  const [currentEmployee, setCurrentEmployee] = React.useState(null);
  const [currentMonth, setCurrentMonth] = React.useState(null);
  const [currentYear, setCurrentYear] = React.useState(null);
  const [shouldRunPayroll, setShouldRunPayroll] = React.useState(false);
  const [attendanceCollectedMonths, setAttendanceCollectedMonths] =
    React.useState({});
  const [payrollCollectedMonths, setPayrollCollectedMonths] = React.useState(
    {}
  );
  const [showPayrollRun, setShowPayrollRun] = React.useState(false);
  const [payrollRunningEmployees, setPayrollRunningEmployees] = React.useState(
    []
  );
  const [attendanceData, setAttendanceData] = React.useState([]);
  const [otData, setOtData] = React.useState([]);
  const [advancesData, setAdvancesData] = React.useState([]);

  useEffect(() => {
    // Get Active Employee List
    const getActiveEmployeeList = async () => {
      const querySnapshot = await getDocs(collection(db, 'employeeInfo'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().status === 'active') {
          temp.push({ ...doc.data(), id: doc.id });
        }
      });
      // Sort temp by employeeId
      temp.sort((a, b) => {
        const aId = a.employeeId.split('-')[1];
        const bId = b.employeeId.split('-')[1];
        return aId - bId;
      });
      return temp;
    };

    const getDataAboutData = async () => {
      const querySnapshot = await getDocs(collection(db, 'dataAboutData'));
      querySnapshot.forEach((doc) => {
        console.log('doc.data()', doc.data());
        if (doc.data()?.attendanceCollected) {
          setAttendanceCollectedMonths({ ...doc.data().attendanceCollected });
        } else if (doc.data()?.payrollsRun) {
          setPayrollCollectedMonths({ ...doc.data().payrollsRun });
        }
      });
    };

    const getAttendanceData = async () => {
      const querySnapshot = await getDocs(collection(db, 'attendanceData'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      return temp;
    };

    const getOTData = async () => {
      const querySnapshot = await getDocs(collection(db, 'otData'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      return temp;
    };

    const getAdvancesData = async () => {
      const querySnapshot = await getDocs(collection(db, 'advancesData'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      return temp;
    };

    getActiveEmployeeList().then((data) => {
      console.log('active employee data', data);
      setActiveEmployeeList(data);
    });

    getDataAboutData();

    getAttendanceData().then((data) => {
      console.log('attendance data', data);
      setAttendanceData(data);
    });

    getOTData().then((data) => {
      console.log('ot data', data);
      setOtData(data);
    });

    getAdvancesData().then((data) => {
      console.log('advances data', data);
      setAdvancesData(data);
    });
  }, []);

  useEffect(() => {
    // Get Wage History data when showWageViewPermission is true
    const getWageHistoryData = async () => {
      const querySnapshot = await getDocs(collection(db, 'wageHistory'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      return temp;
    };

    if (showWageViewPermission) {
      getWageHistoryData().then((data) => {
        console.log('data', data);
        setWageHistory(data);
      });
    }
  }, [showWageViewPermission]);

  useEffect(() => {
    // Get Wage Info data when showWageEditPermission is true
    const getWageInfoData = async () => {
      const querySnapshot = await getDocs(collection(db, 'wageInfo'));
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      return temp;
    };

    if (showWageEditPermission) {
      getWageInfoData().then((data) => {
        console.log('data', data);
        setWageInfo(data);
      });
    }
  }, [showWageEditPermission]);

  useEffect(() => {
    // If payroll is run, then get the list of employees who are active and
    // map with the wageInfo data
    if (shouldRunPayroll) {
      const temp = [];
      // push if employee in wageInfo is present in activeEmployeeList
      activeEmployeeList.forEach((employee) => {
        wageInfo.forEach((wage) => {
          if (employee.employeeId === wage.employeeId) {
            temp.push(wage);
          }
        });
      });
      // Sort temp by employeeId
      temp.sort((a, b) => {
        const aId = a.employeeId.split('-')[1];
        const bId = b.employeeId.split('-')[1];
        return aId - bId;
      });
      // Iterate over each employee and add more data for payroll
      temp.forEach((employee) => {
        const employeeAttendanceInfo = attendanceData.find(
          (data) => data.employeeId === employee.employeeId
        );
        // If employeeAttendanceInfo is not found, then set all values to 0
        employee.noOfDaysWorked = 0;
        if (employeeAttendanceInfo[currentYear]) {
          // If employeeAttendanceInfo has noOfPayableDays, then set it
          // Else, calculate noOfPayableDays where P = full day, H = half day, P = paid leave. Rest are all non-payable
          if (
            employeeAttendanceInfo[currentYear][currentMonth]?.noOfPayableDays
          ) {
            employee.noOfDaysWorked =
              employeeAttendanceInfo[currentYear][currentMonth].noOfPayableDays;
          } else {
            // Count P, H, P from currentMonth object {1: 'P', 2: 'H', 3: 'P', etc}
            const attendance =
              employeeAttendanceInfo[currentYear][currentMonth];
            Object.keys(attendance).forEach((key) => {
              if (attendance[key] === 'F' || attendance[key] === 'P') {
                employee.noOfDaysWorked += 1;
              } else if (attendance[key] === 'H') {
                employee.noOfDaysWorked += 0.5;
              }
            });
          }
        }
        // Get OT hours from OT data
        const employeeOTInfo = otData.find(
          (data) => data.employeeId === employee.employeeId
        );

        const advancesInfo = advancesData.find(
          (data) => data.employeeId === employee.employeeId
        );

        console.log('advancesInfo', advancesInfo);

        employee.otHours = 0;
        if (employeeOTInfo[currentYear]) {
          // OT hour is marked per day. So, add all OT hours in currentMonth
          const ot = employeeOTInfo[currentYear][currentMonth];
          if (ot) {
            Object.keys(ot).forEach((key) => {
              employee.otHours += ot[key];
            });
          }
        }

        employee.allowances = 0;
        // OT amount is gross wage / no. of days in month / 8
        // Calculate no. of days in currentMonth without using any library
        const daysInMonth = new Date(
          currentYear,
          monthsMap[currentMonth] + 1,
          0
        ).getDate();
        employee.otAmount =
          Math.round(
            (employee.grossWage / daysInMonth / 8) * employee.otHours
          ) || 0;
        // add incentive if attendance is 100%. Attendance is 100% if noOfDaysWorked = daysInMonth

        if (employee.noOfDaysWorked === daysInMonth) {
          employee.incentives = 200;
        } else {
          employee.incentives = 0;
        }
        employee.earnedWage =
          employee.salaryType === 'hourly'
            ? Math.round(
                employee.grossWage * (employee.noOfDaysWorked / daysInMonth)
              )
            : employee.grossWage;
        // net wage is gross wage + incentive + otAmount + allowances
        employee.netWage = Math.round(
          employee.earnedWage +
            employee.incentives +
            employee.otAmount +
            employee.allowances
        );

        // wageForPF = if grossWage > 15000, then 15000 else grossWage
        employee.wageForPF =
          employee.earnedWage > 15000 ? 15000 : employee.earnedWage;
        // wageForESI = if grossWage > 21000, then 21000 else grossWage
        employee.wageForESI =
          employee.netWage > 21000 ? 21000 : employee.netWage;
        // professionalTax = 200
        employee.pfDeducted = Math.round(employee.wageForPF * 0.12);
        employee.esiDeducted =
          employee.wageForESI < 21000
            ? Math.round(employee.wageForESI * 0.0075)
            : 0;
        employee.professionalTax =
          employee.netWage < 15000 ? 0 : employee.netWage < 20000 ? 150 : 200;
        employee.tds = 0;
        employee.advanceCarryForward = advancesInfo?.totalAdvanceBalance || 0;
        employee.advanceAddition = 0;
        // Advance addition = sum of advances added in currentMonth - advancesInfo[currentYear][currentMonth].installments array
        const installments =
          advancesInfo?.[currentYear]?.[currentMonth]?.installments;
        if (installments?.length) {
          employee.advanceAddition = installments.reduce(
            (acc, curr) => acc + curr,
            0
          );
        }
        employee.advanceDeducted =
          advancesInfo?.[currentYear]?.[currentMonth]?.advanceDeducted || 0;
        employee.advanceBalance =
          employee.advanceCarryForward +
          employee.advanceAddition -
          employee.advanceDeducted;
        employee.totalDeductions =
          employee.advanceDeducted +
          employee.professionalTax +
          employee.tds +
          employee.pfDeducted +
          employee.esiDeducted;
        employee.netPayable = employee.netWage - employee.totalDeductions;
      });
      setPayrollRunningEmployees(temp);
    }
  }, [shouldRunPayroll]);

  const handleWagePassword = () => {
    console.log(password);
    if (password === 'Core@wagehistory23') {
      setShowWageViewPermission(true);
    } else if (password === 'Core@wagemaster23') {
      setShowWageViewPermission(true);
      setShowWageEditPermission(true);
    }
  };

  const handleMonthChange = (e) => {
    console.log(e);
    const month = monthsMap[e.month()];
    const year = e.year();
    setCurrentMonth(month);
    setCurrentYear(year);

    // Check if payroll has been run for this month
    if (payrollCollectedMonths[year]?.includes(month)) {
      setShouldRunPayroll(false);
    } else {
      setShouldRunPayroll(true);
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      fixed: 'left',
      render: (text) => (
        <Link
          disabled={!showWageViewPermission}
          onClick={(e) => {
            console.log(e.target.textContent);
            setShowWageEdit('edit');
            setCurrentEmployee(e.target.textContent);
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      fixed: 'left',
    },
    {
      title: 'Salary Type',
      dataIndex: 'salaryType',
      key: 'salaryType',
      // Print salaryType as string with first letter capital
      render: (text) => (
        <span>
          {text
            ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
            : ''}
        </span>
      ),
    },
    {
      title: 'Gross Wage',
      dataIndex: 'grossWage',
      key: 'grossWage',
    },
    // {
    //   hra: 'HRA',
    //   dataIndex: 'hra',
    //   key: 'hra',
    // },
  ];

  return (
    <div>
      {showWageViewPermission ? null : (
        <div className="wage-password-container">
          <Title level={5}>Enter Password</Title>
          <div className="wage-password-input-container">
            <Input
              type="password"
              placeholder="Speak friend and enter"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onPressEnter={handleWagePassword}
              style={{ width: '300px', marginRight: '10px' }}
            />
            <Button type="primary" onClick={handleWagePassword}>
              Submit
            </Button>
          </div>
        </div>
      )}
      <div>
        <Title disabled={!showWageViewPermission} level={5}>
          Wage History
        </Title>
        <div className="month-selector-container">
          <DatePicker
            picker="month"
            disabled={!showWageViewPermission}
            onSelect={handleMonthChange}
          />
          <Button
            type="primary"
            onClick={() => {
              setShowPayrollRun(true);
            }}
            disabled={!showWageViewPermission || !shouldRunPayroll}
          >
            Run Payroll
          </Button>
        </div>

        <Table sticky columns={columns} dataSource={wageInfo} />
      </div>
      <Modal
        title="Edit Employee Wage"
        open={showWageEdit}
        onOk={() => setShowWageEdit(false)}
        onCancel={() => setShowWageEdit(false)}
        footer={[
          <Button key="back" onClick={() => setShowWageEdit(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setShowWageEdit(false)}
          >
            Submit
          </Button>,
        ]}
      >
        <p>Some contents...</p>
      </Modal>
      <Modal
        title={`Payroll for ${currentMonth} ${currentYear}`}
        open={showPayrollRun}
        onOk={() => setShowPayrollRun(false)}
        onCancel={() => setShowPayrollRun(false)}
        width={'100%'}
        footer={[
          <Button key="back" onClick={() => setShowPayrollRun(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => setShowPayrollRun(false)}
          >
            Submit
          </Button>,
        ]}
      >
        <Table
          sticky
          columns={[...columns, ...payrollColumns]}
          dataSource={payrollRunningEmployees}
          scroll={{ x: 'max-content' }}
        />
      </Modal>
    </div>
  );
};

export default Wages;
