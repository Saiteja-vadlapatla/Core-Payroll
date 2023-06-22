import React, { useState } from 'react';

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  GroupOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Typography } from 'antd';
import Dashboard from './Dashboard';
import Employees from './Employees';
import Attendance from './Attendance';
import Wages from './Wages';
import coreLogo from '../../../assets/core-logo.png';
import './styles/Home.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState('Dashboard');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuClick = (e) => {
    setView(e);
  };

  const renderView = (view) => {
    if (view === 'Dashboard') {
      return <Dashboard />;
    } else if (view === 'Employee Details') {
      return <Employees />;
    } else if (view === 'Attendance') {
      return <Attendance />;
    } else if (view === 'Wages') {
      return <Wages />;
    } else {
      return <Dashboard />;
    }
  };

  return (
    <Layout
      style={{
        height: '100vh',
        width: '100vw',
        position: 'absolute',
        top: '-8px',
        left: '-8px',
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
              onClick: () => {
                handleMenuClick('Dashboard');
              },
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Employee Details',
              onClick: () => {
                handleMenuClick('Employee Details');
              },
            },
            {
              key: '3',
              icon: <ClockCircleOutlined />,
              label: 'Attendance',
              onClick: () => {
                handleMenuClick('Attendance');
              },
            },
            {
              key: '4',
              icon: <GroupOutlined />,
              label: 'Wages',
              onClick: () => {
                handleMenuClick('Wages');
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="header-container">
            <div className="header-left-content">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <span style={{ marginLeft: '20px' }}>
                <Title level={3} style={{ marginTop: '12px' }}>
                  {view}
                </Title>
              </span>
            </div>
            <div className="header-right-content">
              <img className="header-logo" src={coreLogo} alt="core-logo" />
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderView(view)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
