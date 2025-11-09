import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Select, 
  Switch, 
  Input, 
  Radio, 
  message, 
  Space,
  Row,
  Col,
  Spin
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import apiClient from '../services/apiServices';

const { Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const CampaignSettingsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('fallbackTraffic');
  const [campaigns, setCampaigns] = useState([]);

  const [campaignData, setCampaignData] = useState(null);
  
  const [formValues, setFormValues] = useState({
    // Fallback Traffic
    fallbackCampaign: '',
    fallbackURL: '',
    allowSpilloverConversions: 'No (i.e. Cancel the conversions)',
    cancelFallbackTrafficConversions: 'No',
    cancelConversionsForBlockedPostbacks: true,
    cancelConversionsIfGeoOutOfCoverage: false,
    attributeClicksForBlockedPublishers: false,
    allowTrafficDiversion: true,
    
    // Landing Pages
    landingPageURL: '',
    landingPageName: '',
    landingPages: [],
    
    // CAP
    capType: 'Daily',
    capValue: '',
    capTimezone: 'UTC',
    
    // Sampling
    samplingPercentage: '',
    samplingType: 'Random',
    
    // PostBack Settings
    postbackURL: '',
    postbackMethod: 'GET',
    postbackDelay: '',
    postbackRetries: '3',
    
    // Block Publishers
    blockedPublishers: [],
    blockReason: '',
    
    // S2S Tracking
    s2sPostbackURL: '',
    s2sMethod: 'GET',
    s2sEnabled: false,
    
    // Impression Tracking
    impressionTracking: false,
    impressionPostbackURL: '',
    impressionPixelURL: '',
    
    // Tracking
    conversionTracking: 'Server Postback',
    primaryTrackingDomain: '',
  
    markConversionsAsSampled: false,
    showGlobalTargeting: false,
   
    hidePayoutSettings: 'Hide for all',
    markConversionAsRejected: false,
    enableClickPayout: false,
    conversionPayoutOverride: false,
    trackingLinkFormat: 'Normal',
    allowedTrackingLinkFormat: 'Both',
    rejectConversionsOnMissingParams: false,
    
    // E-commerce
    conversionHoldPeriod: false,
    conversionHoldPeriodValue: '',
    conversionHoldPeriodUnit: 'Hours',
    conversionStatusAfterHold: 'Approved',
    trackMultipleConversions: 'Yes with Txn ID (Default)',
    utmTracking: '',
    payoutRevenueCalculation: 'Revenue',
    setAllConversionsPending: false,
    deepLink: true,
    googleAdsTrackingLink: ''
  });


  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const response = await apiClient.post("/admin/campaign/list", {});
      
      if (response.data && response.data.success) {
        const campaignData = response.data.data || response.data.campaigns || [];
        const campaignsWithKeys = campaignData.map((campaign) => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substring(2, 11),
        }));
        setCampaigns(campaignsWithKeys);
      } else {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to load campaigns for dropdown");
      setCampaigns([]);
    } finally {
      setCampaignsLoading(false);
    }
  };

  const fetchCampaignDetails = async () => {
  try {
    const response = await apiClient.get(`/admin/campaign/${id}`);
    if (response.data && response.data.success) {
      const data = response.data.data;
      setCampaignData(data);
      console.log("Fetched campaign details:", data);
      
      // Update form values with fetched data
      setFormValues(prev => ({
        ...prev,
        redirectType: data.redirectType || '302 with Hide Referrer',
        hidePayoutFromPublishers: data.hidePayoutForPublisher || false,
        fallbackCampaign: data.fallbackCampaignId || '',
        fallbackURL: data.fallbackUrl || ''
      }));
    }
  } catch (error) {
    console.error("Error fetching campaign details:", error);
    message.error("Failed to load campaign details");
  }
};
useEffect(() => {
  fetchCampaignDetails();
}, [id]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

 const handleSave = async () => {
  try {
    setLoading(true);

    // Update main settings
    const settingsPayload = {
      hidePayoutForPublisher: !!formValues.hidePayoutFromPublishers,
      redirectType: (formValues.redirectType || '').toLowerCase()
    };

    await apiClient.patch(`/admin/campaign/${id}/settings`, settingsPayload);

    // Update fallback settings if on fallback tab
    if (activeTab === 'fallbackTraffic') {
      const fallbackPayload = {
        fallbackCampaignId: formValues.fallbackCampaign || null,
        fallbackUrl: formValues.fallbackURL || null
      };

      await apiClient.patch(`/admin/campaign/${id}/fallback`, fallbackPayload);
    }

    message.success('Settings updated successfully');
    await fetchCampaignDetails(); // Refresh data
  } catch (error) {
    console.error('Error updating settings:', error);
    message.error('Failed to update settings');
  } finally {
    setLoading(false);
  }
};



  const updateField = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space align="center" size="large">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/campaign/${id}`)}
              type="text"
              style={{ fontSize: 16 }}
            />
            <Title level={4} style={{ marginBottom: 0 }}>
              Campaign Settings - ID: {id}
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
            style={{
              background: '#1890ff',
              borderColor: '#1890ff',
              borderRadius: '6px',
              fontWeight: '500',
            }}
          >
            Save Settings
          </Button>
        </Col>
      </Row>

      {/* Main Content */}
      <Card style={{ borderRadius: 8 }}>
        {/* Sidebar Navigation */}
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left Sidebar */}
          <div style={{ 
            width: 240, 
            borderRight: '1px solid #f0f0f0',
            paddingRight: 16 
          }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14, color: '#8c8c8c' }}>BASIC SETTINGS</Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
               <Button
                type={activeTab === 'tracking' ? 'primary' : 'text'}
                onClick={() => setActiveTab('tracking')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'tracking' ? 500 : 400
                }}
              >
                Tracking
              </Button>
              <Button
                type={activeTab === 'fallbackTraffic' ? 'primary' : 'text'}
                onClick={() => setActiveTab('fallbackTraffic')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'fallbackTraffic' ? 500 : 400
                }}
              >
                Fallback Traffic
              </Button>
              <Button
                type={activeTab === 'landingPages' ? 'primary' : 'text'}
                onClick={() => setActiveTab('landingPages')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'landingPages' ? 500 : 400
                }}
              >
                Landing Pages
              </Button>
              <Button
                type={activeTab === 'cap' ? 'primary' : 'text'}
                onClick={() => setActiveTab('cap')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'cap' ? 500 : 400
                }}
              >
                CAP
              </Button>
              <Button
                type={activeTab === 'sampling' ? 'primary' : 'text'}
                onClick={() => setActiveTab('sampling')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'sampling' ? 500 : 400
                }}
              >
                Sampling
              </Button>
              <Button
                type={activeTab === 'postbackSettings' ? 'primary' : 'text'}
                onClick={() => setActiveTab('postbackSettings')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'postbackSettings' ? 500 : 400
                }}
              >
                PostBack Settings
              </Button>
              <Button
                type={activeTab === 'blockPublishers' ? 'primary' : 'text'}
                onClick={() => setActiveTab('blockPublishers')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'blockPublishers' ? 500 : 400
                }}
              >
                Block Publishers
              </Button>
              <Button
                type={activeTab === 's2sTracking' ? 'primary' : 'text'}
                onClick={() => setActiveTab('s2sTracking')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 's2sTracking' ? 500 : 400
                }}
              >
                S2S Tracking
              </Button>
              <Button
                type={activeTab === 'impressionTracking' ? 'primary' : 'text'}
                onClick={() => setActiveTab('impressionTracking')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'impressionTracking' ? 500 : 400
                }}
              >
                Impression Tracking
              </Button>
           
              <Button
                type={activeTab === 'ecommerce' ? 'primary' : 'text'}
                onClick={() => setActiveTab('ecommerce')}
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'flex-start',
                  height: 40,
                  fontWeight: activeTab === 'ecommerce' ? 500 : 400
                }}
              >
                E-commerce
              </Button>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ flex: 1, padding: '0 16px' }}>
            {/* Fallback Traffic */}
            {activeTab === 'fallbackTraffic' && (
              <div>
                <div style={{ 
                  background: '#fffbe6', 
                  padding: '12px 16px', 
                  marginBottom: 24,
                  borderRadius: 4,
                  border: '1px solid #ffe58f'
                }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <strong>NOTE:</strong> These Configuration are updated at every 10 mins on Event Tracking server. To know more, <Link href="#">click here</Link>
                  </Text>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left Column */}
                  <div>
                    {/* Fallback Campaign */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Fallback Campaign</Text>
                      </div>
                      <Space.Compact style={{ width: '100%' }}>
                        <Select
                          value={formValues.fallbackCampaign}
                          onChange={(value) => updateField('fallbackCampaign', value)}
                          style={{ width: '100%' }}
                          placeholder="Select campaign"
                          showSearch
                          loading={campaignsLoading}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {campaigns.map((campaign) => (
                            <Option key={campaign.id} value={campaign.id}>
                              (ID: {campaign.id}) {campaign.name || campaign.title || 'Untitled Campaign'}
                            </Option>
                          ))}
                        </Select>
                        {formValues.fallbackCampaign && (
                          <Button onClick={() => updateField('fallbackCampaign', '')}>Clear</Button>
                        )}
                      </Space.Compact>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Fallback campaign in case the current campaign is not active or publisher is blocked on campaign
                      </Text>
                    </div>

                    {/* Allow Spillover Conversions */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Allow Spillover Conversions</Text>
                      </div>
                      <Select
                        value={formValues.allowSpilloverConversions}
                        onChange={(value) => updateField('allowSpilloverConversions', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="No (i.e. Cancel the conversions)">No (i.e. Cancel the conversions)</Option>
                        <Option value="Yes">Yes</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        If cap is exceeded then what to do with the spillover conversions. Default Action: Cancel
                      </Text>
                    </div>

                    {/* Cancel Conversions for blocked postbacks */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Cancel Conversions for blocked postbacks</Text>
                      </div>
                      <Radio.Group
                        value={formValues.cancelConversionsForBlockedPostbacks}
                        onChange={(e) => updateField('cancelConversionsForBlockedPostbacks', e.target.value)}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </div>

                    {/* Attribute clicks for blocked publishers */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Attribute clicks for blocked publishers</Text>
                      </div>
                      <Radio.Group
                        value={formValues.attributeClicksForBlockedPublishers}
                        onChange={(e) => updateField('attributeClicksForBlockedPublishers', e.target.value)}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        Enabling this will approve the conversions from blocked publishers on previously attributed clicks.
                      </Text>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Fallback URL */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Fallback URL</Text>
                      </div>
                      <Input
                        value={formValues.fallbackURL}
                        onChange={(e) => updateField('fallbackURL', e.target.value)}
                        placeholder="http://someurl.com"
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Traffic will be redirected to this fallback when campaign targeting is not matched
                      </Text>
                    </div>

                    {/* Cancel Fallback Traffic Conversions */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Cancel Fallback Traffic Conversions</Text>
                      </div>
                      <Select
                        value={formValues.cancelFallbackTrafficConversions}
                        onChange={(value) => updateField('cancelFallbackTrafficConversions', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="No">No</Option>
                        <Option value="Yes">Yes</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Conversions happening from fallback traffic are by default marked as approved. Enable this setting to mark them as cancelled so that affiliate does not see them in their dashboard
                      </Text>
                    </div>

                    {/* Cancel conversions if conversion geo out of coverage */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Cancel conversions if conversion geo out of coverage</Text>
                      </div>
                      <Radio.Group
                        value={formValues.cancelConversionsIfGeoOutOfCoverage}
                        onChange={(e) => updateField('cancelConversionsIfGeoOutOfCoverage', e.target.value)}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </div>

                    {/* Allow Traffic Diversion */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Allow Traffic Diversion</Text>
                      </div>
                      <Radio.Group
                        value={formValues.allowTrafficDiversion}
                        onChange={(e) => updateField('allowTrafficDiversion', e.target.value)}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        Traffic diversion happens when this campaign is receiving traffic from a different campaign
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Google Ads Note */}
                <div style={{ 
                  padding: '12px', 
                  background: '#fffbe6', 
                  border: '1px solid #ffe58f',
                  borderRadius: 4,
                  marginTop: 20
                }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <strong>NOTE:</strong> In the case of google ads link, fallback will redirect to blank page due to google compliance policies
                  </Text>
                </div>
              </div>
            )}

            {/* Landing Pages */}
            {activeTab === 'landingPages' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <Button type="primary">+ Add Landing Page</Button>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <Text type="secondary">No landing pages configured yet.</Text>
                </div>
              </div>
            )}

            {/* CAP */}
            {activeTab === 'cap' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>CAP Type</Text>
                    </div>
                    <Select
                      value={formValues.capType}
                      onChange={(value) => updateField('capType', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="Daily">Daily</Option>
                      <Option value="Weekly">Weekly</Option>
                      <Option value="Monthly">Monthly</Option>
                      <Option value="Total">Total</Option>
                    </Select>
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>CAP Value</Text>
                    </div>
                    <Input
                      type="number"
                      value={formValues.capValue}
                      onChange={(e) => updateField('capValue', e.target.value)}
                      placeholder="Enter cap value"
                    />
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Timezone</Text>
                    </div>
                    <Select
                      value={formValues.capTimezone}
                      onChange={(value) => updateField('capTimezone', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="UTC">UTC</Option>
                      <Option value="EST">EST</Option>
                      <Option value="PST">PST</Option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Sampling */}
            {activeTab === 'sampling' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Sampling Percentage</Text>
                    </div>
                    <Input
                      type="number"
                      value={formValues.samplingPercentage}
                      onChange={(e) => updateField('samplingPercentage', e.target.value)}
                      placeholder="Enter percentage (0-100)"
                      suffix="%"
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Percentage of traffic to be sampled
                    </Text>
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Sampling Type</Text>
                    </div>
                    <Select
                      value={formValues.samplingType}
                      onChange={(value) => updateField('samplingType', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="Random">Random</Option>
                      <Option value="Sequential">Sequential</Option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* PostBack Settings */}
            {activeTab === 'postbackSettings' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Postback URL</Text>
                    </div>
                    <Input
                      value={formValues.postbackURL}
                      onChange={(e) => updateField('postbackURL', e.target.value)}
                      placeholder="https://example.com/postback"
                    />
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Postback Method</Text>
                    </div>
                    <Select
                      value={formValues.postbackMethod}
                      onChange={(value) => updateField('postbackMethod', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="GET">GET</Option>
                      <Option value="POST">POST</Option>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Postback Delay (seconds)</Text>
                    </div>
                    <Input
                      type="number"
                      value={formValues.postbackDelay}
                      onChange={(e) => updateField('postbackDelay', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong>Retry Attempts</Text>
                    </div>
                    <Select
                      value={formValues.postbackRetries}
                      onChange={(value) => updateField('postbackRetries', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="0">0</Option>
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="5">5</Option>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Block Publishers */}
            {activeTab === 'blockPublishers' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Select Publishers to Block</Text>
                  </div>
                  <Select
                    mode="multiple"
                    value={formValues.blockedPublishers}
                    onChange={(value) => updateField('blockedPublishers', value)}
                    style={{ width: '100%' }}
                    placeholder="Search and select publishers"
                  >
                    <Option value="pub1">Publisher 1</Option>
                    <Option value="pub2">Publisher 2</Option>
                    <Option value="pub3">Publisher 3</Option>
                  </Select>
                </div>
                
                <div style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Block Reason</Text>
                  </div>
                  <TextArea
                    value={formValues.blockReason}
                    onChange={(e) => updateField('blockReason', e.target.value)}
                    rows={4}
                    placeholder="Enter reason for blocking"
                  />
                </div>
              </div>
            )}

            {/* S2S Tracking */}
            {activeTab === 's2sTracking' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>Enable S2S Tracking</Text>
                    <Switch
                      checked={formValues.s2sEnabled}
                      onChange={(checked) => updateField('s2sEnabled', checked)}
                    />
                  </div>
                </div>

                {formValues.s2sEnabled && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>S2S Postback URL</Text>
                        </div>
                        <Input
                          value={formValues.s2sPostbackURL}
                          onChange={(e) => updateField('s2sPostbackURL', e.target.value)}
                          placeholder="https://example.com/s2s"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Method</Text>
                        </div>
                        <Select
                          value={formValues.s2sMethod}
                          onChange={(value) => updateField('s2sMethod', value)}
                          style={{ width: '100%' }}
                        >
                          <Option value="GET">GET</Option>
                          <Option value="POST">POST</Option>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Impression Tracking */}
            {activeTab === 'impressionTracking' && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Enable Impression Tracking</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Track impressions for this campaign
                        </Text>
                      </div>
                    </div>
                    <Switch
                      checked={formValues.impressionTracking}
                      onChange={(checked) => updateField('impressionTracking', checked)}
                    />
                  </div>
                </div>

                {formValues.impressionTracking && (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Impression Postback URL</Text>
                      </div>
                      <Input
                        value={formValues.impressionPostbackURL}
                        onChange={(e) => updateField('impressionPostbackURL', e.target.value)}
                        placeholder="https://example.com/impression"
                      />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Impression Pixel URL</Text>
                      </div>
                      <Input
                        value={formValues.impressionPixelURL}
                        onChange={(e) => updateField('impressionPixelURL', e.target.value)}
                        placeholder="https://example.com/pixel.gif"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tracking Section */}
            {activeTab === 'tracking' && (
              <div>
                <div style={{ 
                  background: '#e6f7ff', 
                  padding: '12px 16px', 
                  marginBottom: 24,
                  borderRadius: 4 
                }}>
                  <Text strong style={{ fontSize: 16, color: '#1890ff' }}>Tracking</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      To know more, <Link href="#">click here</Link>
                    </Text>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left Column */}
                  <div>
                    {/* Conversion Tracking */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Conversion Tracking</Text>
                      </div>
                      <Select
                        value={formValues.conversionTracking}
                        onChange={(value) => updateField('conversionTracking', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="Server Postback">Server Postback</Option>
                        <Option value="Pixel Tracking">Pixel Tracking</Option>
                        <Option value="No Tracking">No Tracking</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Switch between server Postback, Pixel or image pixel
                      </Text>
                    </div>

                    {/* Redirect Type */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Redirect Type <span style={{ color: '#ff4d4f' }}>*</span></Text>
                      </div>
                      <Select
                        value={formValues.redirectType}
                        onChange={(value) => updateField('redirectType', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="302 with Hide Referrer">302 with Hide Referrer</Option>
                        <Option value="301">301 Redirect</Option>
                        <Option value="302">302 Redirect</Option>
                        <Option value="307">307 Redirect</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        This option allows you to choose between multiple redirection methods on streamlined keeping 302 as the default
                      </Text>
                    </div>

                    {/* Mark conversions as sampled */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Mark conversions as sampled if click id is sampled</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              If conversion from a click id is sampled then this will mark the conversion sampled from this campaign and be also be marked as sampled
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.markConversionsAsSampled}
                          onChange={(checked) => updateField('markConversionsAsSampled', checked)}
                        />
                      </div>
                    </div>

                    {/* Hide Payout From Publishers Settings */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Hide Payout From Publishers Settings</Text>
                      </div>
                      <Radio.Group
                        value={formValues.hidePayoutSettings}
                        onChange={(e) => updateField('hidePayoutSettings', e.target.value)}
                      >
                        <Space direction="vertical">
                          <Radio value="Hide for all">Hide for all</Radio>
                          <Radio value="Hide publishers">Hide publishers</Radio>
                          <Radio value="Exclude publishers">Exclude publishers</Radio>
                        </Space>
                      </Radio.Group>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        Enabling this will hide a publisher payout and API
                      </Text>
                    </div>

                    {/* Enable Click Payout via Tracking Link */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>Enable Click Payout via Tracking Link</Text>
                        <Switch
                          checked={formValues.enableClickPayout}
                          onChange={(checked) => updateField('enableClickPayout', checked)}
                        />
                      </div>
                    </div>

                    {/* Tracking Link Format */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Tracking Link Format</Text>
                      </div>
                      <Radio.Group
                        value={formValues.trackingLinkFormat}
                        onChange={(e) => updateField('trackingLinkFormat', e.target.value)}
                      >
                        <Space>
                          <Radio value="Normal">Normal</Radio>
                          <Radio value="Hashed (Short)">Hashed (Short)</Radio>
                        </Space>
                      </Radio.Group>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                        To generate a short or long link with this setting, you can choose the desired length (short or long) to create a tracking link for your campaign. This customization enables you to generate a link that is optimized for tracking your performance within your campaign.
                      </Text>
                    </div>

                    {/* Reject Conversions/Pixels on Missing Parameters */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>Reject Conversions/Pixels on Missing Parameters</Text>
                        <Button 
                          size="small" 
                          type="primary"
                          style={{ fontSize: 11 }}
                        >
                          + Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Primary Tracking Domain */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Primary Tracking Domain</Text>
                      </div>
                      <Select
                        value={formValues.primaryTrackingDomain}
                        onChange={(value) => updateField('primaryTrackingDomain', value)}
                        style={{ width: '100%' }}
                        placeholder="---"
                      >
                        <Option value="domain1">Domain 1</Option>
                        <Option value="domain2">Domain 2</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        You can switch between default tracking domains here, this is only available if you have specified additional tracking domains in the cloudbase section
                      </Text>
                    </div>

                    {/* Show Global Targeting to Publisher */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Show Global Targeting to Publisher</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this will show a global targeting rule set on this campaign to the publishers in their interface and API
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.showGlobalTargeting}
                          onChange={(checked) => updateField('showGlobalTargeting', checked)}
                        />
                      </div>
                    </div>

                    {/* Hide Payout from Publishers */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Hide Payout from Publishers</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this will hide a publisher payout and API
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.hidePayoutFromPublishers}
                          onChange={(checked) => updateField('hidePayoutFromPublishers', checked)}
                        />
                      </div>
                    </div>

                    {/* Mark conversion as rejected */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Mark conversion as rejected</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this will mark conversions as rejected when campaign is disabled state
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.markConversionAsRejected}
                          onChange={(checked) => updateField('markConversionAsRejected', checked)}
                        />
                      </div>
                    </div>

                    {/* Conversion Payout Override */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Conversion Payout Override</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this will override the payout / revenue of each conversion published / pixels
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.conversionPayoutOverride}
                          onChange={(checked) => updateField('conversionPayoutOverride', checked)}
                        />
                      </div>
                    </div>

                    {/* Allowed Tracking Link Format */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Allowed Tracking Link Format</Text>
                      </div>
                      <Select
                        value={formValues.allowedTrackingLinkFormat}
                        onChange={(value) => updateField('allowedTrackingLinkFormat', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="Both">Both</Option>
                        <Option value="Normal">Normal</Option>
                        <Option value="Hashed">Hashed</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Sets the preferred identifier format used in tracking links
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E-commerce Section */}
            {activeTab === 'ecommerce' && (
              <div>
                <div style={{ 
                  background: '#e6f7ff', 
                  padding: '12px 16px', 
                  marginBottom: 24,
                  borderRadius: 4 
                }}>
                  <Text strong style={{ fontSize: 16, color: '#1890ff' }}>E-commerce</Text>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left Column */}
                  <div>
                    {/* Conversion Hold Period */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text strong>Conversion Hold Period (Optional)</Text>
                        <Switch
                          checked={formValues.conversionHoldPeriod}
                          onChange={(checked) => updateField('conversionHoldPeriod', checked)}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Input
                          value={formValues.conversionHoldPeriodValue}
                          onChange={(e) => updateField('conversionHoldPeriodValue', e.target.value)}
                          style={{ flex: 1 }}
                          disabled={!formValues.conversionHoldPeriod}
                        />
                        <Select
                          value={formValues.conversionHoldPeriodUnit}
                          onChange={(value) => updateField('conversionHoldPeriodUnit', value)}
                          style={{ width: 100 }}
                          disabled={!formValues.conversionHoldPeriod}
                        >
                          <Option value="Hours">Hours</Option>
                          <Option value="Days">Days</Option>
                        </Select>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        The number of hours conversion will remain pending status. After which it will be converted to approved by default.
                      </Text>
                    </div>

                    {/* Track Multiple Conversions */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Track Multiple Conversions</Text>
                      </div>
                      <Select
                        value={formValues.trackMultipleConversions}
                        onChange={(value) => updateField('trackMultipleConversions', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="Yes with Txn ID (Default)">Yes with Txn ID (Default)</Option>
                        <Option value="No">No</Option>
                        <Option value="Yes">Yes</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        You can select different conditions to track multiple conversions
                      </Text>
                    </div>

                    {/* Payout Revenue Calculation Param */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Payout Revenue Calculation Param</Text>
                      </div>
                      <Select
                        value={formValues.payoutRevenueCalculation}
                        onChange={(value) => updateField('payoutRevenueCalculation', value)}
                        style={{ width: '100%' }}
                      >
                        <Option value="Revenue">Revenue</Option>
                        <Option value="Payout">Payout</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        In this setting you can specify which paramenter should be utilised to determine revenue and payout in a CPI campaign.
                      </Text>
                    </div>

                    {/* Deep Link */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Deep Link</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this will display the option to add a deep link url in the tracking url.
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.deepLink}
                          onChange={(checked) => updateField('deepLink', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {/* Conversion Status After Hold Period */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Conversion Status After Hold Period (Optional)</Text>
                      </div>
                      <Select
                        value={formValues.conversionStatusAfterHold}
                        onChange={(value) => updateField('conversionStatusAfterHold', value)}
                        style={{ width: '100%' }}
                        disabled={!formValues.conversionHoldPeriod}
                      >
                        <Option value="Approved">Approved</Option>
                        <Option value="Pending">Pending</Option>
                        <Option value="Rejected">Rejected</Option>
                      </Select>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Please set hold status expires, set the conversion status defined status, by default it is legitimate
                      </Text>
                    </div>

                    {/* UTM Tracking/Append URL */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>UTM Tracking/Append URL (Optional)</Text>
                      </div>
                      <TextArea
                        value={formValues.utmTracking}
                        onChange={(e) => updateField('utmTracking', e.target.value)}
                        rows={3}
                        placeholder=""
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        These parameters will be appended to final redirect URL as all attractive URLs
                      </Text>
                    </div>

                    {/* Set All Conversions Pending */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, paddingRight: 16 }}>
                          <Text strong>Set All Conversions Pending</Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Enabling this setting records all conversions for this setup to be marked as pending by default
                            </Text>
                          </div>
                        </div>
                        <Switch
                          checked={formValues.setAllConversionsPending}
                          onChange={(checked) => updateField('setAllConversionsPending', checked)}
                        />
                      </div>
                    </div>

                    {/* Google Ads Tracking Link Option */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong>Google Ads Tracking Link Option</Text>
                      </div>
                      <Select
                        value={formValues.googleAdsTrackingLink}
                        onChange={(value) => updateField('googleAdsTrackingLink', value)}
                        style={{ width: '100%' }}
                        placeholder="Select publisher from the list"
                      >
                        <Option value="option1">Option 1</Option>
                        <Option value="option2">Option 2</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button at Bottom */}
        <div style={{ 
          marginTop: 40, 
          paddingTop: 24, 
          borderTop: '1px solid #f0f0f0',
          textAlign: 'left',
          paddingLeft: 256
        }}>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            size="large"
            style={{
              width: 120,
              background: '#1890ff',
              borderColor: '#1890ff',
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CampaignSettingsPage; 