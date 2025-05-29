// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.scss";

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      message.error("Invalid reset link.");
      navigate("/login");
    }
  }, [token, email, navigate]);

  const onFinish = async ({ password, confirm }) => {
    if (password !== confirm) {
      return message.error("Passwords do not match.");
    }
    setLoading(true);
    try {
      console.log("[ResetPassword] sending", { email, token });
      const res = await axios.post(
        "https://afftrex.onrender.com/api/common/auth/reset-password",
        { email, token, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("[ResetPassword] success:", res.data);
      message.success("Your password has been reset. Redirecting to login…");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("[ResetPassword] error:", err);
      message.error(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <main className="form-area">
        <div className="form-wrap">
          <Title level={2} className="title">Reset Password</Title>
          <Paragraph className="summary">
            Enter your new password for <strong>{email}</strong>.
          </Paragraph>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password autoComplete="new-password" className="input" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password" },
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
              <Input.Password className="input" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="btn"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
