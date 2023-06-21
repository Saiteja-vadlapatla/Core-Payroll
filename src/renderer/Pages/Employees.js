import React, { useEffect, useState } from 'react';
import { Typography, Space, Table, Tag, Button, Modal } from 'antd';
import EmployeeForm from 'renderer/Components/EmployeeForm';
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'renderer/firebase';

const { Title } = Typography;

const getData = async () => {
  const querySnapshot = await getDocs(collection(db, 'employeeInfo'));
  const temp = [];
  querySnapshot.forEach((doc) => {
    temp.push({ ...doc.data(), id: doc.id });
  });
  return temp;
};

const Employees = () => {
  const [docs, setDocs] = useState([]);
  const [addCount, setAddCount] = useState(0);
  const [addOrEdit, setAddOrEdit] = useState('add');
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    getData().then((data) => {
      setDocs(data);
    });
  }, [addCount]);

  useEffect(() => {
    getData().then((data) => {
      setDocs(data);
    });
  }, []);

  const handleAddEmployee = (status) => {
    setAddCount(addCount + 1);
    setAddOrEdit('add');
    setEmployeeId(null);
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text) => (
        <a
          onClick={(e) => {
            console.log(e.target.textContent);
            setAddOrEdit('edit');
            setEmployeeId(e.target.textContent);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'DOJ',
      dataIndex: 'doj',
      key: 'doj',
      render: (doj) => {
        if (!doj) return '';
        // doj is in ISO format. We need to convert it to dd/mm/yyyy format.
        const date = new Date(doj);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      // Datatype of status is string. It is either active or inactive.
      // If status is active, then the color of the tag is green.
      // If status is inactive, then the color of the tag is red.
      render: (status) => (
        <React.Fragment>
          {status === 'active' ? (
            <Tag color="green" key={status}>
              {status.toUpperCase()}
            </Tag>
          ) : (
            <Tag color="red" key={status}>
              {status ? status.toUpperCase() : ''}
            </Tag>
          )}
        </React.Fragment>
      ),
    },
  ];

  return (
    <div
      style={{
        maxHeight: '75vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={2}>All Employees</Title>
        <div>
          <EmployeeForm
            handleAddEmployee={handleAddEmployee}
            employees={docs}
            context={addOrEdit}
            employeeId={employeeId}
          />
        </div>
      </div>
      <div
        style={{
          // height: '80vh',
          overflow: 'auto',
        }}
      >
        <Table
          style={{ maxHeight: '80%' }}
          sticky
          columns={columns}
          dataSource={docs}
        />
      </div>
    </div>
  );
};

export default Employees;
