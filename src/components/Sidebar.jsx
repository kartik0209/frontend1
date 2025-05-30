// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "antd";
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
  EditOutlined,
} from "@ant-design/icons";

import { toast } from "react-toastify";
import { logout } from "../store/authSlice";
import { PERMISSIONS } from "../utils/rbac";
import RoleGuard from "./RoleGuard";
import logo from "../assets/logo.png";
import "../styles/Sidebar.scss";

const { SubMenu } = Menu;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, permissions } = useSelector((state) => state.auth);

  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const handleMenuClick = ({ key }) => {
    console.log('Menu clicked with key:', key); // Debug log
    if (key === "logout") {
      handleLogout();
      return;
    }
    setSelectedKeys([key]);
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Update selected keys when location changes
  React.useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  // Helper function to check permissions
  const hasPermission = (permission) => {
    return permissions?.includes(permission);
  };

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
          {/* Dashboard - Always visible for authenticated users */}
          {hasPermission(PERMISSIONS.DASHBOARD_VIEW) && (
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          )}

          {/* Campaign SubMenu */}
          {(hasPermission(PERMISSIONS.CAMPAIGNS_VIEW) || hasPermission(PERMISSIONS.CAMPAIGNS_CREATE)) && (
            <SubMenu
              key="campaign-menu"
              icon={<ThunderboltOutlined />}
              title="Campaign"
            >
              {hasPermission(PERMISSIONS.CAMPAIGNS_VIEW) && (
                <Menu.Item key="/campaign/manage" icon={<EditOutlined />}>
                  Manage Campaign
                </Menu.Item>
              )}

              {hasPermission(PERMISSIONS.CAMPAIGNS_CREATE) && (
                <Menu.Item key="/campaign/create" icon={<PlusOutlined />}>
                  Create Campaign
                </Menu.Item>
              )}
            </SubMenu>
          )}

          {/* Publishers */}
          {hasPermission(PERMISSIONS.PUBLISHERS_VIEW) && (
            <Menu.Item key="/publishers" icon={<UserOutlined />}>
              Publishers
            </Menu.Item>
          )}

          {/* Advertisers */}
          {hasPermission(PERMISSIONS.ADVERTISERS_VIEW) && (
            <Menu.Item key="/advertisers" icon={<TeamOutlined />}>
              Advertisers
            </Menu.Item>
          )}

          {/* Users - This is the problematic one */}
          {hasPermission(PERMISSIONS.USERS_VIEW) && (
            <Menu.Item key="/users" icon={<TeamOutlined />}>
              Users
            </Menu.Item>
          )}

          {/* Reports SubMenu */}
          {hasPermission(PERMISSIONS.REPORTS_VIEW) && (
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
          )}
        </Menu>
      </div>

      <div className="sidebar-footer">
        <Menu
          mode="inline"
          className="sidebar-menu logout-menu"
          theme="dark"
          onClick={handleMenuClick}
        >
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            className="logout-item"
          >
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;