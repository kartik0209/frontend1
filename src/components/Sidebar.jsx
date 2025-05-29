import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

import { toast } from 'react-toastify';
import { logout } from '../store/authActions';
import { PERMISSIONS } from '../utils/rbac';
import RoleGuard from './RoleGuard';
import logo from '../assets/logo.png';
import '../styles/Sidebar.scss';

const { SubMenu } = Menu;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user, permissions } = useSelector(state => state.auth);
  
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
    dispatch(logout());
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
          <p className="sidebar-subtitle">Welcome {user?.name}</p>
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
          <RoleGuard requiredPermission={PERMISSIONS.DASHBOARD_VIEW}>
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          </RoleGuard>

          <RoleGuard requiredPermissions={[PERMISSIONS.CAMPAIGNS_VIEW, PERMISSIONS.CAMPAIGNS_CREATE]}>
            <SubMenu 
              key="campaign-menu" 
              icon={<ThunderboltOutlined />} 
              title="Campaign"
            >
              <RoleGuard requiredPermission={PERMISSIONS.CAMPAIGNS_VIEW}>
                <Menu.Item key="/campaign/manage" icon={<EditOutlined />}>
                  Manage Campaign
                </Menu.Item>
              </RoleGuard>
              
              <RoleGuard requiredPermission={PERMISSIONS.CAMPAIGNS_CREATE}>
                <Menu.Item key="/campaign/create" icon={<PlusOutlined />}>
                  Create Campaign
                </Menu.Item>
              </RoleGuard>
            </SubMenu>
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.PUBLISHERS_VIEW}>
            <Menu.Item key="/publishers" icon={<UserOutlined />}>
              Publishers
            </Menu.Item>
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.ADVERTISERS_VIEW}>
            <Menu.Item key="/advertisers" icon={<TeamOutlined />}>
              Advertisers
            </Menu.Item>
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.USERS_VIEW}>
            <Menu.Item key="/teams" icon={<TeamOutlined />}>
              Teams
            </Menu.Item>
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.USERS_VIEW}>
            <Menu.Item key="/users" icon={<TeamOutlined />}>
              Users
            </Menu.Item>
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.REPORTS_VIEW}>
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
          </RoleGuard>

          <RoleGuard requiredPermission={PERMISSIONS.SETTINGS_VIEW}>
            <Menu.Item key="/settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </RoleGuard>
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
