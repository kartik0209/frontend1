// src/routes/ProtectedRoutes.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../layouts/ProtectedLayout';
import ProtectedRoute from '../components/authguards/ProtectedRoute';
import { PERMISSIONS } from '../utils/rbac';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const CompanyList = lazy(() => import('../pages/CompanyList')); // Fixed typo: CopmpanyList -> CompanyList
const CompanyTabsPage = lazy(() => import('../pages/CompanyTabsPage'));
const CampaignCreator = lazy(() => import('../pages/CampaignCreator'));
const CampaignManagement = lazy(() => import('../pages/CampaignManagement'));

// Lazy loaded placeholder components
const PublishersPage = lazy(() => Promise.resolve({
  default: () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Publishers Page</h2>
      <p>Manage Publishers</p>
    </div>
  )
}));

const AdvertisersPage = lazy(() => Promise.resolve({
  default: () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Advertisers Page</h2>
      <p>Manage Advertisers</p>
    </div>
  )
}));

const ConversionReportsPage = lazy(() => Promise.resolve({
  default: () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Conversion Reports</h2>
      <p>View Conversion Data</p>
    </div>
  )
}));

const CampaignReportsPage = lazy(() => Promise.resolve({
  default: () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Campaign Reports</h2>
      <p>View Campaign Data</p>
    </div>
  )
}));

const ProtectedRoutes = () => {
  const { isAuthenticated, user, permissions } = useSelector((state) => state.auth);

  console.log('ProtectedRoutes - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoutes - user:', user);
  console.log('ProtectedRoutes - permissions:', permissions);

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to /');
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.DASHBOARD_VIEW}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.USERS_VIEW}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publishers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.PUBLISHERS_VIEW}>
                <PublishersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertisers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.ADVERTISERS_VIEW}>
                <AdvertisersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/manage"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.CAMPAIGNS_VIEW}>
                <CampaignManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/create"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.CAMPAIGNS_CREATE}>
                <CampaignCreator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/conversion"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/campaign"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <CampaignReportsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/list"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.COMPANY_VIEW}>
                <CompanyList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/requests"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.COMPANY_VIEW}>
                <CompanyTabsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback for any unmatched protected routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default ProtectedRoutes;