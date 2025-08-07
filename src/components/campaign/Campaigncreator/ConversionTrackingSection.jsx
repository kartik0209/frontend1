import React from "react";
import { Form, Input, Radio, Card, Row, Col, Select } from "antd";
import { conversionTrackingOptions } from "../../../data/formOptions"; // Adjust the import path as necessary

const { Option } = Select;

const ConversionTrackingSection = ({ formState, updateFormState }) => {
  return (
    <Card title="Conversion Tracking" className="campaign-form__section">
      <Form.Item
        label="Conversion Tracking"
        name="conversionTracking"
        rules={[{
          required: true,
          message: "Please select conversion tracking method",
        }]}
      >
        <Radio.Group
          value={formState.conversionTracking}
          onChange={(e) => updateFormState({ conversionTracking: e.target.value })}
          className="campaign-form__conversion-group"
        >
          <Row gutter={[16, 16]}>
            {conversionTrackingOptions.map((option) => (
              <Col span={12} key={option.value}>
                <Radio value={option.value}>
                  <div>
                    <div className="radio-title">{option.label}</div>
                    <div className="radio-description">{option.description}</div>
                  </div>
                </Radio>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="Primary Tracking Domain" name="primaryTrackingDomain">
        <Select placeholder="Choose any domain as the default">
          <Option value="">-- Select Domain --</Option>
        </Select>
      </Form.Item>

     <Form.Item label="Status" name="status" rules={[{ required: true }]}>
  <Radio.Group
    value={formState.status}
    onChange={(e) => updateFormState({ status: e.target.value })}
    style={{ display: 'flex', gap: '24px' }} // <-- Makes items display inline with spacing
  >
    <Radio value="active">
      <div>
        <div className="radio-title">Active</div>
        <div className="radio-description">
          Campaign is active and can redirect live traffic
        </div>
      </div>
    </Radio>

    <Radio value="pending">
      <div>
        <div className="radio-title">Pending</div>
        <div className="radio-description">
          Campaign is not ready for live traffic
        </div>
      </div>
    </Radio>

    <Radio value="paused">
      <div>
        <div className="radio-title">Paused</div>
        <div className="radio-description">Campaign is paused</div>
      </div>
    </Radio>
  </Radio.Group>
</Form.Item>


      <Form.Item label="Redirect Type" name="redirectType" rules={[{ required: true }]}>
        <Select>
          <Option value="302">302</Option>
          <Option value="301">301</Option>
        </Select>
      </Form.Item>

    <Form.Item label="Visibility" name="visibility">
  <Radio.Group
    value={formState.visibility}
    onChange={(e) => updateFormState({ visibility: e.target.value })}
    style={{ display: 'flex', gap: '24px' }} // makes items inline with spacing
  >
    <Radio value="public">
      <div>
        <div className="radio-title">Public</div>
        <div className="radio-description">Visible to all publishers</div>
      </div>
    </Radio>

    <Radio value="private">
      <div>
        <div className="radio-title">Private</div>
        <div className="radio-description">Only assigned publishers can view</div>
      </div>
    </Radio>

    <Radio value="ask_permission">
      <div>
        <div className="radio-title">Ask for Permission</div>
        <div className="radio-description">Publishers must request access</div>
      </div>
    </Radio>
  </Radio.Group>
</Form.Item>

    </Card>
  );
};

export default ConversionTrackingSection;