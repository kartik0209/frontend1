// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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
import { Menu } from "antd";
import { toast } from "react-toastify";
import { logout } from "../store/authSlice";
import { PERMISSIONS } from "../utils/rbac";
import logo from "../assets/logo.png";
import "../styles/Sidebar.scss";

const { SubMenu } = Menu;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, permissions } = useSelector((state) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/");
      return;
    }
    setSelectedKeys([key]);
    navigate(key);
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
  }, [location.pathname]);

  const hasPermission = (perm) => permissions?.includes(perm);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        {!collapsed && (
          <>
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <div className="sidebar-info">
              <h2 className="sidebar-title">Admin Panel</h2>
              <p className="sidebar-subtitle">Welcome {user?.name}</p>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-nav">
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          theme="dark"
          inlineCollapsed={collapsed}
        >
          {hasPermission(PERMISSIONS.DASHBOARD_VIEW) && (
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          )}

          {(hasPermission(PERMISSIONS.CAMPAIGNS_VIEW) || hasPermission(PERMISSIONS.CAMPAIGNS_CREATE)) && (
            <SubMenu key="campaign-menu" icon={<ThunderboltOutlined />} title="Campaign">
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

          {hasPermission(PERMISSIONS.PUBLISHERS_VIEW) && (
            <Menu.Item key="/publishers" icon={<UserOutlined />}>
              Publishers
            </Menu.Item>
          )}

          {hasPermission(PERMISSIONS.ADVERTISERS_VIEW) && (
            <Menu.Item key="/advertisers" icon={<TeamOutlined />}>
              Advertisers
            </Menu.Item>
          )}

          {hasPermission(PERMISSIONS.USERS_VIEW) && (
            <Menu.Item key="/users" icon={<TeamOutlined />}>
              Users
            </Menu.Item>
          )}

          {hasPermission(PERMISSIONS.REPORTS_VIEW) && (
            <SubMenu key="reports-menu" icon={<BarChartOutlined />} title="Reports">
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
        <Menu mode="inline" theme="dark" onClick={handleMenuClick}>
          <Menu.Item key="logout" icon={<LogoutOutlined />} className="logout-item">
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;
