// src/pages/Login.jsx
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { loginUser, clearError, fetchCompanyData } from "../store/authSlice";

import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png";

// Enhanced validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .max(100, "Email too long"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .max(50, "Password too long"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const { loading, error, isAuthenticated, companyData } = useSelector(
    (state) => state.auth
  );

  // Memoized brand calculation
  const brand = useMemo(() => {
    const hostParts = window.location.hostname.split(".");
    return hostParts.length > 2 ? hostParts[0] : "Afftrex";
  }, []);

  // Get company name from URL params
  const companyName = useMemo(() => {
    const rawCompany = searchParams.get("company");
    return rawCompany?.trim() || "afftrex";
  }, [searchParams]);

  // Fetch company data on mount
  useEffect(() => {
    if (companyName && !companyData) {
      dispatch(fetchCompanyData(companyName));
    }
  }, [dispatch, companyName, companyData]);

  // Handle authentication redirect
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors on mount
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  // Optimized submit handler
  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    try {
      const credentials = {
        ...values,
        subdomain: companyName,
      };
      
      await dispatch(loginUser(credentials)).unwrap();
      toast.success("Login successful!");
      
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (errMsg) {
      toast.error(errMsg);
      
      // Set specific field errors
      if (errMsg.toLowerCase().includes("credentials") || 
          errMsg.toLowerCase().includes("password")) {
        setFieldError("password", "Invalid credentials");
      } else if (errMsg.toLowerCase().includes("email")) {
        setFieldError("email", "Invalid email");
      }
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, companyName, location, navigate]);

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        pauseOnHover
        limit={3}
      />

      <aside className="login-leftside">
        <div className="welcome">
          <h1 className="title">
            Hello <br />
            {brand.charAt(0).toUpperCase() + brand.slice(1)} 👋
          </h1>
          <p className="summary">
            Access your dashboard at {brand}.
            <br />
            Log in to manage your partnerships and track earnings.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          {companyData?.logo && (
            <img
              src={companyData.logo}
              alt={`${brand} Logo`}
              className="logo"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          
          <h2 className="heading">Welcome Back!</h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="form" noValidate>
                <div className="field">
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`input ${
                      errors.email && touched.email ? "error" : ""
                    }`}
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="field">
                  <label htmlFor="password" className="label">
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={`input ${
                      errors.password && touched.password ? "error" : ""
                    }`}
                    autoComplete="current-password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="btn"
                  disabled={isSubmitting || loading || !values.email || !values.password}
                  aria-label={loading ? "Logging in..." : "Login Now"}
                >
                  {loading ? "Logging in..." : "Login Now"}
                </button>
              </Form>
            )}
          </Formik>

          <a href="/forgot-password" className="forgot">
            Forgot password?
          </a>

          <div className="signup-prompt">
            Don't have an account? Create one:
          </div>
          <div className="signup-btns">
            <button
              className="btn outline"
              onClick={() => navigate("/signup/publisher")}
              type="button"
            >
              Sign up as Publisher
            </button>
            <button
              className="btn outline"
              onClick={() => navigate("/signup/advertiser")}
              type="button"
            >
              Sign up as Advertiser
            </button>
          </div>
        </div>

        <div className="bottom-deco">
          <img
            src={BottomGraphic}
            alt="Decorative"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Login;