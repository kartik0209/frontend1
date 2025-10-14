import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, BellOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown } from 'antd';
import '../../styles/Header.scss';
import { logout } from '../../store/authSlice';

// Route to title mapping
const routeTitles = {
  '/dashboard': 'Dashboard',
  '/users': 'User Management',
  '/publishers': 'Publisher Management',
  '/advertisers': 'Advertiser Management',
  '/campaign/manage': 'Campaign Management',
  '/campaign/create': 'Create Campaign',
  '/reports/conversion': 'Conversion Reports',
  '/reports/conversion-old': 'Conversion Reports ',
  '/reports/publisher': 'Publisher Reports',
  '/reports/advertisher': 'Advertiser Reports',
  '/reports/conversion-campaign': 'Campaign Reports',
  '/reports/daily': 'Daily Reports',
  '/reports/campaign': 'Click Reports',
  '/company/list': 'Company List',
  '/company/requests': 'Company Requests',
};

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Check exact match first
    if (routeTitles[path]) {
      return routeTitles[path];
    }
    
    // Handle dynamic routes
    if (path.startsWith('/publisher/')) {
      return 'Publisher Details';
    }
    if (path.startsWith('/advertisers/')) {
      return 'Advertiser Details';
    }
    if (path.startsWith('/campaign/') && path !== '/campaign/manage' && path !== '/campaign/create') {
      return 'Campaign Details';
    }
    
    return 'Dashboard';
  };

  const handleLogout = () => {
    // Clear auth state
     dispatch(logout());
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Navigate to login
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setDropdownVisible(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setDropdownVisible(false);
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: handleProfileClick,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: handleSettingsClick,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      
      <div className="header-right">
        <Badge count={5} className="notification-badge">
          <BellOutlined className="notification-icon" />
        </Badge>
        
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
          open={dropdownVisible}
          onOpenChange={setDropdownVisible}
        >
          <div className="profile-section">
            <Avatar 
              size={40} 
              icon={<UserOutlined />}
              src={user?.profileImage}
              className="profile-avatar"
            />
            <div className="profile-info">
              <span className="profile-name">{user?.name || 'User'}</span>
              <span className="profile-role">{user?.role || 'Admin'}</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;