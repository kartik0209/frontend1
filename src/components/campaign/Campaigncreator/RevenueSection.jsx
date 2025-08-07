import React from "react";
import {
  Form,
  Select as AntSelect,
  InputNumber,
  Input,
  Card,
  Row,
  Col,
  Radio,
} from "antd";
import Select from "react-select";
// utils/countries.js
import countries from "world-countries";

import currencyCodes from "currency-codes";

// Map the data to AntD Select options
const currencyOptions = currencyCodes.data.map((currency) => ({
  code: currency.code,
  label: `${currency.code} - ${currency.currency}`,
}));


const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: `${country.flag} ${country.name.common}`,
}));

const { Option } = AntSelect;

const RevenueSection = ({ formState, updateFormState }) => {
  return (
    <Card title="Revenue and Payout" className="campaign-form__section">


     <Form.Item
        label="Geo Coverage"
        name="geoCoverage"
        style={{ marginBottom: 24 }}
      >
        <div className="react-select-container">
          <Select
            isMulti
            options={countryOptions}
            placeholder="Search and select countries"
            onChange={(selectedOptions) => {
              const codes = selectedOptions?.map((opt) => opt.value) || [];
              updateFormState({ geoCoverage: codes });
            }}
            value={countryOptions.filter((opt) =>
              (formState.geoCoverage || []).includes(opt.value)
            )}
            classNamePrefix="react-select"
          />
        </div>
      </Form.Item>

      <Form.Item label="Type" name="revenueType">
        <Radio.Group
          value={formState.revenueType}
          onChange={(e) => updateFormState({ revenueType: e.target.value })}
        >
          <Radio value="fixed">
            <div>
              <div className="radio-title">Fixed</div>
              <div className="radio-description">Fixed revenue and payout</div>
            </div>
          </Radio>
          <Radio value="revshare">
            <div>
              <div className="radio-title">Revshare</div>
              <div className="radio-description">Revenue share percentage</div>
            </div>
          </Radio>
          <Radio value="hybrid">
            <div>
              <div className="radio-title">Hybrid</div>
              <div className="radio-description">
                Fixed + Revenue share combination
              </div>
            </div>
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
        <Form.Item
  label="Currency"
  name="currency"
  rules={[{ required: true, message: "Please select currency" }]}
>
  <AntSelect placeholder="Select currency" showSearch optionFilterProp="label">
    {currencyOptions.map((curr) => (
      <Option key={curr.code} value={curr.code} label={curr.label}>
        {curr.label}
      </Option>
    ))}
  </AntSelect>
</Form.Item>

        </Col>
        <Col span={16}>
          <Form.Item label="Default Goal Name" name="defaultGoalName">
            <Input placeholder="Example: Install" />
          </Form.Item>
        </Col>
      </Row>


      

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Revenue"
            name="revenue"
            rules={[{ required: true, message: "Please enter revenue" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Revenue Eg: 5"
              min={0}
              step={0.01}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Payout"
            name="payout"
            rules={[{ required: true, message: "Please enter payout" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Payout Eg: 2"
              min={0}
              step={0.01}
            />
          </Form.Item>
        </Col>
      </Row>

     
    </Card>
  );
};

export default RevenueSection;
