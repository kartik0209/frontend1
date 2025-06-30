// src/routes/PublicRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicLayout from '../layouts/PublicLayout';
import LoginPageSkeleton from '../components/skeletons/LoginPageSkeleton';

// Lazy load public pages
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
// const SignupPublisher = lazy(() => import('../pages/SignupPublisher'));
// const SignupAdvertiser = lazy(() => import('../pages/SignupAdvertiser'));

// Custom fallback component for different page types
const PublicPageSkeleton = ({ pageType }) => {
  switch (pageType) {
    case 'login':
    case 'forgot-password':
    case 'reset-password':
      return <LoginPageSkeleton />;
    default:
      return <LoginPageSkeleton />;
  }
};

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
        <Route 
          path="/" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="login" />}>
              <Login />
            </Suspense>
          } 
        />
        <Route path="/login" element={<Navigate to="/" replace />} />
        
        {/* Password management */}
        <Route 
          path="/forgot-password" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="forgot-password" />}>
              <ForgotPassword />
            </Suspense>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="reset-password" />}>
              <ResetPassword />
            </Suspense>
          } 
        />
        <Route 
          path="/reset-password/*" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="reset-password" />}>
              <ResetPassword />
            </Suspense>
          } 
        />
        
        {/* Registration routes */}
        {/* <Route 
          path="/signup/publisher" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="signup" />}>
              <SignupPublisher />
            </Suspense>
          } 
        />
        <Route 
          path="/signup/advertiser" 
          element={
            <Suspense fallback={<PublicPageSkeleton pageType="signup" />}>
              <SignupAdvertiser />
            </Suspense>
          } 
        /> */}
        
        {/* Fallback for any unmatched public routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
};

export default PublicRoutes;