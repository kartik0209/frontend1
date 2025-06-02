// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { initializeAuth } from "./store/authSlice";
import { PERMISSIONS } from "./utils/rbac";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
    }}
  >
    Loading...
  </div>
);

// Component to initialize auth
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />
      </Routes>
      <Layout>
        <Routes>
          {/* <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/*" element={<ResetPassword />} /> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.DASHBOARD_VIEW}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.USERS_VIEW}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route
            path="/publishers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.PUBLISHERS_VIEW}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Publishers Page</h2>
                  <p>Manage Publishers</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/advertisers"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.ADVERTISERS_VIEW}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Advertisers Page</h2>
                  <p>Manage Advertisers</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/manage"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.CAMPAIGNS_VIEW}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Manage Campaigns</h2>
                  <p>Campaign Management</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/campaign/create"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.CAMPAIGNS_CREATE}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Create Campaign</h2>
                  <p>Create New Campaign</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/conversion"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.REPORTS_VIEW}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Conversion Reports</h2>
                  <p>View Conversion Data</p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/campaign"
            element={
              <ProtectedRoute requiredPermission={PERMISSIONS.REPORTS_VIEW}>
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h2>Campaign Reports</h2>
                  <p>View Campaign Data</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
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
