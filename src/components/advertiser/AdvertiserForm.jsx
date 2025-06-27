// src/components/advertiser/AdvertiserForm.jsx
import React from "react";
import { Form, Row, Col, Input, Select, Button, Space } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const AdvertiserForm = ({ form, onFinish, onCancel, loading, isEdit = false }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="advertiser-form"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
            initialValue="Pending"
          >
            <Select placeholder="Select status">
              <Option value="Pending">Pending</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Suspended">Suspended</Option>
              <Option value="Disabled">Disabled</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Banned">Banned</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Reference ID"
            name="reference_id"
            rules={[{ required: true, message: "Please enter reference ID" }]}
          >
            <Input placeholder="Enter reference ID" />
          </Form.Item>
        </Col>
      </Row>

      {!isEdit && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            label="Account Manager"
            name="account_manager"
            rules={[{ required: true, message: "Please enter account manager" }]}
          >
            <Input placeholder="Enter account manager name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea 
              rows={4} 
              placeholder="Enter notes about the advertiser" 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="form-actions">
        <Space>
          <Button onClick={onCancel} className="cancel-btn">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-btn"
          >
            {isEdit ? "Update Advertiser" : "Add Advertiser"}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default AdvertiserForm;