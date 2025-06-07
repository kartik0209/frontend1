import React from "react";
import { Modal, Form, InputNumber, Typography } from "antd";

const { Text } = Typography;

export default function ExtendDaysModal({
  open,
  companyName,
  subscriptionDays,
  amount,
  setSubscriptionDays,
  setAmount,
  onConfirm,
  onCancel,
  loading,
}) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onConfirm({
        subscriptionDays: values.subscriptionDays,
        amount: values.amount,
      });
    } catch (err) {
      // Validation failed
    }
  };

  return (
    <Modal
      title={`Extend Subscription for "${companyName}"`}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Extend"
      cancelText="Cancel"
    >
      <Text>
        You can extend the current subscription duration and optionally charge an amount.
      </Text>

      <Form
        layout="vertical"
        form={form}
        initialValues={{
          subscriptionDays: subscriptionDays || 0,
          amount: amount || 0,
        }}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          label="Subscription Days to Add"
          name="subscriptionDays"
          rules={[{ required: true, message: "Please enter number of days" }]}
        >
          <InputNumber
            min={1}
            max={365}
            style={{ width: "100%" }}
            onChange={setSubscriptionDays}
          />
        </Form.Item>

        <Form.Item
          label="Amount (₹)"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount" }]}
        >
          <InputNumber
            min={0}
            step={10}
            style={{ width: "100%" }}
            onChange={setAmount}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
