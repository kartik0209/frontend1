// src/pages/Login.jsx
import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png"; 
import logo from "../assets/logo.png"; // Placeholder for logo

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Extract subdomain for branding
  const brand = useMemo(() => {
    const host = window.location.hostname;
    const parts = host.split(".");
    return parts.length > 2 ? parts[0] : "YourBrand";
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // Simulate API call - in real app, validate credentials with backend
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        values
      );
      
      // Mock successful login
      if (response.status === 201) {
        const userData = {
          email: values.email,
          name: values.email.split('@')[0], // Use email prefix as name
          role: 'User'
        };
        
        // Use auth context to login
        login(userData);
        
        toast.success("Login successful! Redirecting...");
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-center" hideProgressBar />

      <aside className="login-leftside">
        <div className="welcome">
          <h1 className="title">
            Hello <br />
            {brand.charAt(0).toUpperCase() + brand.slice(1)}{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p className="summary">
            Access your dashboard at {brand}.
            <br />
            Log in to manage your partnerships and track earnings effortlessly.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          <img
            src={logo}
            alt="Logo"
            className="logo"
          />
          <h2 className="heading">Welcome Back!</h2>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="form">
                <div className="field">
                  <label htmlFor="email" className="label">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="input"
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
                    className="input"
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
                >
                  {loading ? "Logging in..." : "Login Now"}
                </button>
              </Form>
            )}
          </Formik>

          <a href="#" className="forgot">
            Forgot password? 
          </a>

          <div className="signup-prompt">
            Don't have an account? Create one now:
          </div>
          <div className="signup-btns">
            <button type="button" className="btn outline">
              Sign up as Publisher
            </button>
            <button type="button" className="btn outline">
              Sign up as Advertiser
            </button>
          </div>
        </div>

        
        <div className="bottom-deco">
          <img src={BottomGraphic} alt="Foliage graphic"  />
        </div>
      </main>
    </div>
  );
};

export default Login;