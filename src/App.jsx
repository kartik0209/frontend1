// src/App.jsx
import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { initializeAuth, fetchCompanyData } from "./store/authSlice";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Enhanced loading component with CSS animation
import Loading from "./components/common/LoadingSpinner";

// Component to initialize auth and company data
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { subdomain, companyData, isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // Initialize auth first without any navigation
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

function AppContent() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log('App Content - isAuthenticated:', isAuthenticated, 'loading:', loading);

  // Show loading while authentication is being determined
  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {isAuthenticated ? (
        <ProtectedRoutes />
      ) : (
        <PublicRoutes />
      )}
    </Suspense>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Router>
          <AuthInitializer>
            <AppContent />
          </AuthInitializer>
        </Router>
         <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      </PersistGate>
    </Provider>
  );
}

export default App;