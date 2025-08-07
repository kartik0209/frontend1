import React from "react";
import { Form, Input, Radio, Card, Row, Col } from "antd";
import { objectiveOptions } from "../../../data/formOptions";
import { Editor } from '@tinymce/tinymce-react';

const { TextArea } = Input;

const BasicDetailsSection = ({ formState, updateFormState }) => {
  return (
    <Card title="Basic Details" className="campaign-form__section">
      <Form.Item
        label="Company ID"
        name="companyId"
        rules={[{ required: true, message: "Please enter Company ID" }]}
      >
        <Input placeholder="Enter Company ID" />
      </Form.Item>

      <Form.Item
        label="Choose an Objective"
        name="objective"
        rules={[{ required: true, message: "Please select an objective" }]}
      >
        <Radio.Group
          value={formState.objective}
          onChange={(e) => updateFormState({ objective: e.target.value })}
          className="campaign-form__objective-group"
        >
          <Row gutter={[16, 16]}>
            {objectiveOptions.map((option) => (
              <Col span={8} key={option.value}>
                <Radio
                  value={option.value}
                  className="campaign-form__objective-radio"
                >
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

      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please enter campaign title" }]}
      >
        <Input placeholder="Campaign title" />
      </Form.Item>

      <Form.Item label="Description" name="description">
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

      <Form.Item label="Preview URL" name="previewUrl">
        <Input placeholder="Link to the preview landing page" />
      </Form.Item>

      <Form.Item
        label="Default Campaign URL"
        name="defaultCampaignUrl"
        rules={[{ required: true, message: "Please enter campaign URL" }]}
      >
        <TextArea
          rows={3}
          placeholder="Example: https://example.com/click?advertiser_click_id={click_id}"
        />
      </Form.Item>

      <Form.Item label="Default Landing Page Name" name="defaultLandingPageName">
        <Input placeholder="Default" />
      </Form.Item>
    </Card>
  );
};

export default BasicDetailsSection;