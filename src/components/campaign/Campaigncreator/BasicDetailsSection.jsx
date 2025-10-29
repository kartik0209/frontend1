import React from "react";
import { Form, Input, Radio, Card, Row, Col, Select } from "antd";
import { objectiveOptions } from "../../../data/formOptions";
import { Editor } from "@tinymce/tinymce-react";
import apiClient from "../../../services/apiServices";
import { Modal, Button, Tag } from "antd";
const { Option } = Select;
const { TextArea } = Input;

const BasicDetailsSection = ({ form, formState, updateFormState }) => {
  const [advertisers, setAdvertisers] = React.useState([]);
  const [loadingAdvertisers, setLoadingAdvertisers] = React.useState(false);
  const [macroModalVisible, setMacroModalVisible] = React.useState(false);
  const textAreaRef = React.useRef(null);
  const allMacros = [
    { name: "{click_id}", description: "Unique ID of Click Event Recorded" },
    { name: "{camp_id}", description: "Short Id of Campaign" },
    {
      name: "{publisher_id}",
      description: "ID of Publisher who is running the Campaign",
    },
    { name: "{source}", description: "Sub Publisher ID" },
    { name: "{gaid}", description: "Google Advertising ID MACRO" },
    { name: "{idfa}", description: "Apple Identifier For Advertising" },
    { name: "{app_name}", description: "Get App name from tracking link" },
    { name: "{p1}", description: "Tracking Parameter 1" },
    { name: "{p2}", description: "Tracking Parameter 2" },
    { name: "{campaign_id}", description: "Long Hashed Id of Campaign" },
    { name: "{campaign_title}", description: "Title of Campaign" },
    {
      name: "{aff_name}",
      description: "Name of Publisher running the Campaign",
    },
    {
      name: "{aff_username}",
      description: "Username of Publisher running the Campaign",
    },
    { name: "{aff_id}", description: "Long Publisher Id (24 Characters)" },
    { name: "{affiliate_ref}", description: "Affiliate Reference ID" },
    { name: "{publisher_ref}", description: "Affiliate Reference ID" },
    { name: "{sub_source}", description: "Sub Source ID (iOS 14.5+ macro)" },
    { name: "{pub_camp_id}", description: "Pub Campaign Id (iOS 14.5+ macro)" },
    { name: "{pub_group_id}", description: "Publisher Group ID Macro" },
    {
      name: "{aff_chain}",
      description: "Use this macro to pass subids in the publisher postback",
    },
    { name: "{source_enc}", description: "Encoded Source Value" },
    { name: "{date_enc}", description: "Encoded Date macro" },
    { name: "{region}", description: "State/Region of the Click generated IP" },
    { name: "{city}", description: "City of the Click generated IP" },
    { name: "{conv_revenue}", description: "Revenue of the default goal" },
    {
      name: "{conv_rp_currency}",
      description: "Currency in which the revenue is reflected",
    },
    { name: "{adv_id}", description: "Long Advertiser ID" },
    { name: "{advertiser_id}", description: "Short advertiser ID" },
    { name: "{advertiser_ref}", description: "Advertiser Reference ID" },
    { name: "{advertiser_name}", description: "Advertiser Name" },
    {
      name: "{tdomain}",
      description: "Tracking domain on which the Campaign Runs",
    },
    { name: "{click_time}", description: "Timestamp for the Click Event" },
    { name: "{click_datetime}", description: "Date Time for the Click Event" },
    { name: "{android_id}", description: "Android Device ID Macro" },
    { name: "{app_id}", description: "Get App ID from tracking link" },
    {
      name: "{creative_name}",
      description: "Get the creative name in tracking link",
    },
    { name: "{p3}", description: "Tracking Parameter 3" },
    { name: "{p4}", description: "Tracking Parameter 4" },
    { name: "{p5}", description: "Tracking Parameter 5" },
    { name: "{p6}", description: "Tracking Parameter 6" },
    { name: "{p7}", description: "Tracking Parameter 7" },
    { name: "{p8}", description: "Tracking Parameter 8" },
    { name: "{p9}", description: "Tracking Parameter 9" },
    { name: "{p10}", description: "Tracking Parameter 10" },
    { name: "{random}", description: "7-15 Digit alpha-numeric id" },
    { name: "{random_10}", description: "Random number between 0 to 10" },
    { name: "{random_25}", description: "Random number between 0 to 25" },
    { name: "{random_50}", description: "Random number between 0 to 50" },
    { name: "{random_100}", description: "Random number between 0 to 100" },
  ];
  React.useEffect(() => {
    const fetchAdvertisers = async () => {
      setLoadingAdvertisers(true);
      try {
        const response = await apiClient.post("/common/advertiser/list", {});
        if (response.data.data && response.data.success) {
          setAdvertisers(response.data.data || []);
        } else {
          throw new Error(
            response.data?.message || "Failed to fetch advertisers"
          );
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

// Replace the handleMacroClick function
// Update handleMacroClick
const handleMacroClick = (macroName) => {
  const currentValue = formState.defaultCampaignUrl || "";
  const newUrl = currentValue + macroName;
  
  // Update both state and form field
  updateFormState({ defaultCampaignUrl: newUrl });
  form.setFieldsValue({ defaultCampaignUrl: newUrl });
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
                    <div className="radio-description">
                      {option.description}
                    </div>
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
        <TextArea
          rows={4}
          placeholder="Enter campaign description"
          value={formState.description}
          onChange={(e) => updateFormState({ description: e.target.value })}
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
  <Input.TextArea
    ref={textAreaRef}
    rows={3}
    placeholder="Example: https://example.com/click?advertiser_click_id={click_id}"
    value={formState.defaultCampaignUrl || ""}
    onChange={(e) => {
      updateFormState({ defaultCampaignUrl: e.target.value });
    }}
  />
</Form.Item>

      
      <div className="url-tokens-section" style={{ marginBottom: "16px" }}>
        <div style={{ marginBottom: "8px", fontWeight: "500" }}>
          Most Used URL tokens
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "8px",
          }}
        >
          {[
            "{click_id}",
            "{camp_id}",
            "{publisher_id}",
            "{source}",
            "{gaid}",
          ].map((token) => (
            <Tag
              key={token}
              style={{ cursor: "pointer" }}
              onClick={() => handleMacroClick(token)}
            >
              {token}
            </Tag>
          ))}
        </div>
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => setMacroModalVisible(true)}
        >
          see more
        </Button>
      </div>
      <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
        Debug - Current URL: "{formState.defaultCampaignUrl || "empty"}"
      </div>

      <Form.Item
        label="Default Landing Page Name"
        name="defaultLandingPageName"
      >
        <Input
          placeholder="Default"
          value={formState.defaultLandingPageName}
          onChange={(e) =>
            updateFormState({ defaultLandingPageName: e.target.value })
          }
        />
      </Form.Item>
      <Modal
        title="All URL Macros"
        open={macroModalVisible}
        onCancel={() => setMacroModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setMacroModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "8px",
            }}
          >
            {allMacros.map((macro) => (
              <div
                key={macro.name}
                style={{
                  padding: "8px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                onClick={() => handleMacroClick(macro.name)}
              >
                <div style={{ fontWeight: "500", color: "#1890ff" }}>
                  {macro.name}
                </div>
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  {macro.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default BasicDetailsSection;
