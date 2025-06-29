// src/pages/ResetPassword.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Form, Input, Button, Typography, message, Progress } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { authAPI } from "../services/authService";
import { getBrandFromHostname, validatePassword } from "../utils/helpers";
import { handleFormErrors, logError } from "../utils/errorHandler";
import "../styles/Login.scss";
import BottomGraphic from "../assets/bottom_deco.png";

const { Title, Paragraph, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract token and email from URL params
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const companyName = searchParams.get("company") || "afftrex";

  // Extract brand name from hostname
  const brand = useMemo(() => getBrandFromHostname(), []);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Validate URL parameters on mount
  useEffect(() => {
    if (!token || !email) {
      message.error("Invalid or expired reset link. Please request a new one.");
      navigate("/forgot-password");
    }
  }, [token, email, navigate]);

  // Handle password strength validation
  const handlePasswordChange = useCallback((e) => {
    const password = e.target.value;
    if (password) {
      const strength = validatePassword(password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  }, []);

  // Optimized form submission
  const handleSubmit = useCallback(async (values) => {
    const { password, confirmPassword } = values;
    
    // Client-side validation
    if (password !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      message.error("Password doesn't meet security requirements.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        token,
        newPassword: password,
        subdomain: companyName,
      };

      console.log("[ResetPassword] Resetting password for:", email);

      await authAPI.resetPassword(payload);
      
      message.success({
        content: "Password reset successfully! Redirecting to login...",
        duration: 3,
      });

      // Clear form and redirect after success
      form.resetFields();
      setTimeout(() => {
        const queryString = searchParams.toString();
        const loginPath = queryString ? `/?${queryString}` : "/";
        navigate(loginPath);
      }, 2000);

    } catch (error) {
      console.error("[ResetPassword] Error:", error);
      logError(error, 'ResetPassword', { email, hasToken: !!token });
      
      // Handle form-specific errors
      if (!handleFormErrors(error, form.setFields)) {
        const errorMessage = error.message || "Failed to reset password. Please try again.";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [email, token, companyName, form, navigate, searchParams]);

  // Navigate back to forgot password
  const handleBackToForgot = useCallback(() => {
    const queryString = searchParams.toString();
    const forgotPath = queryString ? `/forgot-password?${queryString}` : "/forgot-password";
    navigate(forgotPath);
  }, [navigate, searchParams]);

  // Get password strength color and text
  const getPasswordStrengthDisplay = () => {
    if (!passwordStrength) return null;
    
    const strengthConfig = {
      weak: { color: '#ff4d4f', text: 'Weak', percent: 25 },
      medium: { color: '#faad14', text: 'Medium', percent: 75 },
      strong: { color: '#52c41a', text: 'Strong', percent: 100 },
    };
    
    return strengthConfig[passwordStrength.strength];
  };

  const strengthDisplay = getPasswordStrengthDisplay();

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
            Create a strong password to protect your account.
          </p>
        </div>
      </aside>

      <main className="form-area">
        <div className="form-wrap">
          <Title level={2} className="heading">
            <LockOutlined /> Reset Password
          </Title>
          
          <Paragraph className="summary">
            Create a new secure password for <strong>{email}</strong>
          </Paragraph>

          <Form
            form={form}
            name="reset-password"
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            autoComplete="off"
            className="form"
          >
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const validation = validatePassword(value);
                    return validation.isValid 
                      ? Promise.resolve() 
                      : Promise.reject(new Error('Password must contain uppercase, lowercase, and numbers'));
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="••••••••"
                autoComplete="new-password"
                className="input"
                size="large"
                onChange={handlePasswordChange}
              />
            </Form.Item>

            {/* Password Strength Indicator */}
            {strengthDisplay && (
              <div className="password-strength" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Text type="secondary">Password Strength</Text>
                  <Text style={{ color: strengthDisplay.color, fontWeight: 500 }}>
                    {strengthDisplay.text}
                  </Text>
                </div>
                <Progress
                  percent={strengthDisplay.percent}
                  strokeColor={strengthDisplay.color}
                  showInfo={false}
                  size="small"
                />
                
                {/* Requirements checklist */}
                {passwordStrength && (
                  <div className="password-requirements" style={{ marginTop: '8px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px' }}>
                      <Text type={passwordStrength.requirements.minLength ? 'success' : 'secondary'}>
                        {passwordStrength.requirements.minLength ? <CheckCircleOutlined /> : '○'} 8+ characters
                      </Text>
                      <Text type={passwordStrength.requirements.hasUpperCase ? 'success' : 'secondary'}>
                        {passwordStrength.requirements.hasUpperCase ? <CheckCircleOutlined /> : '○'} Uppercase
                      </Text>
                      <Text type={passwordStrength.requirements.hasLowerCase ? 'success' : 'secondary'}>
                        {passwordStrength.requirements.hasLowerCase ? <CheckCircleOutlined /> : '○'} Lowercase
                      </Text>
                      <Text type={passwordStrength.requirements.hasNumbers ? 'success' : 'secondary'}>
                        {passwordStrength.requirements.hasNumbers ? <CheckCircleOutlined /> : '○'} Numbers
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder="••••••••" 
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
                disabled={!passwordStrength?.isValid}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            onClick={handleBackToForgot}
            className="back-link"
          >
            Request a new reset link
          </Button>
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

export default ResetPassword;