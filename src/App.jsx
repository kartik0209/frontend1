// src/App.jsx
import React, { useEffect, Suspense ,useState,useMemo} from "react";
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
    
    dispatch(initializeAuth());
  }, [dispatch]);


   const brand = useMemo(() => {
      const hostParts = window.location.hostname.split(".");
      return hostParts.length > 2 ? hostParts[0] : "Afftrex";
    }, []);

  useEffect(() => {
    // Fetch company data when subdomain is available
    if (subdomain && !companyData) {
      dispatch(fetchCompanyData(subdomain || brand));
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
  // const [zoom, setZoom] = useState(0.8); // default 80%

  // useEffect(() => {
  //   document.body.style.transform = `scale(${zoom})`;
  //   document.body.style.transformOrigin = "0 0";
  //   document.body.style.width = `${100 / zoom}%`;
  // }, [zoom]);
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