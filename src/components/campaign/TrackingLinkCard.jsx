import React, { useState, useEffect } from 'react';
import {
  Card,
  Radio,
  Select,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Space,
  message,
  Tooltip,
  Divider,
} from 'antd';
import {
  CopyOutlined,
  LinkOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import apiClient from '../../services/apiServices';
import '../../styles/TrackingLinkCard.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const TrackingLinkCard = ({ campaignId, approvedPublishers = [] }) => {
  const [selectedPublisher, setSelectedPublisher] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkOptions, setLinkOptions] = useState({
    addTrackingParam: false,
    addSourceSubPublisher: false,
    changeTrackingDomain: false,
    addDeepLink: false,
    googleAdsLink: false,
    generateShortLink: false,
  });

  const generateTrackingLink = async () => {
    if (!selectedPublisher) {
      message.warning('Please select a publisher first');
      return;
    }
    console.log('Generating tracking link for publisher:', selectedPublisher,campaignId);

    setLoading(true);
    try {
         const requestData = {
        campaignId: String(campaignId), // Keep as string like in Postman
        publisherIds: [String(selectedPublisher)] // Keep as string like in Postman
      };
      const response = await apiClient.post('/admin/campaign-assignment/assign', requestData);
      console.log('Tracking link response:', response);

      if (response.data?.success && response.data.data.length > 0) {
        const assignmentData = response.data.data[0];
        setGeneratedLink(assignmentData.publisherLink);
        message.success('Tracking link generated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to generate tracking link');
      }
    } catch (error) {
      message.error(error.message || 'Failed to generate tracking link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      message.success('Link copied to clipboard!');
    }
  };

  const handlePublisherChange = (value) => {
    setSelectedPublisher(value);
    setGeneratedLink(''); // Clear previous link when publisher changes
  };

  const handleLinkOptionChange = (option, checked) => {
    setLinkOptions(prev => ({
      ...prev,
      [option]: checked,
    }));
  };

  const getPublisherOptions = () => {
    return approvedPublishers.map(pub => (
      <Option key={pub.key} value={pub.key}>
        {pub.title}
      </Option>
    ));
  };

  return (
    <Card
      className="tracking-link-card"
      title={
        <Space>
          <LinkOutlined />
          <span>Tracking Link</span>
        </Space>
      }
      bordered={false}
      headStyle={{ backgroundColor: '#fafafa' }}
      extra={
        <Space>
          <Button type="primary" size="small">
            Report
          </Button>
          <Button type="default" size="small">
            Manage Links
          </Button>
        </Space>
      }
    >
      <div className="tracking-link-content">
        <div className="publisher-selection">
          <Text strong>Approved Publishers</Text>
          <Select
            placeholder="Choose any publisher to Generate its tracking Link"
            value={selectedPublisher}
            onChange={handlePublisherChange}
            className="publisher-select"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {getPublisherOptions()}
          </Select>

          <Text type="secondary" className="helper-text">
            To generate a tracking link, select an affiliate from below. Tracking links records click for reporting.
          </Text>
        </div>

        <Divider />

        <div className="link-generation">
          <Title level={5}>Generated Link</Title>
          <div className="generated-link-section">
            <Input.TextArea
              value={generatedLink}
              placeholder="Generated tracking link will appear here..."
              rows={3}
              readOnly
              className="generated-link-textarea"
            />
            <Space className="link-actions">
              <Button
                type="primary"
                onClick={generateTrackingLink}
                loading={loading}
                disabled={!selectedPublisher}
              >
                Generate Link
              </Button>
              <Tooltip title="Copy Link">
                <Button
                  icon={<CopyOutlined />}
                  onClick={copyToClipboard}
                  disabled={!generatedLink}
                />
              </Tooltip>
            </Space>
          </div>
        </div>

        <Divider />

        <div className="link-options">
          <Title level={5}>Link Options</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.addTrackingParam}
                onChange={(e) => handleLinkOptionChange('addTrackingParam', e.target.checked)}
              >
                Add Tracking Param
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.addSourceSubPublisher}
                onChange={(e) => handleLinkOptionChange('addSourceSubPublisher', e.target.checked)}
              >
                Add Source (Sub Publisher)
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.changeTrackingDomain}
                onChange={(e) => handleLinkOptionChange('changeTrackingDomain', e.target.checked)}
              >
                Change Tracking Domain
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.addDeepLink}
                onChange={(e) => handleLinkOptionChange('addDeepLink', e.target.checked)}
              >
                Add DeepLink
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.googleAdsLink}
                onChange={(e) => handleLinkOptionChange('googleAdsLink', e.target.checked)}
              >
                Google Ads Link
              </Checkbox>
            </Col>
            <Col span={12}>
              <Checkbox
                checked={linkOptions.generateShortLink}
                onChange={(e) => handleLinkOptionChange('generateShortLink', e.target.checked)}
              >
                Generate Short Link
              </Checkbox>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  );
};

export default TrackingLinkCard;