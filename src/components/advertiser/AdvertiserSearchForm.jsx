// src/components/advertiser/AdvertiserSearchForm.jsx
import React from "react";
import { Form, Row, Col, Input, Select, Button, Space, Checkbox } from "antd";

const { Option } = Select;

const AdvertiserSearchForm = ({ form, onFinish, onClear, onClose, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="search-form"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Advertiser ID" name="advertiserId">
            <Input placeholder="Enter Advertiser ID" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter Advertiser Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter Advertiser Email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Company Name" name="companyName">
            <Input placeholder="Enter Company Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="Enter Phone Number" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Reference ID" name="reference_id">
            <Input placeholder="Enter Reference ID" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Managers" name="managers">
            <Input placeholder="Enter Manager Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Country" name="country">
            <Input placeholder="Enter Country" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="City" name="city">
            <Input placeholder="Enter City" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Currency" name="currency">
            <Select placeholder="Select Currency" allowClear>
              <Option value="USD">USD</Option>
              <Option value="EUR">EUR</Option>
              <Option value="GBP">GBP</Option>
              <Option value="JPY">JPY</Option>
              <Option value="CAD">CAD</Option>
              <Option value="AUD">AUD</Option>
              <Option value="INR">INR</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Entity Type" name="entity_type">
            <Select placeholder="Select Entity Type" allowClear>
              <Option value="Agency">Agency</Option>
              <Option value="Direct Advertiser">Direct Advertiser</Option>
              <Option value="Network">Network</Option>
              <Option value="Individual">Individual</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Website URL" name="website_url">
            <Input placeholder="Enter Website URL" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item label="Tags" name="tags">
            <Input placeholder="Enter tags (comma separated)" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item label="Notes" name="notes">
            <Input placeholder="Search in notes" />
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

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item label="Notifications" name="notify">
            <Checkbox.Group>
              <Row gutter={[8, 8]}>
                <Col>
                  <Checkbox value={true}>Enabled</Checkbox>
                </Col>
                <Col>
                  <Checkbox value={false}>Disabled</Checkbox>
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

export default AdvertiserSearchForm;