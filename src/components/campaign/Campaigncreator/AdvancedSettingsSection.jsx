import React from "react";
import { Form, Input, Switch, Select, InputNumber, Card, Row, Col, Tag, Button, Upload, message } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const AdvancedSettingsSection = ({ form, formState, updateFormState }) => {
  const addLanguage = () => {
    const newLang = form.getFieldValue("newLanguage");
    if (newLang && !formState.languages.includes(newLang)) {
      updateFormState({ languages: [...formState.languages, newLang] });
      form.setFieldValue("newLanguage", "");
    }
  };

  const removeLanguage = (langToRemove) => {
    const newLanguages = formState.languages.filter(lang => lang !== langToRemove);
    updateFormState({ languages: newLanguages });
  };

// Add this handler function in your AdvancedSettingsSection component:

// helper for Upload normalization
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


  return (
    <Card title="Advanced Settings" className="campaign-form__section">
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Select
              value={formState.status}
              onChange={(value) => updateFormState({ status: value })}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="paused">Paused</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Visibility" name="visibility">
            <Select
              value={formState.visibility}
              onChange={(value) => updateFormState({ visibility: value })}
            >
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Redirect Type" name="redirectType">
            <Select>
              <Option value="302">302 Redirect</Option>
              <Option value="301">301 Redirect</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Enable Deep Link">
            <Switch
              checked={formState.deepLink}
              onChange={(checked) => updateFormState({ deepLink: checked })}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Require Terms Acceptance">
            <Switch
              checked={formState.requireTerms}
              onChange={(checked) => updateFormState({ requireTerms: checked })}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Enable Duplicate Click Action">
        <Switch
          checked={formState.duplicateClickAction}
          onChange={(checked) => updateFormState({ duplicateClickAction: checked })}
        />
      </Form.Item>

      <Form.Item label="Unique Click Session Duration (hours)" name="uniqueClickSessionDuration">
        <InputNumber min={1} max={72} placeholder="12" style={{ width: "100%" }} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="App Name" name="appName">
            <Input placeholder="Enter app name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="App ID" name="appId">
            <Input placeholder="Enter app ID" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="ERID" name="erid">
            <Input placeholder="Enter ERID" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="External Offer ID" name="externalOfferId">
            <Input placeholder="Enter external offer ID" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Conversion Flow" name="conversionFlow">
        <TextArea rows={3} placeholder="Describe the conversion flow..." />
      </Form.Item>

      <Form.Item label="Languages">
        <div>
          {formState.languages.map((lang) => (
            <Tag
              key={lang}
              closable
              onClose={() => removeLanguage(lang)}
              style={{ marginBottom: 8 }}
            >
              {lang}
            </Tag>
          ))}
        </div>
        <Row gutter={8} style={{ marginTop: 8 }}>
          <Col flex="auto">
            <Form.Item name="newLanguage" style={{ margin: 0 }}>
              <Input placeholder="Add language" />
            </Form.Item>
          </Col>
          <Col>
            <Button
              type="dashed"
              onClick={addLanguage}
              icon={<PlusOutlined />}
            >
              Add
            </Button>
          </Col>
        </Row>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Unsubscribe URL" name="unsubscribeUrl">
            <Input placeholder="https://example.com/unsubscribe" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Suppression URL" name="suppressionUrl">
            <Input placeholder="https://example.com/suppression" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="KPI" name="kpi">
        <Input placeholder="Enter KPI details" />
      </Form.Item>
<Form.Item
  label="Thumbnail"
  name="thumbnail"
  valuePropName="fileList"
  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
  rules={[{ required: true, message: "Please upload a thumbnail" }]}
>
  <Upload
    accept="image/*"          // ✅ only image types
    maxCount={1}              // ✅ only one file at a time
    listType="picture"
    beforeUpload={(file) => {
      // ✅ validate type
      if (!file.type.startsWith("image/")) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      // ✅ validate size (5MB limit)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      // ✅ store latest file, replacing old one
      updateFormState({ thumbnailFile: file });
      return false; // prevent auto-upload
    }}
    onRemove={() => updateFormState({ thumbnailFile: null })}
  >
    <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
  </Upload>
</Form.Item>




 




      <Form.Item label="Terms and Conditions" name="termsConditions">
        <TextArea rows={4} placeholder="Enter terms and conditions..." />
      </Form.Item>

      <Form.Item label="Note" name="note">
        <TextArea rows={3} placeholder="Additional notes..." />
      </Form.Item>
    </Card>
  );
};

export default AdvancedSettingsSection;