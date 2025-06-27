// src/components/publisher/PublisherSearchForm.jsx
import React from "react";
import { Form, Row, Col, Input, Select, Button, Space, Checkbox } from "antd";

const { Option } = Select;

const PublisherSearchForm = ({ form, onFinish, onClear, onClose, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="search-form"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Publisher ID" name="publisherId">
            <Input placeholder="Enter Publisher ID" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Contact/Company Name" name="contactCompanyName">
            <Input placeholder="Enter Publisher/Company Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter Publisher Email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Manager" name="manager">
            <Input placeholder="Enter Manager's Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Reference ID" name="referenceId">
            <Input placeholder="Enter Reference ID" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Country" name="country">
            <Select placeholder="Select Country">
              <Option value="IN">India</Option>
              <Option value="US">United States</Option>
              <Option value="UK">United Kingdom</Option>
              <Option value="AU">Australia</Option>
              <Option value="CA">Canada</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="City" name="city">
            <Input placeholder="Enter City" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter Phone Number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Entity Type" name="entityType">
            <Select placeholder="Select Entity Type">
              <Option value="Individual">Individual</Option>
              <Option value="Company">Company</Option>
              <Option value="Partnership">Partnership</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item label="Status" name="status">
            <Checkbox.Group>
              <Row gutter={[8, 8]}>
                <Col>
                  <Checkbox value="Active">Active</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Pending">Pending</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Disabled">Disabled</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Rejected">Rejected</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Banned">Banned</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Suspended">Suspended</Checkbox>
                </Col>
                <Col>
                  <Checkbox value="Inactive">Inactive</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      <div className="search-actions">
        <Space>
          <Button onClick={onClear} className="clear-btn">
            Clear
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="search-submit-btn"
          >
            Search
          </Button>
          <Button onClick={onClose} className="close-btn">
            Close
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default PublisherSearchForm;