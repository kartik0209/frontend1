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
          <Form.Item label="Full Name" name="full_name">
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
          <Form.Item label="Reference ID" name="reference_id">
            <Input placeholder="Enter Reference ID" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Account Manager" name="account_manager">
            <Input placeholder="Enter Account Manager" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
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