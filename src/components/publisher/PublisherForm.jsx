// src/components/publisher/PublisherForm.jsx
import React from "react";
import { Form, Row, Col, Input, Select, Switch, Button, Space } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const PublisherForm = ({ form, onFinish, onCancel, loading, isEdit = false }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="publisher-form"
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
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please enter country" }]}
          >
            <Select placeholder="Select country">
              <Option value="IN">India</Option>
              <Option value="US">United States</Option>
              <Option value="UK">United Kingdom</Option>
              <Option value="AU">Australia</Option>
              <Option value="CA">Canada</Option>
              <Option value="DE">Germany</Option>
              <Option value="FR">France</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input placeholder="Enter state" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            label="ZIP Code"
            name="zip_code"
            rules={[{ required: true, message: "Please enter ZIP code" }]}
          >
            <Input placeholder="Enter ZIP code" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Entity Type"
            name="entity_type"
            rules={[{ required: true, message: "Please select entity type" }]}
          >
            <Select placeholder="Select entity type">
              <Option value="Individual">Individual</Option>
              <Option value="Company">Company</Option>
              <Option value="Partnership">Partnership</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item label="IM Type" name="im_type">
            <Select placeholder="Select IM type">
              <Option value="Skype">Skype</Option>
              <Option value="WhatsApp">WhatsApp</Option>
              <Option value="Telegram">Telegram</Option>
              <Option value="Discord">Discord</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="IM Username" name="im_username">
            <Input placeholder="Enter IM username" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item label="Promotion Method" name="promotion_method">
            <Select placeholder="Select promotion method">
              <Option value="Social Media">Social Media</Option>
              <Option value="Email Marketing">Email Marketing</Option>
              <Option value="Content Marketing">Content Marketing</Option>
              <Option value="Paid Advertising">Paid Advertising</Option>
              <Option value="Influencer Marketing">Influencer Marketing</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Reference ID" name="reference_id">
            <Input placeholder="Enter reference ID" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item label="Company Name" name="signup_company_name">
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Notify by Email" name="notify_by_email" valuePropName="checked">
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item label="Company Address" name="signup_company_address">
            <TextArea rows={3} placeholder="Enter company address" />
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
            {isEdit ? "Update Publisher" : "Add Publisher"}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default PublisherForm;