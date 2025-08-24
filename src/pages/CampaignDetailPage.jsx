import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Card,
  Descriptions,
  Tag,
  Input,
  message,
  Transfer,
  Tooltip,
  Select,
  Divider,
  Form,
  DatePicker,
  InputNumber,
  Switch,
  Modal,

} from 'antd';
import {
  ArrowLeftOutlined,
  BlockOutlined,
  FileTextOutlined,
  PlusOutlined,
  SaveOutlined,
  EditOutlined,
  CloseOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  FontSizeOutlined,
  FontColorsOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  AlignLeftOutlined,
  TableOutlined,
  LinkOutlined,
  PictureOutlined,
  ScissorOutlined,
  UndoOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import TrackingLinkCard from '../components/campaign/TrackingLinkCard';
import PublisherAccess from '../components/campaign/PublisherAccess';
import '../styles/CampaignDetailPage.scss';
import CampaignDetailSkeleton from '../components/skeletons/CampaignDetailSkeleton';
import ConversionTracking from '../components/campaign/ConversionTracking';
import dayjs from 'dayjs';
import BlockPublishers from '../components/campaign/BlockPublishers';

import {conversionTrackingOptions } from '../data/formOptions';

const { Title, Text } = Typography;
const { Option } = Select;

const { TextArea } = Input;
const EditCampaignModal = ({ visible, onCancel, campaign, onSave }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && campaign) {
      // Set form values when modal opens
      form.setFieldsValue({
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        visibility: campaign.visibility,
        objective: campaign.objective,
        currency: campaign.currency,
        payout: campaign.payout,
        revenue: campaign.revenue,
        revenueModel: campaign.revenueModel,
        conversionTracking: campaign.conversionTracking,
        devices: campaign.devices,
        operatingSystem: campaign.operatingSystem,
        geoCoverage: campaign.geoCoverage,
        allowedTrafficChannels: campaign.allowedTrafficChannels,
        campaignStartDate: campaign.campaignStartDate ? dayjs(campaign.campaignStartDate) : null,
        campaignEndDate: campaign.campaignEndDate ? dayjs(campaign.campaignEndDate) : null,
        timezone: campaign.timezone,
        startHour: campaign.startHour,
        endHour: campaign.endHour,
        preview_url: campaign.preview_url,
        trackingUrl: campaign.trackingUrl,
        defaultCampaignUrl: campaign.defaultCampaignUrl,
        note: campaign.note,
      });
    }
  }, [visible, campaign, form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      // Format dates for API
      const formattedValues = {
        ...values,
        campaignStartDate: values.campaignStartDate ? values.campaignStartDate.format('YYYY-MM-DD') : null,
        campaignEndDate: values.campaignEndDate ? values.campaignEndDate.format('YYYY-MM-DD') : null,
      };

      const response = await apiClient.put(`/admin/campaign/${campaign.id}`, formattedValues);
      
      if (response.data?.success) {
        message.success('Campaign updated successfully');
        onSave(response.data.data || { ...campaign, ...formattedValues });
        onCancel();
      } else {
        message.error(response.data?.message || 'Failed to update campaign');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to update campaign: ' + (error.message || 'An error occurred'));
      }
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Paused', value: 'paused' },
    { label: 'Expired', value: 'expired' },
  ];


  const visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Invite Only', value: 'invite_only' },
  ];

  const objectiveOptions = [
    { label: 'Sales', value: 'sales' },
    { label: 'Leads', value: 'leads' },
    { label: 'Traffic', value: 'traffic' },
    { label: 'Brand Awareness', value: 'brand_awareness' },
  ];

  const currencyOptions = [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'INR', value: 'INR' },
  ];

  const revenueModelOptions = [
    { label: 'CPA', value: 'CPA' },
    { label: 'CPC', value: 'CPC' },
    { label: 'CPM', value: 'CPM' },
    { label: 'Revenue Share', value: 'revenue_share' },
  ];

  const deviceOptions = [
    { label: 'Desktop', value: 'desktop' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Tablet', value: 'tablet' },
  ];

  const osOptions = [
    { label: 'Windows', value: 'windows' },
    { label: 'macOS', value: 'macos' },
    { label: 'Linux', value: 'linux' },
    { label: 'iOS', value: 'ios' },
    { label: 'Android', value: 'android' },
  ];

  return (
    <Modal
      title={`Edit Campaign - ${campaign?.title}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Campaign Title"
              rules={[{ required: true, message: 'Please enter campaign title' }]}
            >
              <Input placeholder="Enter campaign title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select status">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter campaign description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="visibility" label="Visibility">
              <Select placeholder="Select visibility">
                {visibilityOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="objective" label="Objective">
              <Select placeholder="Select objective">
                {objectiveOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="currency" label="Currency">
              <Select placeholder="Select currency">
                {currencyOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="payout" label="Payout">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="revenue" label="Revenue">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="revenueModel" label="Revenue Model">
              <Select placeholder="Select model">
                {revenueModelOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
<Row gutter={16}>
  <Col span={24}>
    <Form.Item name="conversionTracking" label="Conversion Tracking">
      <Select placeholder="Select a tracking method">
        {conversionTrackingOptions.map(option => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  </Col>
</Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="devices" label="Devices">
              <Select mode="multiple" placeholder="Select devices">
                {deviceOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="operatingSystem" label="Operating Systems">
              <Select mode="multiple" placeholder="Select OS">
                {osOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="campaignStartDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="campaignEndDate" label="End Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="startHour" label="Start Hour">
              <InputNumber min={0} max={23} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="endHour" label="End Hour">
              <InputNumber min={0} max={23} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="timezone" label="Timezone">
              <Input placeholder="e.g., UTC, EST, PST" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="preview_url" label="Preview URL">
          <Input placeholder="Enter preview URL" />
        </Form.Item>

        <Form.Item name="trackingUrl" label="Tracking URL">
          <Input placeholder="Enter tracking URL" />
        </Form.Item>

        <Form.Item name="defaultCampaignUrl" label="Default Campaign URL">
          <Input placeholder="Enter default campaign URL" />
        </Form.Item>

        <Form.Item name="note" label="Notes">
          <TextArea rows={3} placeholder="Enter any notes" />
        </Form.Item>
      </Form>
    </Modal>
  );
};






const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedPublishers, setApprovedPublishers] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [issaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/admin/campaign/${id}`);
        console.log("Campaign Details Response:", response.data);
        if (response.data?.success) {
          setCampaign(response.data.data);
        } else {
          throw new Error(response.data?.message || "Campaign not found.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching campaign details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id]);

  const handleApprovedPublishersChange = useCallback((publishers) => {
    setApprovedPublishers(publishers);
  }, []);

  const handleCampaignUpdate = (updatedCampaign) => {
    setCampaign(updatedCampaign);
  };

  const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Not specified';
    }
    return value || 'Not specified';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };




  // Handler to update state and call the API
// In CampaignDetailPage.js

// UPDATE this function to include the API call
const handleTrackingTypeChange = async (newType) => {
  // Store the original campaign state to revert on failure
  const originalCampaign = campaign;
  
  // 1. Optimistically update the UI for a responsive feel
  setCampaign(prev => ({ ...prev, conversionTracking: newType }));

  try {
    // 2. Call the API to save the change
    const response = await apiClient.put(`/admin/campaign/${id}`, { 
      conversionTracking: newType 
    });

    if (response.data?.success) {
      message.success('Tracking type updated successfully!');
      // Optionally, update state with the full response data if needed
      // setCampaign(response.data.data); 
    } else {
      // Handle cases where the API responds with an error
      throw new Error(response.data?.message || 'Failed to update tracking type.');
    }
  } catch (error) {
    message.error(error.message || 'An error occurred.');
    // 3. Revert the UI change if the API call fails
    setCampaign(originalCampaign);
  }
};

  const handleScriptChange = (newScript) => {
     setCampaign(prev => ({ ...prev, trackingScript: newScript }));
     // You would likely save this on a button click, not on every keystroke
  };





  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'expired': return 'orange';
      case 'paused': return 'yellow';
      default: return 'default';
    }
  };

  if (loading) {
    return <CampaignDetailSkeleton />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '24px' }} />;
  }

  if (!campaign) {
    return <Alert message="No campaign data available." type="warning" showIcon style={{ margin: '24px' }} />;
  }

  return (
    <div className="campaign-detail-page">
      <Row justify="space-between" align="middle" className="page-header">
        <Col>
          <Space align="center" size="large">
            <Link to="/campaign/manage" className="back-link">
              <ArrowLeftOutlined className="back-icon" />
            </Link>
            <Title level={4} style={{ marginBottom: 0 }}>
              Campaign ID: {campaign.id}
            </Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditModalVisible(true)}
            style={{ 
              background: '#1890ff',
              borderColor: '#1890ff',
              borderRadius: '6px',
              fontWeight: '500'
            }}
          >
            Edit Campaign
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={`Details (ID: ${campaign.id})`}
            bordered={false}
            headStyle={{ backgroundColor: '#fafafa' }}
            className="campaign-card"
          >
            <Descriptions column={1} bordered size="small" labelStyle={{ width: '35%' }}>
              <Descriptions.Item label="Title">{campaign.title}</Descriptions.Item>
              <Descriptions.Item label="Description">{campaign.description || 'No description available'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(campaign.status)}>
                  {campaign.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Effective Status">
                <Tag color={getStatusColor(campaign.effectiveStatus)}>
                  {campaign.effectiveStatus?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Advertiser">
                <a href="#">(ID: {campaign.company_id}) {campaign.company?.name}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Category">{formatArrayValue(campaign.category)}</Descriptions.Item>
              <Descriptions.Item label="Visibility">{campaign.visibility}</Descriptions.Item>
              <Descriptions.Item label="Objective">{campaign.objective}</Descriptions.Item>
              <Descriptions.Item label="Currency">{campaign.currency}</Descriptions.Item>
              <Descriptions.Item label="Payout">{campaign.payout ? `${campaign.payout} ${campaign.currency}` : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Revenue">{campaign.revenue ? `${campaign.revenue} ${campaign.currency}` : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Revenue Model">{campaign.revenueModel || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Conversion Tracking">{campaign.conversionTracking || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Devices">{formatArrayValue(campaign.devices)}</Descriptions.Item>
              <Descriptions.Item label="Operating System">{formatArrayValue(campaign.operatingSystem)}</Descriptions.Item>
              <Descriptions.Item label="Geo Coverage">{formatArrayValue(campaign.geoCoverage)}</Descriptions.Item>
              <Descriptions.Item label="Traffic Channels">{formatArrayValue(campaign.allowedTrafficChannels)}</Descriptions.Item>
              <Descriptions.Item label="Campaign Start">{formatDate(campaign.campaignStartDate)}</Descriptions.Item>
              <Descriptions.Item label="Campaign End">{formatDate(campaign.campaignEndDate)}</Descriptions.Item>
              <Descriptions.Item label="Time Zone">{campaign.timezone || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Start Hour">{campaign.startHour !== undefined ? `${campaign.startHour}:00` : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="End Hour">{campaign.endHour !== undefined ? `${campaign.endHour}:00` : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Created Date">{formatDate(campaign.created_at)}</Descriptions.Item>
              <Descriptions.Item label="Preview URL">
                <a href={campaign.preview_url} target="_blank" rel="noopener noreferrer">
                  {campaign.preview_url}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Tracking URL">{campaign.trackingUrl || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Default Campaign URL">{campaign.defaultCampaignUrl || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Note">{campaign.note || 'No notes'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <TrackingLinkCard
              campaignId={campaign.id}
              issaved={issaved}
            />
            <PublisherAccess
              campaignId={campaign.id}
              onApprovedPublishersChange={handleApprovedPublishersChange}
              setIsSaved={setIsSaved}
            />
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <BlockPublishers campaignId={campaign.id} />
        </Col>
        <Col xs={24} lg={12}>
           <ConversionTracking
      value={campaign.trackingScript}
      onChange={handleScriptChange}
      trackingType={campaign.conversionTracking}
      onTrackingTypeChange={handleTrackingTypeChange}
      options={conversionTrackingOptions}
    />
        </Col>
      </Row>

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        campaign={campaign}
        onSave={handleCampaignUpdate}
      />
    </div>
  );
};

export default CampaignDetailPage;