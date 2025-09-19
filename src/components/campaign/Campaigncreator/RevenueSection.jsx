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

  
// Add this logic to determine if sale objective is selected
const isSaleObjective = formState.objective === 'sale';
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
      label={isSaleObjective ? "Revenue (%)" : "Revenue"}
      name="revenue"
      rules={[{ required: true, message: "Please enter revenue" }]}
    >
      <InputNumber
        style={{ width: "100%" }}
        placeholder={isSaleObjective ? "Revenue % Eg: 50" : "Revenue Eg: 5"}
        min={0}
        max={isSaleObjective ? 100 : undefined}
        step={0.01}
        suffix={isSaleObjective ? "%" : undefined}
        value={formState.revenue}
        onChange={(value) => updateFormState({ revenue: value })}
      />
    </Form.Item>
  </Col>
  <Col span={12}>
    <Form.Item
      label={isSaleObjective ? "Payout (%)" : "Payout"}
      name="payout"
      rules={[{ required: true, message: "Please enter payout" }]}
    >
      <InputNumber
        style={{ width: "100%" }}
        placeholder={isSaleObjective ? "Payout % Eg: 25" : "Payout Eg: 2"}
        min={0}
        max={isSaleObjective ? 100 : undefined}
        step={0.01}
        suffix={isSaleObjective ? "%" : undefined}
        value={formState.payout}
        onChange={(value) => updateFormState({ payout: value })}
      />
    </Form.Item>
  </Col>
</Row>

{isSaleObjective && (formState.revenue || 0) + (formState.payout || 0) > 100 && (
  <div style={{ 
    color: '#ff4d4f', 
    fontSize: '14px', 
    marginTop: '-16px', 
    marginBottom: '16px',
    textAlign: 'center'
  }}>
    Warning: Revenue + Payout cannot exceed 100%
  </div>
)}
     
    </Card>
  );
};

export default RevenueSection;
