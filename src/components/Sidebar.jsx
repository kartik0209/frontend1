// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../assets/logo.png';
import '../styles/Sidebar.scss';

const { SubMenu } = Menu;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
      return;
    }
    setSelectedKeys([key]);
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  // Update selected keys when location changes
  React.useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        <div className="sidebar-info">
          <h2 className="sidebar-title">Admin Panel</h2>
          {user && (
            <p className="user-info">Welcome, {user.name || user.email}</p>
          )}
        </div>
      </div>

      <div className="sidebar-nav">
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          className="sidebar-menu"
          theme="dark"
        >
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>

          <SubMenu 
            key="campaign-menu" 
            icon={<ThunderboltOutlined />} 
            title="Campaign"
          >
            <Menu.Item key="/campaign/manage" icon={<EditOutlined />}>
              Manage Campaign
            </Menu.Item>
            <Menu.Item key="/campaign/create" icon={<PlusOutlined />}>
              Create Campaign
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="/publishers" icon={<UserOutlined />}>
            Publishers
          </Menu.Item>

          <Menu.Item key="/advertisers" icon={<TeamOutlined />}>
            Advertisers
          </Menu.Item>

          <Menu.Item key="/teams" icon={<TeamOutlined />}>
            Teams
          </Menu.Item>
           <Menu.Item key="/users" icon={<TeamOutlined />}>
            Users
          </Menu.Item>

          <SubMenu 
            key="reports-menu" 
            icon={<BarChartOutlined />} 
            title="Reports"
          >
            <Menu.Item key="/reports/conversion" icon={<FileTextOutlined />}>
              Conversion Report
            </Menu.Item>
            <Menu.Item key="/reports/campaign" icon={<FileTextOutlined />}>
              Campaign Report
            </Menu.Item>
          </SubMenu>

         
        </Menu>
      </div>

      <div className="sidebar-footer">
        <Menu
          mode="inline"
          className="sidebar-menu logout-menu"
          theme="dark"
          onClick={handleMenuClick}
        >
          <Menu.Item key="logout" icon={<LogoutOutlined />} className="logout-item">
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;