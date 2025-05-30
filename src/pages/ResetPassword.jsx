// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.scss"; // your shared styles

const { Title, Paragraph } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Grab token & email from query string:
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // If missing, bail back to login:
  useEffect(() => {
    if (!token || !email) {
      message.error("Invalid or expired reset link.");
      navigate("/login");
    }
  }, [token, email, navigate]);

  const onFinish = async ({ password, confirm }) => {
    // client-side matching
    if (password !== confirm) {
      return message.error("Passwords do not match.");
    }

    setLoading(true);
    // payload exactly as your API expects:
    const payload = {
      email,
      token,
      newPassword: password,
    };

    console.log("[ResetPassword] POST payload:", payload);

    try {
      const res = await axios.post(
        "https://afftrex.onrender.com/api/common/auth/reset-password",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );
      console.log("[ResetPassword] Success response:", res.data);
      message.success("Your password has been reset. Redirecting to login…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(
        "[ResetPassword] Error response body:",
        err.response?.data
      );
      const serverMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Reset failed.";
      message.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <main className="form-area">
        <div className="form-wrap">
          <Title level={2} className="title">
            Reset Password
          </Title>
          <Paragraph className="summary">
            Set a new password for <strong>{email}</strong>.
          </Paragraph>

          <Form
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            style={{ width: "100%" }}
          >
            <Form.Item
              label="New Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 8, message: "Must be at least 8 characters" },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="••••••••"
                autoComplete="new-password"
                className="input"
              />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="••••••••"
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
