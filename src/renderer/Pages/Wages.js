import { Button, Input, Modal, Select, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import './styles/Wages.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'renderer/firebase';

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

    getActiveEmployeeList().then((data) => {
      console.log('data', data);
      setActiveEmployeeList(data);
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

  const handleWagePassword = () => {
    console.log(password);
    if (password === 'Core@wagehistory23') {
      setShowWageViewPermission(true);
    } else if (password === 'Core@wagemaster23') {
      setShowWageViewPermission(true);
      setShowWageEditPermission(true);
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
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
    },
    {
      title: 'Salary Type',
      dataIndex: 'salaryType',
      key: 'salaryType',
    },
    {
      title: 'Gross Wage',
      dataIndex: 'grossWage',
      key: 'grossWage',
    },
    {
      hra: 'HRA',
      dataIndex: 'hra',
      key: 'hra',
    },
    // {
    //   title: 'Status',
    //   key: 'status',
    //   dataIndex: 'status',
    //   // Datatype of status is string. It is either active or inactive.
    //   // If status is active, then the color of the tag is green.
    //   // If status is inactive, then the color of the tag is red.
    //   render: (status) => (
    //     <React.Fragment>
    //       {status === 'active' ? (
    //         <Tag color="green" key={status}>
    //           {status.toUpperCase()}
    //         </Tag>
    //       ) : (
    //         <Tag color="red" key={status}>
    //           {status ? status.toUpperCase() : ''}
    //         </Tag>
    //       )}
    //     </React.Fragment>
    //   ),
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
        <Select
          disabled={!showWageViewPermission}
          showSearch
          style={{ width: 300, marginBottom: 20 }}
          placeholder="Select month"
          optionFilterProp="children"
          onChange={() => {}}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Select.Option value="january">January</Select.Option>
          <Select.Option value="february">February</Select.Option>
        </Select>
        <Table sticky columns={columns} dataSource={wageInfo} />
      </div>
      <Button type="primary" disabled={!showWageEditPermission}>
        Edit Employee Wage
      </Button>
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
    </div>
  );
};

export default Wages;
