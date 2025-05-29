import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  // Pages where sidebar should not be shown
  const publicPages = ['/', '/forgot-password', '/signup/publisher', '/signup/advertiser'];
  const showSidebar = isAuthenticated && !publicPages.includes(location.pathname);
  
  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <main className={`main-content ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;