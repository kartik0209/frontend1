// src/routes/ProtectedRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../layouts/ProtectedLayout";
import ProtectedRoute from "../components/authguards/ProtectedRoute";
import { PERMISSIONS } from "../utils/rbac";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AdvertiserManagement from "../pages/AdvertiserManagement";
import CampaignDetailPage from "../pages/CampaignDetailPage";
import PublisherDetailsPage from "../pages/PublisherDetails";
import AdvertiserDetailsPage from "../pages/AdvertiserDetailsPage";
import ConversionReportsPageOld from "../pages/ConversionReportPage-Old";

// Lazy load components for better performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/Users"));
const CompanyList = lazy(() => import("../pages/CompanyList"));
const CompanyTabsPage = lazy(() => import("../pages/CompanyTabsPage"));
const CampaignCreator = lazy(() => import("../pages/CampaignCreator"));
const CampaignManagement = lazy(() => import("../pages/CampaignManagement"));
const PublisherManagement = lazy(() => import("../pages/PublisherManagement"));
const CampaignReportsPage = lazy(() => import("../pages/CampaignReportsPage"));
const ConversionReportsPage = lazy(() =>
  import("../pages/ConversionReportsPage")
);

const ProtectedRoutes = () => {
  const { isAuthenticated, user, permissions } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to /");
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Only redirect root path to dashboard */}
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
                <PublisherManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publisher/:id"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.PUBLISHERS_VIEW}>
                <PublisherDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertisers"
            element={
              <ProtectedRoute
                requiredPermission={PERMISSIONS?.ADVERTISERS_VIEW}
              >
                <AdvertiserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertisers/:id"
            element={
              <ProtectedRoute
                requiredPermission={PERMISSIONS?.ADVERTISERS_VIEW}
              >
                <AdvertiserDetailsPage />
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
            path="/campaign/:id"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.CAMPAIGNS_VIEW}>
                <CampaignDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/create"
            element={
              <ProtectedRoute
                requiredPermission={PERMISSIONS?.CAMPAIGNS_CREATE}
              >
                <CampaignCreator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/conversion"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage name={"Conversion"} />
              </ProtectedRoute>
            }
          />

              <Route
            path="/reports/conversion-old"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPageOld name={"Conversion"} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/publisher"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage name={"Publisher"} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/advertiser"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage name={"advertiser"} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/conversion-campaign"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage name={"Campaign"} />
              </ProtectedRoute>
            }
          />

              <Route
            path="/reports/daily"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS?.REPORTS_VIEW}>
                <ConversionReportsPage name={"Daily"} />
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
