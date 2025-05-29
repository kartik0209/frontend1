// src/pages/Login.jsx
import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png"; 
import logo from "../assets/logo.png";
import { jwtDecode } from "jwt-decode";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const brand = useMemo(() => {
    const host = window.location.hostname.split(".");
    return host.length > 2 ? host[0] : "YourBrand";
  }, []);

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        'https://afftrex.onrender.com/api/common/auth/login',
        {
          email: values.email.trim().toLowerCase(),
          password: values.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
          withCredentials: false,
        }
      );

      const { data } = response.data;
      console.log("data--->",response); 
      
        localStorage.setItem('authToken', data);
        const decoded = jwtDecode(data);


      
const { name, role, permissions } = decoded;
      


  
      toast.success("Login successful! ");

      setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
    } catch (error) {
      let message = "Login failed. Please try again.";

      if (error.code === 'ECONNABORTED') {
        message = "Request timeout. Please check your connection.";
      } else if (error.code === 'ERR_NETWORK') {
        message = "Network error. Please try again later.";
      } else if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            message = data?.message || "Invalid email or password.";
            break;
          case 401:
            message = "Invalid credentials.";
            setFieldError("password", "Invalid credentials");
            break;
          case 403:
            message = "Access denied. Contact support.";
            break;
          case 404:
            message = "Login service not found.";
            break;
          case 429:
            message = "Too many attempts. Try later.";
            break;
          case 500:
            message = "Server error. Try again later.";
            break;
          default:
            message = data?.message || `Error: ${status}`;
        }
      } else if (error.request) {
        message = "Server unreachable. Check internet connection.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar pauseOnHover />

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
            onError={(e) => (e.target.style.display = 'none')}
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
                  <label htmlFor="email" className="label">Email Address</label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`input ${errors.email && touched.email ? 'error' : ''}`}
                    autoComplete="email"
                  />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>

                <div className="field">
                  <label htmlFor="password" className="label">Password</label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={`input ${errors.password && touched.password ? 'error' : ''}`}
                    autoComplete="current-password"
                  />
                  <ErrorMessage name="password" component="div" className="error" />
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

          <button type="button" className="forgot" onClick={() => navigate("/forgot-password")}>
            Forgot password?
          </button>

          <div className="signup-prompt">Don't have an account? Create one:</div>
          <div className="signup-btns">
            <button className="btn outline" onClick={() => navigate("/signup/publisher")}>
              Sign up as Publisher
            </button>
            <button className="btn outline" onClick={() => navigate("/signup/advertiser")}>
              Sign up as Advertiser
            </button>
          </div>
        </div>

        <div className="bottom-deco">
          <img src={BottomGraphic} alt="Decorative" onError={(e) => (e.target.style.display = 'none')} />
        </div>
      </main>
    </div>
  );
};

export default Login;
