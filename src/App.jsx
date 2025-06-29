// src/App.jsx
import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { initializeAuth, fetchCompanyData } from "./store/authSlice";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";

// Enhanced loading component with CSS animation
import Loading from "./components/common/LoadingSpinner";

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

function AppContent() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log('App Content - isAuthenticated:', isAuthenticated, 'loading:', loading);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        {isAuthenticated ? (
          <ProtectedRoutes />
        ) : (
          <PublicRoutes />
        )}
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