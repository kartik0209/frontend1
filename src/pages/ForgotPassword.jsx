// src/pages/ForgotPassword.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { authAPI } from "../services/authService";
import { getBrandFromHostname, validateEmail } from "../utils/helpers";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png";

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract brand name from hostname
  const brand = useMemo(() => getBrandFromHostname(), []);

  // Get company name from URL params for consistency
  const companyName = useMemo(() => {
    const rawCompany = searchParams.get("company");
    return rawCompany?.trim() || "afftrex";
  }, [searchParams]);

  // Optimized form submission handler
  const handleSubmit = useCallback(async (values) => {
    const { email } = values;
    const normalizedEmail = email.trim().toLowerCase();

    // Client-side validation
    if (!validateEmail(normalizedEmail)) {
      message.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        email: normalizedEmail,
        subdomain: companyName,
      };

      console.log("[ForgotPassword] Sending reset request:", { 
        email: normalizedEmail, 
        subdomain: companyName 
      });

      await authAPI.forgotPassword(payload);
      
      setEmailSent(true);
      message.success({
        content: "Reset link sent! Check your email and spam folder.",
        duration: 6,
      });

      // Clear form after successful submission
      form.resetFields();
      
    } catch (error) {
      console.error("[ForgotPassword] Error:", error);
      
      const errorMessage = error.response?.data?.message || 
        error.message || 
        "Failed to send reset email. Please try again.";
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [companyName, form]);

  // Navigate back to login with preserved query params
  const handleBackToLogin = useCallback(() => {
    const queryString = searchParams.toString();
    const loginPath = queryString ? `/?${queryString}` : "/";
    navigate(loginPath);
  }, [navigate, searchParams]);

  // Resend email handler
  const handleResendEmail = useCallback(() => {
    setEmailSent(false);
    const lastEmail = form.getFieldValue('email');
    if (lastEmail) {
      handleSubmit({ email: lastEmail });
    }
  }, [form, handleSubmit]);

  return (
    <div className="login-container">
      <aside className="login-leftside">
        <div className="welcome">
          <h1 className="title">
            Hello <br />
            {brand.charAt(0).toUpperCase() + brand.slice(1)} 👋
          </h1>
          <p className="summary">
            Secure access to your {brand} dashboard.
            <br />
            Reset your password to continue managing partnerships.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          <Title level={2} className="heading">
            {emailSent ? "Check Your Email" : "Reset Password"}
          </Title>
          
          {emailSent ? (
            <div className="email-sent-content">
              <Paragraph className="summary">
                We've sent a password reset link to your email address.
                If you don't see it, check your spam folder.
              </Paragraph>
              
              <div className="action-buttons">
                <Button
                  type="default"
                  onClick={handleResendEmail}
                  loading={loading}
                  className="btn outline"
                  style={{ marginBottom: '12px' }}
                >
                  Resend Email
                </Button>
                
                <Button
                  type="link"
                  onClick={handleBackToLogin}
                  icon={<ArrowLeftOutlined />}
                  className="back-link"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Paragraph className="summary">
                Enter your email address and we'll send you a secure link to reset your password.
              </Paragraph>

              <Form
                form={form}
                name="forgot-password"
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                autoComplete="off"
                className="form"
              >
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Please enter a valid email address" },
                    { max: 100, message: "Email is too long" },
                  ]}
                  validateTrigger="onBlur"
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="input"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="btn"
                    size="large"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Form.Item>
              </Form>

              <Button
                type="link"
                onClick={handleBackToLogin}
                icon={<ArrowLeftOutlined />}
                className="back-link"
              >
                Back to Login
              </Button>
            </>
          )}
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

export default ForgotPassword;