// src/App.jsx
import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { initializeAuth, fetchCompanyData } from "./store/authSlice";
import { PERMISSIONS } from "./utils/rbac";


// Lazy load components for better performance
const Layout = lazy(() => import("./components/Layout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CompanyList = lazy(() => import("./pages/CopmpanyList"));
const CompanyTabsPage = lazy(() => import("./pages/CompanyTabsPage"));
const CampaignCreator = lazy(() => import("./pages/CampaignCreator"));
// Enhanced loading component
const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      flexDirection: "column",
    }}
  >
    <div className="spinner" style={{
      width: "40px",
      height: "40px",
      border: "4px solid #f3f3f3",
      borderTop: "4px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "16px"
    }}></div>
    Loading...
  </div>
);

// Component to initialize auth and company data
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { subdomain, companyData } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth first
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Fetch company data when subdomain is available
    if (subdomain && !companyData) {
      dispatch(fetchCompanyData(subdomain));
    }
  }, [dispatch, subdomain, companyData]);

  return children;
};

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

const ManageCampaignsPage = lazy(() => Promise.resolve({
  default: () => (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Manage Campaigns</h2>
      <p>Campaign Management</p>
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

function AppContent() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/*" element={<ResetPassword />} />
          
          {/* Protected routes with Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.DASHBOARD_VIEW}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="users"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.USERS_VIEW}>
                      <Users />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="publishers"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.PUBLISHERS_VIEW}>
                      <PublishersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="advertisers"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.ADVERTISERS_VIEW}>
                      <AdvertisersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="campaign/manage"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.CAMPAIGNS_VIEW}>
                      <ManageCampaignsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="campaign/create"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.CAMPAIGNS_CREATE}>
                      <CampaignCreator />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="reports/conversion"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.REPORTS_VIEW}>
                      <ConversionReportsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="reports/campaign"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.REPORTS_VIEW}>
                      <CampaignReportsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="company/list"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.COMPANY_VIEW}>
                      <CompanyList />
                    </ProtectedRoute>
                  }
                />
                  <Route
                  path="company/requests"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.COMPANY_VIEW}>
                      <CompanyTabsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              

            </Layout>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <AuthInitializer>
          <AppContent />
        </AuthInitializer>
      </PersistGate>
    </Provider>
  );
}

export default App;