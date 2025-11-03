import React, { useState } from 'react';
import { Card, Button, Typography, Space, Modal, Select, Switch, Input, Radio, message, Divider } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiServices';

const { Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CampaignSettingsCard = ({ campaignId, settings, onSettingsUpdate }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formValues, setFormValues] = useState({
    // Basic Settings
    fallbackTraffic: '',
    landingPages: '',
    cap: '',
    sampling: '',
    postbackSettings: '',
    blockPublishers: '',
    s2sTracking: '',
    impressionTracking: false,
    
    // Tracking
    conversionTracking: 'Server Postback',
    primaryTrackingDomain: '',
    redirectType: '302 with Hide Referrer',
    markConversionsAsSampled: false,
    showGlobalTargeting: false,
    hidePayoutFromPublishers: true,
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

  const handleEdit = () => {
    setFormValues({
      ...formValues,
      ...settings
    });
    setEditModalVisible(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

    const payload = {
      // map local field to API expected keys and send only the two required values
      hidePayoutForPublisher: !!formValues.hidePayoutFromPublishers,
      redirectType: (formValues.redirectType || '').toLowerCase()
    };

    const response = await apiClient.patch(`/admin/campaign/${campaignId}/settings`, payload);

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      
      message.success('Settings updated successfully');
      setEditModalVisible(false);
      
      if (onSettingsUpdate) {
        onSettingsUpdate(data);
      }
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
    <>
      <Card
        title="Settings"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEdit}
            style={{
              background: '#1890ff',
              borderColor: '#1890ff',
              borderRadius: '6px'
            }}
          >
            Edit
          </Button>
        }
        style={{ height: '100%' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>CAP: </Text>
            <Text>{settings?.cap || 'Not SET'}</Text>
          </div>
          
          <div>
            <Text strong>Impression Tracking: </Text>
            <Text>{settings?.impressionTracking ? 'Enabled' : 'Not Enabled'}</Text>
          </div>
          
          <div>
            <Text strong>Attribution Window: </Text>
            <Text>{settings?.attributionWindow || 'Lifetime'}</Text>
          </div>
        </Space>
      </Card>

      <Modal
        title="Settings"
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
        width={1200}
        okText="Save"
        cancelText="Cancel"
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        <div style={{ padding: '20px 0' }}>
          {/* Tracking Section */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
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
                  <div>
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
                  <div>
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
                  <div>
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
                  <div>
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
                  <div>
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

          <Divider />

          {/* E-commerce Section */}
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
                  <div>
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
                  <div>
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
      </Modal>
    </>
  );
};

export default CampaignSettingsCard;