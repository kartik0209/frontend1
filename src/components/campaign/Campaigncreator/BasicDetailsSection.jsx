import React from "react";
import { Form, Input, Radio, Card, Row, Col, Select } from "antd";
import { objectiveOptions } from "../../../data/formOptions";
import { Editor } from '@tinymce/tinymce-react';
import apiClient from "../../../services/apiServices";

const { Option } = Select;
const { TextArea } = Input;

const BasicDetailsSection = ({ formState, updateFormState }) => {
  const [advertisers, setAdvertisers] = React.useState([]);
  const [loadingAdvertisers, setLoadingAdvertisers] = React.useState(false);

  React.useEffect(() => {
    const fetchAdvertisers = async () => {
      setLoadingAdvertisers(true);
      try {
        const response = await apiClient.post("/common/advertiser/list", {});
        if (response.data.data && response.data.success) {
          setAdvertisers(response.data.data || []);
        } else {
          throw new Error(response.data?.message || "Failed to fetch advertisers");
        }
      } catch (error) {
        console.error("Error fetching advertisers:", error);
        setAdvertisers([]);
      } finally {
        setLoadingAdvertisers(false);
      }
    };

    fetchAdvertisers();
  }, []);

  // Handler for advertiser selection
  const handleAdvertiserChange = (advertiserId) => {
    updateFormState({ advertiser_id: advertiserId });
  };

  // Handler for description editor
  const handleDescriptionChange = (content) => {
    updateFormState({ description: content });
  };

  return (
    <Card title="Basic Details" className="campaign-form__section">
      <Form.Item
        label="Advertiser"
        name="advertiser_id"
        rules={[{ required: true, message: "Please select an advertiser" }]}
      >
        <Select
          placeholder="Select advertiser"
          loading={loadingAdvertisers}
          showSearch
          optionFilterProp="children"
          value={formState.advertiser_id}
          onChange={handleAdvertiserChange}
        >
          {advertisers.map((adv) => (
            <Option key={adv.id} value={adv.id}>
              {adv.name}
            </Option>
          ))}
        </Select>
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
        <Input 
          placeholder="Campaign title"
          value={formState.title}
          onChange={(e) => updateFormState({ title: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Editor
          apiKey="swibzw2hr1s20zbox1ecdtfuu886owo62soin50w9uik0tkz"
          value={formState.description}
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
          onEditorChange={handleDescriptionChange}
        />
      </Form.Item>

      <Form.Item label="Preview URL" name="previewUrl">
        <Input 
          placeholder="Link to the preview landing page"
          value={formState.previewUrl}
          onChange={(e) => updateFormState({ previewUrl: e.target.value })}
        />
      </Form.Item>

      <Form.Item
        label="Default Campaign URL"
        name="defaultCampaignUrl"
        rules={[{ required: true, message: "Please enter campaign URL" }]}
      >
        <TextArea
          rows={3}
          placeholder="Example: https://example.com/click?advertiser_click_id={click_id}"
          value={formState.defaultCampaignUrl}
          onChange={(e) => updateFormState({ defaultCampaignUrl: e.target.value })}
        />
      </Form.Item>

      <Form.Item label="Default Landing Page Name" name="defaultLandingPageName">
        <Input 
          placeholder="Default"
          value={formState.defaultLandingPageName}
          onChange={(e) => updateFormState({ defaultLandingPageName: e.target.value })}
        />
      </Form.Item>
    </Card>
  );
};

export default BasicDetailsSection;