import React, { useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchCompanyData } from "../store/authSlice";
import { extractSubdomain } from "../utils/helpers";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Signup.scss";
import BottomGraphic from "../assets/bottom_deco.png";
import { authAPI } from "../services/authService";

// Enhanced validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .max(100, "Email too long"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .max(50, "Password too long"),
});

const SignupAdvertiser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, companyData } = useSelector(
    (state) => state.auth
  );

  const subdomain = useMemo(() => {
    return extractSubdomain();
  }, []);

  const brandDisplay = useMemo(() => {
    return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  }, [subdomain]);

  useEffect(() => {
    if (subdomain && !companyData) {
      dispatch(fetchCompanyData(subdomain));
    }
  }, [dispatch, subdomain, companyData]);

  // Optimized submit handler
  const handleSubmit = useCallback(async (values, { setSubmitting, setFieldError }) => {
    try {
      const signupData = {
        ...values,
        subdomain,
      };

      await authAPI.signupAdvertiser(signupData);
      toast.success("Advertiser account created successfully! Please login.");
      navigate("/");
    } catch (errMsg) {
      toast.error(errMsg);

      // Set specific field errors
      if (errMsg.toLowerCase().includes("email")) {
        setFieldError("email", "Email already exists or invalid");
      } else if (errMsg.toLowerCase().includes("password")) {
        setFieldError("password", "Invalid password");
      } else if (errMsg.toLowerCase().includes("name")) {
        setFieldError("name", "Invalid name");
      }
    } finally {
      setSubmitting(false);
    }
  }, [dispatch, subdomain, navigate]);

  return (
    <div className="signup-container">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar
        pauseOnHover
        limit={3}
      />

      <aside className="signup-leftside">
        <div className="welcome">
          <h1 className="title">
            Join as Advertiser <br />
            {brandDisplay} 👋
          </h1>
          <p className="summary">
            Create your advertiser account at {brandDisplay}.
            <br />
            Launch campaigns and reach your target audience effectively.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          {companyData?.logo && (
            <img
              src={companyData.logo}
              alt={`${brandDisplay} Logo`}
              className="logo"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          <h2 className="heading">Sign Up as Advertiser</h2>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched, values }) => (
              <Form className="form" noValidate>
                <div className="field">
                  <label htmlFor="name" className="label">
                    Full Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className={`input ${
                      errors.name && touched.name ? "error" : ""
                    }`}
                    autoComplete="name"
                    autoCapitalize="words"
                    spellCheck="false"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="error"
                  />
                </div>

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
                    autoComplete="new-password"
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
                  disabled={isSubmitting || loading || !values.name || !values.email || !values.password}
                  aria-label={loading ? "Creating account..." : "Create Advertiser Account"}
                >
                  {loading ? "Creating account..." : "Create Advertiser Account"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="signup-prompt">
            Already have an account?
          </div>
          <div className="signup-btns">
            <button
              className="btn outline"
              onClick={() => navigate("/")}
              type="button"
            >
              Back to Login
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

export default SignupAdvertiser;
