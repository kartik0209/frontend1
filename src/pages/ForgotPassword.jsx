// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss"; // still reusing your layout

const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async ({ email }) => {
    setLoading(true);
    try {
      await axios.post(
        "https://afftrex.onrender.com/api/common/auth/forgot-password",
        { email: email.trim().toLowerCase() },
        { headers: { "Content-Type": "application/json" }, timeout: 30000 }
      );
      message.success(
        "If that email is registered, you’ll receive a reset link shortly."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
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
      <main className="form-area">
        <div className="form-wrap">
          <Title level={2}>Forgot Password</Title>
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
              <Input placeholder="you@example.com" autoComplete="email" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <Button
            type="link"
            onClick={() => navigate("/login")}
            style={{ padding: 0 }}
          >
            ← Back to login
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
