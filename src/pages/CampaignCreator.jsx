import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  Button,
  Card,
  Row,
  Col,
  DatePicker,
  TimePicker,
  InputNumber,
  Switch,
  Divider,
  Space,
  Typography,
  Alert,
  Upload,
  Tag
} from 'antd';
import {
  Plus,
  Info,
  Upload as UploadIcon,
  Trash2
} from 'lucide-react';
import '../styles/CampaignCreator.scss';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CampaignCreator = () => {
  const [form] = Form.useForm();
  const [selectedObjective, setSelectedObjective] = useState('conversions');
  const [enableTimeTargeting, setEnableTimeTargeting] = useState(false);
  const [enableScheduleChange, setEnableScheduleChange] = useState(false);
  const [revenueModel, setRevenueModel] = useState('fixed');

  const objectives = [
    { key: 'conversions', label: 'Conversions', desc: 'Track conversions available for development goal' },
    { key: 'sale', label: 'Sale', desc: 'Track sales, or purchase' },
    { key: 'app_installs', label: 'App Installs', desc: 'Track all the campaigns default goal' },
    { key: 'leads', label: 'Leads', desc: 'For lead generation campaign' },
    { key: 'impressions', label: 'Impressions', desc: 'For campaigns based on impressions' },
    { key: 'clicks', label: 'Clicks', desc: 'Offer by pay-per-click campaigns' }
  ];

  const trackingMethods = [
    { key: 'server_postback', label: 'Server Postback', desc: 'Server to server integration' },
    { key: 'iframe_pixel', label: 'IFrame Pixel', desc: 'Traditional pixel for direct placement on a website or glm' },
    { key: 'web_sdk', label: 'Web SDK', desc: 'JavaScript based method for integrating with direct websites and GTM' },
    { key: 'image_pixel', label: 'Image Pixel', desc: 'Simple pixel for direct placement on a website or glm' }
  ];

  const handleSubmit = (values) => {
    console.log('Campaign Data:', values);
    // Handle form submission
  };

  return (
    <div className="campaign-creator">
      <div className="campaign-creator__header">
        <Title level={2}>Create Campaign</Title>
        
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="campaign-form"
        initialValues={{
          status: 'active',
          visibility: 'public',
          redirect_type: '302',
          tracking_method: 'server_postback',
          revenue_model: 'fixed',
          currency: 'USD',
          devices: ['all'],
          operating_system: 'all'
        }}
      >
        {/* Campaign Objective */}
        <Card className="form-section" title="Campaign Objective">
          <Form.Item
            name="objective"
            label="Choose an Objective"
            rules={[{ required: true, message: 'Please select an objective' }]}
          >
            <Radio.Group
              className="objective-grid"
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
            >
              {objectives.map(obj => (
                <Radio.Button key={obj.key} value={obj.key} className="objective-card">
                  <div className="objective-content">
                    <strong>{obj.label}</strong>
                    <Text type="secondary" className="objective-desc">{obj.desc}</Text>
                  </div>
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Card>

        {/* Advertiser Details */}
        <Card className="form-section" title="Advertiser Details">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="advertiser"
                label="Advertiser"
                rules={[{ required: true, message: 'Please select advertiser' }]}
              >
                <Select placeholder="[ID-5] PT Interspace Indonesia">
                  <Option value="interspace">PT Interspace Indonesia</Option>
                  <Option value="other">Other Advertiser</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item
                name="title"
                label="Campaign Title"
                rules={[{ required: true, message: 'Please enter campaign title' }]}
              >
                <Input placeholder="Campaign title" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description (Optional)">
            <TextArea
              rows={4}
              placeholder="Define key performance metrics (KPIs) that are crucial for the campaign to be delivered by the publisher, such as CR > 2.0%"
            />
          </Form.Item>
        </Card>

        {/* Landing Pages & URLs */}
        <Card className="form-section" title="Landing Pages & URLs">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item name="preview_url" label="Preview URL">
                <Input placeholder="Link to the preview landing page, where it is accessible for publishers to view" />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="default_landing_page" label="Default Landing Page Name">
                <Input placeholder="Default" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="default_campaign_url"
            label="Default Campaign URL"
            rules={[{ required: true, message: 'Please enter campaign URL' }]}
          >
            <TextArea
              rows={3}
              placeholder="Include the tracking URL provided by your advertiser where traffic will redirect to"
            />
          </Form.Item>

          <div className="url-tokens">
            <Text type="secondary">Most Used URL tokens:</Text>
            <Space wrap className="token-tags">
              {['{click_id}', '{camp_id}', '{publisher_id}', '{source}', '{gaid}', '{idfa}', '{app_name}', '{p1}', '{p2}'].map(token => (
                <Tag key={token} className="url-token">{token}</Tag>
              ))}
            </Space>
          </div>
        </Card>

        {/* Conversion Tracking */}
        <Card className="form-section" title="Conversion Tracking">
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item
                name="tracking_method"
                label="Conversion Tracking Method"
                rules={[{ required: true, message: 'Please select tracking method' }]}
              >
                <Radio.Group className="tracking-methods">
                  {trackingMethods.map(method => (
                    <Radio key={method.key} value={method.key} className="tracking-method">
                      <div>
                        <strong>{method.label}</strong>
                        <br />
                        <Text type="secondary">{method.desc}</Text>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="tracking_domain" label="Primary Tracking Domain (Optional)">
                <Select placeholder="Choose any domain as the default for the campaign tracking">
                  <Option value="domain1">tracking.example.com</Option>
                  <Option value="domain2">analytics.example.com</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Campaign Status & Visibility */}
        <Card className="form-section" title="Campaign Status & Visibility">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="status" label="Status">
                <Radio.Group>
                  <Radio value="active">Active</Radio>
                  <Radio value="pending">Pending</Radio>
                  <Radio value="paused">Paused</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="redirect_type" label="Redirect Type">
                <Select>
                  <Option value="302">302</Option>
                  <Option value="301">301</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="visibility" label="Visibility">
                <Radio.Group>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                  <Radio value="ask_permission">Ask for Permission</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* KPI & Basic Targeting */}
        <Card className="form-section" title="KPI & Basic Targeting">
          <Form.Item name="kpi" label="KPI (Optional)">
            <TextArea
              rows={4}
              placeholder="Define Key performance indicators (KPIs) that are crucial for the campaign to be delivered by the publisher, such as CR > 2.0%"
            />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Form.Item name="note" label="Note (Optional)">
                <TextArea
                  rows={3}
                  placeholder="This section is for internal campaign notes only and will not be visible to the publisher or advertiser"
                />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="terms_conditions" label="Terms and Conditions">
                <TextArea
                  rows={3}
                  placeholder="You can include specific terms and conditions related to the campaign in this section"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="require_terms" valuePropName="checked">
            <Checkbox>Require Terms and Conditions</Checkbox>
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="category" label="Category">
                <Input placeholder="Add Categories" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="devices" label="Devices">
                <Checkbox.Group className="device-checkboxes">
                  <Checkbox value="all">ALL</Checkbox>
                  <Checkbox value="desktop">Desktop</Checkbox>
                  <Checkbox value="mobile">Mobile</Checkbox>
                  <Checkbox value="tablet">Tablet</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="operating_system" label="Operating System">
                <Select placeholder="ALL">
                  <Option value="all">ALL</Option>
                  <Option value="windows">Windows</Option>
                  <Option value="macos">macOS</Option>
                  <Option value="android">Android</Option>
                  <Option value="ios">iOS</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="carrier_targeting" label="Carrier Targeting">
                <Input placeholder="Search ISPs" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="traffic_channels" label="Allowed Traffic Channels">
                <Input placeholder="Add traffic channels" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Revenue & Payout */}
        <Card className="form-section" title="Revenue & Payout">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="revenue_model" label="Revenue and Payout Model">
                <Radio.Group
                  value={revenueModel}
                  onChange={(e) => setRevenueModel(e.target.value)}
                >
                  <Radio value="fixed">Fixed</Radio>
                  <Radio value="revshare">Revshare</Radio>
                  <Radio value="hybrid">Hybrid</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="currency" label="Currency">
                <Select>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                  <Option value="GBP">GBP</Option>
                  <Option value="JPY">JPY</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="default_goal" label="Default Goal Name">
                <Input placeholder="Default" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="revenue" label="Revenue">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  precision={2}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="payout" label="Payout">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  precision={2}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="geo_coverage" label="Geo Coverage">
            <Select mode="multiple" placeholder="Select countries">
              <Option value="us">United States</Option>
              <Option value="uk">United Kingdom</Option>
              <Option value="ca">Canada</Option>
              <Option value="au">Australia</Option>
              <Option value="de">Germany</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Advanced Settings */}
        <Card className="form-section" title="Advanced Settings">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="external_offer_id" label="External Offer ID (Optional)">
                <Input placeholder="External offer ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="app_name" label="App Name (Optional)">
                <Input placeholder="App name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="app_id" label="App ID (Optional)">
                <Input placeholder="App ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="conversion_flow" label="Conversion Flow">
                <Select>
                  <Option value="single">Single Page</Option>
                  <Option value="multi">Multi Page</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="unsubscribe_url" label="Unsubscribe URL (Optional)">
                <Input placeholder="Unsubscribe URL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item name="suppression_url" label="Suppression URL (Optional)">
                <Input placeholder="Suppression URL" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="deep_linking" valuePropName="checked">
                <Checkbox>Enable Deep Linking</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="block_duplicate_clicks" valuePropName="checked">
                <Checkbox>Block repeated clicks</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="conversion_hold_period" label="Conversion Hold Period (Optional)">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Hours"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="unique_click_session" label="Unique Click Session Duration">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Minutes"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Campaign Schedule */}
        <Card className="form-section" title="Campaign Schedule">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="start_date" label="Start Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="end_date" label="End Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="enable_schedule_change" valuePropName="checked">
            <Checkbox
              checked={enableScheduleChange}
              onChange={(e) => setEnableScheduleChange(e.target.checked)}
            >
              Enable Schedule Status Change
            </Checkbox>
          </Form.Item>

          {enableScheduleChange && (
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Form.Item name="scheduled_status" label="Status to be set">
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="paused">Paused</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="schedule_date" label="Schedule Date">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="notify_time" label="Publisher Notify Time">
                  <TimePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        {/* Time Targeting */}
        <Card className="form-section" title="Time Targeting">
          <Form.Item name="enable_time_targeting" valuePropName="checked">
            <Checkbox
              checked={enableTimeTargeting}
              onChange={(e) => setEnableTimeTargeting(e.target.checked)}
            >
              Enable Time Targeting
            </Checkbox>
          </Form.Item>

          {enableTimeTargeting && (
            <>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Form.Item name="timezone" label="Timezone">
                    <Select placeholder="Select timezone">
                      <Option value="UTC">UTC</Option>
                      <Option value="EST">EST</Option>
                      <Option value="PST">PST</Option>
                      <Option value="JST">JST</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="start_hour" label="Start Hour (24 Hour format)">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={23}
                      placeholder="0"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="end_hour" label="End Hour (24 Hour format)">
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={23}
                      placeholder="23"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="enable_inactive_hours" valuePropName="checked">
                <Checkbox>Enable Inactive Hours</Checkbox>
              </Form.Item>

              <Form.Item name="active_days" label="Days when targeting will be active">
                <Checkbox.Group className="days-checkboxes">
                  <Checkbox value="monday">Monday</Checkbox>
                  <Checkbox value="tuesday">Tuesday</Checkbox>
                  <Checkbox value="wednesday">Wednesday</Checkbox>
                  <Checkbox value="thursday">Thursday</Checkbox>
                  <Checkbox value="friday">Friday</Checkbox>
                  <Checkbox value="saturday">Saturday</Checkbox>
                  <Checkbox value="sunday">Sunday</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </>
          )}
        </Card>

        {/* Submit Button */}
        <div className="form-actions">
          <Button type="primary" htmlType="submit" size="large">
            Create Campaign
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CampaignCreator;