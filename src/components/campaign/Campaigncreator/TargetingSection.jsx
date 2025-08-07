import React from "react";
import { Form, Select, Card, Row, Col, Input, Switch, Typography } from "antd";
import { Editor } from '@tinymce/tinymce-react';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const TargetingSection = ({ formState, updateFormState }) => {
  return (
    <Card title="Targeting" className="campaign-form__section">
      <Form.Item label="Category" name="category">
        <Input placeholder="Add Categories" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Devices" name="devices">
            <Select mode="tags" placeholder="ALL">
              <Option value="ALL">ALL</Option>
              <Option value="mobile">Mobile</Option>
              <Option value="desktop">Desktop</Option>
              <Option value="tablet">Tablet</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Operating System" name="operatingSystem">
            <Select placeholder="ALL">
              <Option value="ALL">ALL</Option>
              <Option value="iOS">iOS</Option>
              <Option value="Android">Android</Option>
              <Option value="Windows">Windows</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Carrier Targeting" name="carrierTargeting">
        <Input placeholder="Search ISPs" />
      </Form.Item>

      <Form.Item label="Allowed Traffic Channels" name="allowedTrafficChannels">
        <Input placeholder="Add traffic channels" />
      </Form.Item>

      <Form.Item label="KPI" name="kpi">
         <Editor
              apiKey="swibzw2hr1s20zbox1ecdtfuu886owo62soin50w9uik0tkz"
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={(content, editor) => onChange(content)}
              placeholder="Enter campaign description..."
            />
      </Form.Item>

      <Form.Item label="Note" name="note">
        <TextArea rows={3} placeholder="Internal campaign notes..." />
      </Form.Item>

      <Form.Item label="Terms and Conditions" name="termsConditions">
        <TextArea rows={3} placeholder="Campaign terms and conditions..." />
      </Form.Item>

      <Form.Item label="Require Terms Acceptance" name="requireTerms">
        <Switch
          checked={formState.requireTerms}
          onChange={(checked) => updateFormState({ requireTerms: checked })}
          checkedChildren="Required"
          unCheckedChildren="Optional"
        />
      </Form.Item>
    </Card>
  );
};

export default TargetingSection;