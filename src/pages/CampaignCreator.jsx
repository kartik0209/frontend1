import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Radio,
  Switch,
  Button,
  Upload,
  DatePicker,
  InputNumber,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  message,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import "../styles/CampaignCreator.scss";
import apiclient from "../services/apiServices"

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CampaignForm = () => {
  const [form] = Form.useForm();
  const [objective, setObjective] = useState("conversions");
  const [conversionTracking, setConversionTracking] = useState("server_postback");
  const [revenueType, setRevenueType] = useState("fixed");
  const [status, setStatus] = useState("active");
  const [visibility, setVisibility] = useState("public");
  const [enableTimeTargeting, setEnableTimeTargeting] = useState(false);
  const [enableScheduleStatus, setEnableScheduleStatus] = useState(false);
  const [duplicateClickAction, setDuplicateClickAction] = useState(false);
  const [requireTerms, setRequireTerms] = useState(false);
  const [deepLink, setDeepLink] = useState(true);
  const [languages, setLanguages] = useState(["English"]);
  const [loading, setLoading] = useState(false);

  const objectiveOptions = [
    {
      value: "conversions",
      label: "Conversions",
      description: "Let the advertiser to make available for the conversion goal",
    },
    {
      value: "sale",
      label: "Sale",
      description: "When the aim is to sell or make money",
    },
    {
      value: "app_installs",
      label: "App Installs",
      description: "When you are targeting to get campaigns default goal",
    },
    {
      value: "leads",
      label: "Leads",
      description: "The leads generation campaign",
    },
    {
      value: "impressions",
      label: "Impressions",
      description: "Impression based on impressions",
    },
    {
      value: "clicks",
      label: "Clicks",
      description: "When the pay-per-click campaign",
    },
  ];

  const conversionTrackingOptions = [
    {
      value: "server_postback",
      label: "Server Postback",
      description: "Server to server integration",
    },
    {
      value: "web_sdk",
      label: "Web SDK", 
      description: "Javascript less method for integrating with direct website and GTM",
    },
    {
      value: "iframe_pixel",
      label: "Iframe Pixel",
      description: "Traditional pixel for direct placement on a website or gtm",
    },
    {
      value: "image_pixel",
      label: "Image Pixel",
      description: "Simple pixel for direct placement on a website or gtm",
    },
  ];


const handleFinish = async (values) => {
  try {
    setLoading(true);
    
    // Helper function to validate URLs
    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    // Build payload matching the working Postman structure
    const payload = {
      company_id: parseInt(values.companyId) || 1,
      objective: values.objective || "conversions",
      title: values.title || "Default Campaign",
      description: values.description || "",
      preview_url: values.previewUrl && isValidUrl(values.previewUrl) ? values.previewUrl : undefined,
      defaultCampaignUrl: values.defaultCampaignUrl && isValidUrl(values.defaultCampaignUrl) ? values.defaultCampaignUrl : undefined,
      defaultLandingPageName: values.defaultLandingPageName || "Default",
      enableTimeTargeting: Boolean(enableTimeTargeting),
      timezone: values.timezone || "GMT+05:30",
      startHour: parseInt(values.startHour) || 0,
      endHour: parseInt(values.endHour) || 23,
      enableInactiveHours: false,
      activeDays: Array.isArray(values.targetingDays) ? values.targetingDays : [],
      uniqueClickSessionDuration: parseInt(values.uniqueClickSessionDuration) || 12,
      enableDuplicateClickAction: Boolean(duplicateClickAction),
      duplicateClickAction: duplicateClickAction ? "redirect_to_url" : "",
      enableCampaignSchedule: Boolean(values.enableCampaignSchedule),
      campaignStartDate: values.campaignStartDate ? values.campaignStartDate.toISOString() : "",
      campaignEndDate: values.campaignEndDate ? values.campaignEndDate.toISOString() : "",
      campaignStatus: values.campaignStatus || "active",
      enableScheduleStatusChange: Boolean(enableScheduleStatus),
      statusToBeSet: values.statusToSet || "",
      scheduleDate: values.scheduleDate ? values.scheduleDate.toISOString() : "",
      enablePublisherEmailNotify: Boolean(values.publisherNotifyManual),
      publisherNotifyTime: values.publisherNotifyTime ? values.publisherNotifyTime.toISOString() : "",
      appName: values.appName || "",
      appId: values.appId || "",
      erid: values.erid || "",
      conversionFlow: values.conversionFlow || "",
      conversionFlowLanguages: Array.isArray(values.conversionFlowLanguages) ? values.conversionFlowLanguages : ["en"],
      unsubscribeUrl: values.unsubscribeUrl && isValidUrl(values.unsubscribeUrl) ? values.unsubscribeUrl : undefined,
      suppressionUrl: values.suppressionUrl && isValidUrl(values.suppressionUrl) ? values.suppressionUrl : undefined,
      enableDeepLink: Boolean(deepLink),
      conversionHoldPeriod: parseInt(values.conversionHoldPeriod) || 0,
      conversionStatusAfterHold: values.conversionStatusAfterHold || "approved",
      revenueModel: values.revenueModel || "fixed",
      currency: values.currency || "USD",
      defaultGoalName: values.defaultGoalName || "Conversion",
      revenue: parseFloat(values.revenue) || 0,
      payout: parseFloat(values.payout) || 0,
      geoCoverage: Array.isArray(values.geoCoverage) ? values.geoCoverage : ["ALL"],
      category: Array.isArray(values.category) ? values.category : (values.category ? [values.category] : []),
      devices: Array.isArray(values.devices) ? values.devices : (values.devices ? [values.devices] : ["ALL"]),
      operatingSystem: Array.isArray(values.operatingSystem) ? values.operatingSystem : (values.operatingSystem ? [values.operatingSystem] : ["ALL"]),
      carrierTargeting: Array.isArray(values.carrierTargeting) ? values.carrierTargeting : (values.carrierTargeting ? [values.carrierTargeting] : []),
      allowedTrafficChannels: Array.isArray(values.allowedTrafficChannels) ? values.allowedTrafficChannels : (values.allowedTrafficChannels ? [values.allowedTrafficChannels] : []),
      note: values.note || "",
      termsAndConditions: values.termsConditions || "",
      requireTermsAcceptance: Boolean(requireTerms),
      conversionTracking: values.conversionTracking || "server_postback",
      primaryTrackingDomain: values.primaryTrackingDomain || undefined,
      status: values.status || "active",
      redirectType: values.redirectType || "302",
      visibility: values.visibility || "public",
      kpi: values.kpi || "",
      externalOfferId: values.externalOfferId || "",
      thumbnail: values.thumbnail || "",
      trackingDomain: values.primaryTrackingDomain || undefined,
      trackingSlug: values.title ? values.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : "default-campaign"
    };

    // Remove empty strings, null values, and undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => {
        if (value === "" || value === null || value === undefined) return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );

    console.log("Clean payload before API call:", cleanPayload);
    
    const response = await apiclient.post("/admin/campaign", cleanPayload);
    
    console.log("response", response);

    if (response.status === 200 || response.status === 201) {
      message.success("Campaign created successfully!");
      form.resetFields();
      // Reset state variables if needed
      setEnableTimeTargeting(false);
      setDuplicateClickAction(false);
      setEnableScheduleStatus(false);
      setDeepLink(false);
      setRequireTerms(false);
    } else {
      throw new Error(`API returned status: ${response.status}`);
    }
  } catch (error) {
    console.error("API Error:", error);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    
    // Better error handling
    let errorMessage = "Error creating campaign";
    
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      // Handle validation errors array
      const validationErrors = error.response.data.errors.map(err => 
        typeof err === 'string' ? err : err.message || JSON.stringify(err)
      ).join(', ');
      errorMessage = `Validation errors: ${validationErrors}`;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data) {
      errorMessage = JSON.stringify(error.response.data);
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    message.error(errorMessage);
  } finally {
    setLoading(false);
  }
};



  const addLanguage = () => {
    const newLang = form.getFieldValue("newLanguage");
    if (newLang && !languages.includes(newLang)) {
      setLanguages([...languages, newLang]);
      form.setFieldValue("newLanguage", "");
    }
  };

  const removeLanguage = (langToRemove) => {
    setLanguages(languages.filter((lang) => lang !== langToRemove));
  };

  return (
    <div className="campaign-form">
      <Card className="campaign-form__container">
        <Title level={2} className="campaign-form__title">Create Campaign</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="campaign-form__form"
          initialValues={{
            objective: "conversions",
            conversionTracking: "server_postback",
            revenueType: "fixed",
            status: "active",
            visibility: "public",
            redirectType: "302",
            currency: "INR",
            revenue: 5,
            payout: 2,
            defaultLandingPageName: "Default",
            deepLink: true,
            conversionStatus: "approved",
            devices: ["ALL"],
            operatingSystem: "ALL",
            geoCoverage: ["ALL"],
          }}
        >
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
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="campaign-form__objective-group"
              >
                <Row gutter={[16, 16]}>
                  {objectiveOptions.map((option) => (
                    <Col span={8} key={option.value}>
                      <Radio value={option.value} className="campaign-form__objective-radio">
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
              <TextArea rows={4} placeholder="Enter campaign description..." />
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

          <Card title="Conversion Tracking" className="campaign-form__section">
            <Form.Item
              label="Conversion Tracking"
              name="conversionTracking"
              rules={[{ required: true, message: "Please select conversion tracking method" }]}
            >
              <Radio.Group
                value={conversionTracking}
                onChange={(e) => setConversionTracking(e.target.value)}
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
              <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)}>
                <Radio value="active">
                  <div>
                    <div className="radio-title">Active</div>
                    <div className="radio-description">Campaign is active and can redirect live traffic</div>
                  </div>
                </Radio>
                <Radio value="pending">
                  <div>
                    <div className="radio-title">Pending</div>
                    <div className="radio-description">Campaign is not ready for live traffic</div>
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
              <Radio.Group value={visibility} onChange={(e) => setVisibility(e.target.value)}>
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

          <Card title="Revenue and Payout" className="campaign-form__section">
            <Form.Item label="Type" name="revenueType">
              <Radio.Group value={revenueType} onChange={(e) => setRevenueType(e.target.value)}>
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
                    <div className="radio-description">Fixed + Revenue share combination</div>
                  </div>
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Currency" name="currency" rules={[{ required: true }]}>
                  <Select>
                    <Option value="INR">₹ INR</Option>
                    <Option value="USD">$ USD</Option>
                    <Option value="EUR">€ EUR</Option>
                  </Select>
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

            <Form.Item label="Geo Coverage" name="geoCoverage">
              <Select mode="tags" placeholder="Type here to search">
                <Option value="ALL">ALL</Option>
                <Option value="IN">India</Option>
                <Option value="US">United States</Option>
                <Option value="UK">United Kingdom</Option>
              </Select>
            </Form.Item>
          </Card>

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
              <TextArea rows={4} placeholder="Enter KPI details..." />
            </Form.Item>

            <Form.Item label="Note" name="note">
              <TextArea rows={3} placeholder="Internal campaign notes..." />
            </Form.Item>

            <Form.Item label="Terms and Conditions" name="termsConditions">
              <TextArea rows={3} placeholder="Campaign terms and conditions..." />
            </Form.Item>

            <Form.Item label="Require Terms Acceptance" name="requireTerms">
              <Switch
                checked={requireTerms}
                onChange={setRequireTerms}
                checkedChildren="Required"
                unCheckedChildren="Optional"
              />
            </Form.Item>
          </Card>

          <Card title="Advanced Settings" className="campaign-form__section">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="External Offer ID" name="externalOfferId">
                  <Input placeholder="External offer or campaign ID" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Thumbnail" name="thumbnail">
                  <Upload>
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                  <Text type="secondary">Add image of size 150px x 150px</Text>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="App Name" name="appName">
                  <Input placeholder="Eg: com.whatsapp" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="App ID" name="appId">
                  <Input placeholder="Eg: id310633997" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="ERID" name="erid">
              <Input placeholder="Eg: 1RT456XX" />
              <Text type="secondary">ERID is required when running Russia GEO campaigns.</Text>
            </Form.Item>

            <Form.Item label="Conversion Flow" name="conversionFlow">
              <TextArea rows={2} placeholder="Describe conversion flow..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Unsubscribe URL" name="unsubscribeUrl">
                  <Input placeholder="Will be used in email creatives" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Suppression URL" name="suppressionUrl">
                  <Input placeholder="URL for suppression list download" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Deep Link" name="deepLink">
                  <Select value={deepLink} onChange={setDeepLink}>
                    <Option value={true}>Enabled</Option>
                    <Option value={false}>Disabled</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Conversion Hold Period" name="conversionHoldPeriod">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Hold period in hours"
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Conversion Status After Hold Period" name="conversionStatus">
              <Select>
                <Option value="approved">Approved</Option>
                <Option value="pending">Pending</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Duplicate Click Action" name="duplicateClickAction">
              <Switch
                checked={duplicateClickAction}
                onChange={setDuplicateClickAction}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Block repeated clicks based on session period
              </Text>
            </Form.Item>
          </Card>

          <Card title="Time Targeting" className="campaign-form__section">
            <Form.Item label="Enable Time Targeting" name="enableTimeTargeting">
              <Switch
                checked={enableTimeTargeting}
                onChange={setEnableTimeTargeting}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Campaign active/pause at specific time of day
              </Text>
            </Form.Item>

            {enableTimeTargeting && (
              <>
                <Form.Item label="Timezone" name="timezone">
                  <Select placeholder="Select timezone">
                    <Option value="GMT+05:30">(GMT+05:30) India Standard Time</Option>
                    <Option value="GMT+00:00">(GMT+00:00) London, Dublin</Option>
                    <Option value="GMT-05:00">(GMT-05:00) New York</Option>
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Start Hour (24 Hour format)" name="startHour">
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        min={0}
                        max={23}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="End Hour (24 Hour format)" name="endHour">
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="0"
                        min={0}
                        max={23}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Days" name="targetingDays">
                  <Select mode="multiple" placeholder="Select days">
                    <Option value="monday">Monday</Option>
                    <Option value="tuesday">Tuesday</Option>
                    <Option value="wednesday">Wednesday</Option>
                    <Option value="thursday">Thursday</Option>
                    <Option value="friday">Friday</Option>
                    <Option value="saturday">Saturday</Option>
                    <Option value="sunday">Sunday</Option>
                  </Select>
                </Form.Item>
              </>
            )}
          </Card>

          <Card title="Schedule Status Change" className="campaign-form__section">
            <Form.Item label="Schedule Status Change" name="scheduleStatusChange">
              <Switch
                checked={enableScheduleStatus}
                onChange={setEnableScheduleStatus}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Update campaign status at specific time and date
              </Text>
            </Form.Item>

            {enableScheduleStatus && (
              <>
                <Form.Item label="Status to be set" name="statusToSet">
                  <Select placeholder="Active">
                    <Option value="active">Active</Option>
                    <Option value="paused">Paused</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Schedule Date" name="scheduleDate">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select date and time"
                  />
                </Form.Item>

                <Form.Item label="Publisher Email Notify" name="publisherNotifyManual">
                  <Switch />
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Notify publishers about status change
                  </Text>
                </Form.Item>

                <Form.Item label="Publisher Notify Time" name="publisherNotifyTime">
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Select notification time"
                  />
                </Form.Item>
              </>
            )}
          </Card>

          <Form.Item className="campaign-form__submit">
            <Space>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                Create Campaign
              </Button>
              <Button size="large" onClick={() => form.resetFields()}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CampaignForm;