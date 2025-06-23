// src/layouts/PublicLayout.jsx
import React from 'react';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Content } = Layout;

const PublicLayout = ({ children }) => {
  return (
    <Layout className="public-layout" style={{ minHeight: '100vh' }}>
      <Content>
        {children}
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
          theme="light"
        />
      </Content>
    </Layout>
  );
};

export default PublicLayout;