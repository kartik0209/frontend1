// src/components/model/ApproveConfirmModal.jsx
import React from "react";
import { Modal, Space, Alert, Typography, InputNumber, Form } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ApproveConfirmModal = ({
  open,
  companyName,
  onConfirm,
  onCancel,
  loading,
  subscriptionDays,
  amount,
  setSubscriptionDays,
  setAmount,
  subscriptiontype,
}) => {
  const handleOk = () => {
    if (subscriptionDays > 0 && amount >= 0) {
      onConfirm({ subscriptionDays, amount });
    }
  };

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
          <span>Approve Company Registration</span>
        </Space>
      }
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yes, Approve"
      cancelText="Cancel"
      okType="primary"
      centered
      width={520}
      maskClosable={false}
      keyboard={false}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Alert
          message="Confirm Company Approval"
          description={
            <Text>
              Are you sure you want to approve <strong>"{companyName}"</strong>?
              Once approved, the company will gain access and can use all
              features.
            </Text>
          }
          type="info"
          showIcon
        />
        {subscriptiontype == "paid" ? (
          <>
            <Form layout="vertical">
              <Form.Item label="Subscription Days" required>
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  value={subscriptionDays}
                  onChange={setSubscriptionDays}
                  placeholder="Enter subscription days"
                />
              </Form.Item>

              <Form.Item label="Amount (₹)" required>
                <InputNumber
                  min={0}
                  formatter={(value) => `₹ ${value}`}
                  parser={(value) => value.replace(/₹\s?/g, "")}
                  style={{ width: "100%" }}
                  value={amount}
                  onChange={setAmount}
                  placeholder="Enter amount"
                />
              </Form.Item>
            </Form>{" "}
          </>
        ) : (
          <></>
        )}

        <div
          style={{
            padding: "16px",
            backgroundColor: "#f6ffed",
            borderRadius: "6px",
            border: "1px solid #b7eb8f",
          }}
        >
          <Text type="secondary">
            <strong>What happens next:</strong>
          </Text>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
            <li>Company status will change to "Approved"</li>
            <li>Admin will receive approval notification</li>
            <li>Company can access the dashboard immediately</li>
            <li>All company features will be unlocked</li>
          </ul>
        </div>
      </Space>
    </Modal>
  );
};

export default ApproveConfirmModal;
