// src/components/Layout.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const publicPages = ['/', '/forgot-password', '/signup/publisher', '/signup/advertiser'];
  const showSidebar = isAuthenticated && !publicPages.includes(location.pathname);

  // Lifted sidebar state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      {showSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <main className={`main-content ${showSidebar ? (collapsed ? 'collapsed' : '') : 'full-width'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;