import React, { useEffect } from 'react';
import { Modal, Button, Form, Select, DatePicker, message } from 'antd';
import Input from 'antd/es/input/Input';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'renderer/firebase';
import dayjs from 'dayjs';

const { Option } = Select;

const layout = {
  // labelCol: { span: 8 },
  // wrapperCol: { span: 16 },
};

const EmployeeForm = (props) => {
  const { handleAddEmployee, employees, context, employeeId } = props;
  const [visible, setVisible] = React.useState(false);
  const [addCount, setAddCount] = React.useState(0);
  const [f] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const employeeInfo =
    context === 'edit' && employeeId
      ? employees.find((doc) => doc.employeeId === employeeId)
      : null;

  console.log('employeeInfo', employeeInfo, employeeId);

  useEffect(() => {
    console.log('useEffect called', context, employeeId);
    if (context === 'edit') {
      setVisible(true);
    }
  }, [context, employeeId]);

  useEffect(() => {
    handleAddEmployee(true);
  }, [addCount]);

  const showMessage = (type, message) => {
    messageApi.open({
      type,
      content: message,
    });
  };

  return (
    <div>
      {contextHolder}
      <Button type="primary" onClick={() => setVisible(true)}>
        Add Employee
      </Button>
      <Modal
        title={`${context === 'add' ? 'Add' : 'Edit'} Employee`}
        open={visible}
        onOk={() => {
          f.validateFields()
            .then(async (values) => {
              values.doj = values.doj ? values.doj.toISOString() : '';
              values.status = values.status ? values.status : 'active';
              console.log(values, employees);

              if (context === 'add') {
                if (
                  employees.find((doc) => doc.employeeId === values.employeeId)
                ) {
                  console.log('Employee ID already exists');
                  showMessage('error', 'Employee ID already exists');
                  return;
                }
                try {
                  const docRef = await addDoc(collection(db, 'employeeInfo'), {
                    ...JSON.parse(JSON.stringify(values)),
                  });
                  console.log('Document written with ID: ', docRef.id);
                  showMessage('success', 'Employee added successfully');
                  setAddCount(addCount + 1);
                  handleAddEmployee(true);
                  setVisible(false);
                  f.resetFields();
                } catch (e) {
                  console.error('Error adding document: ', e);
                  showMessage('error', 'Error adding document');
                }
              } else {
                // Edit the document with matching employeeId
                const querySnapshot = await getDocs(
                  query(
                    collection(db, 'employeeInfo'),
                    where('employeeId', '==', values.employeeId)
                  )
                );
                console.log('querySnapshot', querySnapshot);
                querySnapshot.forEach(async (doc) => {
                  console.log(doc.id, ' => ', doc.data());
                  if (doc.data().employeeId === values.employeeId) {
                    try {
                      await updateDoc(doc.ref, {
                        ...JSON.parse(JSON.stringify(values)),
                      });
                      // await doc.ref.update({
                      //   ...JSON.parse(JSON.stringify(values)),
                      // });
                      console.log('Document updated successfully');
                      showMessage('success', 'Employee updated successfully');
                      setAddCount(addCount + 1);
                      handleAddEmployee(true);
                      setVisible(false);
                      f.resetFields();
                    } catch (e) {
                      console.error('Error updating document: ', e);
                      showMessage('error', 'Error updating document');
                    }
                  }
                });
              }
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
              f.resetFields();
            });
        }}
        onCancel={() => {
          setVisible(false);
          handleAddEmployee(false);
          f.resetFields();
        }}
      >
        <Form
          {...layout}
          name="basic"
          form={f}
          initialValues={{
            ...employeeInfo,
            doj: employeeInfo?.doj ? dayjs(employeeInfo.doj) : '',
          }}
        >
          <Form.Item
            label="Employee ID"
            name="employeeId"
            rules={[
              {
                required: true,
                message: 'Please input employee ID!',
              },
            ]}
          >
            <Input disabled={context === 'edit'} />
          </Form.Item>

          <Form.Item
            label="Employee Name"
            name="employeeName"
            rules={[
              {
                required: true,
                message: 'Please input employee name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            rules={[
              {
                required: true,
                message: 'Please input designation!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: 'Please input department!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DOJ"
            name="doj"
            rules={[
              {
                required: false,
                message: 'Please input DOJ!',
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: false,
                message: 'Please input status!',
              },
            ]}
          >
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="UAN"
            name="uan"
            rules={[
              {
                required: false,
                message: 'Please input UAN!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="PAN"
            name="pan"
            rules={[
              {
                required: false,
                message: 'Please input PAN!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Aadhar"
            name="aadhar"
            rules={[
              {
                required: false,
                message: 'Please input Aadhar!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[
              {
                required: false,
                message: 'Please input Bank Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bank Account Number"
            name="bankAccountNumber"
            rules={[
              {
                required: false,
                message: 'Please input Bank Account Number!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bank IFSC"
            name="bankIFSC"
            rules={[
              {
                required: false,
                message: 'Please input Bank IFSC!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mail ID"
            name="mailId"
            rules={[
              {
                required: false,
                message: 'Please input Mail ID!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mobile Number"
            name="mobileNumber"
            rules={[
              {
                required: false,
                message: 'Please input Mobile Number!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: false,
                message: 'Please input Address!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeeForm;
