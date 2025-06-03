import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
  PlusOutlined,
  EditOutlined,
  LogoutOutlined,
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

  // Track which menu item is selected & which SubMenus are open
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
  const [openKeys, setOpenKeys] = useState([]);

  // Update selectedKeys & openKeys whenever URL changes
  useEffect(() => {
    const path = location.pathname;
    setSelectedKeys([path]);

    // Decide which SubMenu to open based on prefix
    if (path.startsWith("/campaign")) {
      setOpenKeys(["campaign-menu"]);
    } else if (path.startsWith("/company")) {
      setOpenKeys(["company-menu"]);
    } else if (path.startsWith("/reports")) {
      setOpenKeys(["reports-menu"]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  // Invoked when user expands/collapses a SubMenu manually
  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
          theme="dark"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
        >
          {hasPermission(PERMISSIONS.DASHBOARD_VIEW) && (
            <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          )}

          {(hasPermission(PERMISSIONS.CAMPAIGNS_VIEW) ||
            hasPermission(PERMISSIONS.CAMPAIGNS_CREATE)) && (
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

          {hasPermission(PERMISSIONS.COMPANY_VIEW) && (
            <SubMenu
              key="company-menu"
              icon={<BarChartOutlined />}
              title="Company"
            >
              <Menu.Item key="/company/list" icon={<FileTextOutlined />}>
                Company List
              </Menu.Item>
              <Menu.Item key="/company/requests" icon={<FileTextOutlined />}>
                Company Requests
              </Menu.Item>
            </SubMenu>
          )}

          {hasPermission(PERMISSIONS.USERS_VIEW) && (
            <Menu.Item key="/users" icon={<TeamOutlined />}>
              Teams
            </Menu.Item>
          )}

          {hasPermission(PERMISSIONS.REPORTS_VIEW) && (
            <SubMenu
              key="reports-menu"
              icon={<BarChartOutlined />}
              title="Reports"
            >
              <Menu.Item
                key="/reports/conversion"
                icon={<FileTextOutlined />}
              >
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
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;
