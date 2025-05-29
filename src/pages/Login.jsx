// src/pages/Login.jsx
import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "../store/authSlice";

import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png";
import logo from "../assets/logo.png";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const brand = useMemo(() => {
    const host = window.location.hostname.split(".");
    return host.length > 2 ? host[0] : "YourBrand";
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const result = await dispatch(loginUser(values)).unwrap();
      
      toast.success("Login successful!");
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      setTimeout(() => navigate(from, { replace: true }), 1500);
      
    } catch (error) {
      toast.error(error);
      
      if (error.includes("Invalid credentials")) {
        setFieldError("password", "Invalid credentials");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        pauseOnHover
      />

      <aside className="login-leftside">
        <div className="welcome">
          <h1 className="title">
            Hello <br />
            {brand.charAt(0).toUpperCase() + brand.slice(1)} 👋
          </h1>
          <p className="summary">
            Access your dashboard at {brand}.<br />
            Log in to manage your partnerships and track earnings.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          <img
            src={logo}
            alt={`${brand} Logo`}
            className="logo"
            onError={(e) => (e.target.style.display = "none")}
          />
          <h2 className="heading">Welcome Back!</h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur
          >
            {({ isSubmitting, errors, touched }) => (
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
                  disabled={isSubmitting || loading}
                  aria-label={loading ? "Logging in..." : "Login Now"}
                >
                  {loading ? "Logging in..." : "Login Now"}
                </button>
              </Form>
            )}
          </Formik>

          <button
            type="button"
            className="forgot"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>

          <div className="signup-prompt">
            Don't have an account? Create one:
          </div>
          <div className="signup-btns">
            <button
              className="btn outline"
              onClick={() => navigate("/signup/publisher")}
            >
              Sign up as Publisher
            </button>
            <button
              className="btn outline"
              onClick={() => navigate("/signup/advertiser")}
            >
              Sign up as Advertiser
            </button>
          </div>
        </div>

        <div className="bottom-deco">
          <img
            src={BottomGraphic}
            alt="Decorative"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </main>
    </div>
  );
};

export default Login;