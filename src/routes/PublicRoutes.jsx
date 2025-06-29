// src/routes/PublicRoutes.jsx
import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicLayout from '../layouts/PublicLayout';

// Lazy load public pages
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
// const SignupPublisher = lazy(() => import('../pages/SignupPublisher'));
// const SignupAdvertiser = lazy(() => import('../pages/SignupAdvertiser'));

const PublicRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PublicLayout>
      <Routes>
        {/* Login page - default route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Password management */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
        
        {/* Registration routes */}
        {/* <Route path="/signup/publisher" element={<SignupPublisher />} />
        <Route path="/signup/advertiser" element={<SignupAdvertiser />} /> */}
        
        {/* Fallback for any unmatched public routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;