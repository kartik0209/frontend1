import React from "react";
import { Form, Row, Col, Input, Select, InputNumber, Button, Space } from "antd";

const { Option } = Select;

const SearchForm = ({ form, onFinish, onClear, onClose, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="search-form"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Campaign ID" name="campaignId">
            <Input placeholder="Enter campaign id" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Title" name="title">
            <Input placeholder="Enter campaign Title" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Category" name="category">
            <Select placeholder="Select Category">
              <Option value="ecommerce">E-commerce</Option>
              <Option value="education">Education</Option>
              <Option value="finance">Finance</Option>
              <Option value="insurance">Insurance</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Advertiser" name="advertiser">
            <Select placeholder="Select Advertiser">
              <Option value="cuelinks">Cuelinks</Option>
              <Option value="edureka">Edureka</Option>
              <Option value="paysale">Paysale</Option>
              <Option value="dynu">Dynu In Media</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Advertiser Manager" name="advertiserManager">
            <Select placeholder="Select Advertiser Manager">
              <Option value="manager1">Manager 1</Option>
              <Option value="manager2">Manager 2</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Objective" name="objective">
            <Select placeholder="Objective">
              <Option value="cps">CPS</Option>
              <Option value="cpl">CPL</Option>
              <Option value="cpa">CPA</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Status" name="status">
            <Select placeholder="Select Campaign Status">
              <Option value="active">Active</Option>
              <Option value="paused">Paused</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Geo" name="geo">
            <Select placeholder="Select GEO/Country">
              <Option value="in">India</Option>
              <Option value="us">United States</Option>
              <Option value="uk">United Kingdom</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Visibility" name="visibility">
            <Select placeholder="Campaign visibility">
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
              <Option value="ask_permission">Ask Permission</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Device" name="device">
            <Select placeholder="Select Device Type">
              <Option value="mobile">Mobile</Option>
              <Option value="desktop">Desktop</Option>
              <Option value="tablet">Tablet</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="App ID/Package Name" name="appId">
            <Input placeholder="Enter App ID/Package Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="App Name" name="appName">
            <Input placeholder="Enter App Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="External Offer ID" name="externalOfferId">
            <Input placeholder="Enter External Offer ID" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Min Payout" name="minPayout">
            <InputNumber
              placeholder="Enter min payout in INR"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Max Payout" name="maxPayout">
            <InputNumber
              placeholder="Enter max payout in INR"
              style={{ width: "100%" }}
            />
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

export default SearchForm;