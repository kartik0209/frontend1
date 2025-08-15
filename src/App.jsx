// src/App.jsx
import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { initializeAuth, fetchCompanyData, setSubdomain } from "./store/authSlice";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { getSubdomain } from "./utils/helpers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/common/LoadingSpinner";

// Component to initialize auth and company data
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { subdomain, companyData } = useSelector((state) => state.auth);

  // Detect subdomain on mount
  useEffect(() => {
    const sub = getSubdomain();
    if (sub) {
      dispatch(setSubdomain(sub)); // Save to Redux
    }
  }, [dispatch]);

  // Initialize authentication
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Fetch company data when subdomain is available
  useEffect(() => {
    if (subdomain && !companyData) {
      dispatch(fetchCompanyData(subdomain));
    }
  }, [dispatch, subdomain, companyData]);

  return children;
};

function AppContent() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {isAuthenticated ? <ProtectedRoutes /> : <PublicRoutes />}
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
