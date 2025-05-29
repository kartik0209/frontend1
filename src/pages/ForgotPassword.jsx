// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss"; // reuse login styles

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async ({ email }) => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log("[ForgotPassword] Sending reset request for:", normalizedEmail);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://afftrex.onrender.com/api/common/auth/forgot-password",
        { email: normalizedEmail },
        { headers: { "Content-Type": "application/json" }, timeout: 30000 }
      );
      console.log("[ForgotPassword] Success response:", response.data);
      message.success(
        "If that email is registered, you’ll receive a reset link shortly."
      );
   
    } catch (err) {
      console.error("[ForgotPassword] Error response:", err);
      const msg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out."
          : err.code === "ERR_NETWORK"
          ? "Network error."
          : "Something went wrong.");
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* optional left-side hero if you have one in Login */}
      <main className="form-area">
        <div className="form-wrap">
          <Title level={2} className="title">Forgot Password</Title>
          <Paragraph className="summary">
            Enter your email, and we’ll send you a link to reset your password.
          </Paragraph>

          <Form
            name="forgot"
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="you@example.com"
                autoComplete="email"
                className="input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="btn"
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            onClick={() => navigate("/login")}
            className="link"
          >
            ← Back to login
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
