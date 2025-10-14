import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  console.log('Layout - Current Path:', location.pathname);
  console.log('Layout - isAuthenticated:', isAuthenticated);
  
  const publicPages = ['/', '/forgot-password', '/signup/publisher', '/signup/advertiser'];
  const showSidebar = isAuthenticated && !publicPages.includes(location.pathname);
  
  console.log('Layout - Show Sidebar:', showSidebar);
  
  // Lifted sidebar state
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div className="app-layout">
        {showSidebar && (
          <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          </div>
        )}
        <main className={`main-content ${
          showSidebar 
            ? `with-sidebar ${collapsed ? 'collapsed' : ''}` 
            : 'full-width'
        }`}>
          {showSidebar && <Header />}
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;