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
} from 'antd';
import {
  ArrowLeftOutlined,
  BlockOutlined,
  FileTextOutlined,
  PlusOutlined,
  SaveOutlined,
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
import '../styles/CampaignDetailPage.scss'; // Assuming this SCSS file exists
import CampaignDetailSkeleton from '../components/skeletons/CampaignDetailSkeleton';
import ConversionTracking from '../components/campaign/ConversionTracking';


const { Title, Text } = Typography;
const { Option } = Select;

/**
 * BlockPublishers component allows blocking and unblocking publishers for a specific campaign.
 * @param {object} props - Component props.
 * @param {string} props.campaignId - The ID of the campaign.
 */
const BlockPublishers = ({ campaignId }) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [blockedPublishers, setBlockedPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetches all publishers and the publishers currently blocked for the campaign
  useEffect(() => {
    const fetchPublishers = async () => {
      setLoading(true);
      try {
        // Fetch all publishers
        const allPublishersResponse = await apiClient.post('/common/publisher/list', {});
        if (allPublishersResponse.data?.success) {
          setAllPublishers(allPublishersResponse.data.data);
        } else {
          message.error('Failed to load all publishers.');
        }

        // Fetch blocked publishers for the current campaign
        const blockedResponse = await apiClient.get(`/admin/campaign/${campaignId}/blocked-publishers`);
        if (blockedResponse.data?.success) {
          setBlockedPublishers(blockedResponse.data.data || []);
        } else {
          // If no blocked publishers, or API returns non-success, treat as empty
          setBlockedPublishers([]);
        }
      } catch (error) {
        message.error('Failed to load publishers: ' + (error.message || 'An error occurred.'));
        setBlockedPublishers([]); // Ensure blockedPublishers is an array even on error
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchPublishers();
    }
  }, [campaignId]);

  /**
   * Handles blocking a selected publisher.
   * @param {string} publisherId - The ID of the publisher to block.
   */
  const handleBlockPublisher = async (publisherId) => {
    if (!publisherId) return;

    setSaveLoading(true);
    try {
      const response = await apiClient.post(`/admin/campaign/${campaignId}/block-publisher`, {
        publisherId: publisherId
      });

      if (response.data?.success) {
        // Find the publisher from the allPublishers list and add to blocked
        const publisherToBlock = allPublishers.find(p => p.id.toString() === publisherId.toString());
        if (publisherToBlock) {
          setBlockedPublishers(prev => [...prev, publisherToBlock]);
        }
        message.success('Publisher blocked successfully');
      } else {
        message.error(response.data?.message || 'Failed to block publisher');
      }
    } catch (error) {
      message.error('Failed to block publisher: ' + (error.message || 'An error occurred.'));
    } finally {
      setSaveLoading(false);
    }
  };

  /**
   * Handles unblocking a publisher.
   * @param {string} publisherId - The ID of the publisher to unblock.
   */
  const handleUnblockPublisher = async (publisherId) => {
    setSaveLoading(true);
    try {
      const response = await apiClient.delete(`/admin/campaign/${campaignId}/block-publisher/${publisherId}`);

      if (response.data?.success) {
        setBlockedPublishers(prev => prev.filter(p => p.id.toString() !== publisherId.toString()));
        message.success('Publisher unblocked successfully');
      } else {
        message.error(response.data?.message || 'Failed to unblock publisher');
      }
    } catch (error) {
      message.error('Failed to unblock publisher: ' + (error.message || 'An error occurred.'));
    } finally {
      setSaveLoading(false);
    }
  };

  // Filter out publishers that are already blocked from the available list for selection
  const availablePublishers = allPublishers.filter(
    pub => !blockedPublishers.some(blocked => blocked.id.toString() === pub.id.toString())
  );

  return (
    <Card
      title={
        <Space>
          <BlockOutlined />
          Block Publishers
        </Space>
      }
      bordered={false}
      headStyle={{ backgroundColor: '#fafafa' }}
      className="campaign-card"
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Select Publishers</Text>
        <Select
          style={{ width: '100%', marginTop: 8 }}
          placeholder="Select publishers to block"
          onSelect={handleBlockPublisher}
          loading={loading}
          disabled={saveLoading}
          value={null} // Reset select value after selection
        >
          {availablePublishers.map(publisher => (
            <Option key={publisher.id} value={publisher.id}>
              (ID: {publisher.id}) {publisher.name}
            </Option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <strong>Note:</strong> Publishers added to this block list will no longer be able to see the campaign on their panel or API.
          No Traffic will be allowed from these publishers on this campaign.
        </Text>
      </div>

      {blockedPublishers.length > 0 && (
        <div>
          <Text strong>Blocked Publishers:</Text>
          <div style={{ marginTop: 8 }}>
            {blockedPublishers.map(publisher => (
              <Tag
                key={publisher.id}
                closable
                onClose={() => handleUnblockPublisher(publisher.id)}
                color="red"
                style={{ marginBottom: 8 }}
              >
                (ID: {publisher.id}) {publisher.name}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* The "Save" button here is a bit misleading as actions are immediate */}
      <Button
        type="primary"
        className="campaign-button"
        style={{ marginTop: 16 }}
        loading={saveLoading}
        disabled={blockedPublishers.length === 0 && availablePublishers.length === allPublishers.length}
      >
        Save
      </Button>
    </Card>
  );
};

/**
 * Notes component provides a rich text editor for campaign notes.
 * @param {object} props - Component props.
 * @param {string} props.campaignId - The ID of the campaign.
 */
const Notes = ({ campaignId }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const editorRef = useRef(null);



  
  const handleSaveNotes = async () => {
    setSaveLoading(true);
   
    
  };

 
  const applyFormatting = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const toolbarButtons = [
    { icon: <BoldOutlined />, title: 'Bold', command: 'bold' },
    { icon: <ItalicOutlined />, title: 'Italic', command: 'italic' },
    { icon: <UnderlineOutlined />, title: 'Underline', command: 'underline' },
    { icon: <StrikethroughOutlined />, title: 'Strikethrough', command: 'strikeThrough' },

    { icon: <FontSizeOutlined />, title: 'Font Size', command: 'fontSize' },
    { icon: <FontColorsOutlined />, title: 'Font Color', command: 'foreColor' },
    { icon: <UnorderedListOutlined />, title: 'Bullet List', command: 'insertUnorderedList' },
    { icon: <OrderedListOutlined />, title: 'Numbered List', command: 'insertOrderedList' },
    { icon: <AlignLeftOutlined />, title: 'Align Left', command: 'justifyLeft' },
    { icon: <TableOutlined />, title: 'Table', command: 'insertHTML', html: '<table><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>' }, // Basic table insertion
    { icon: <LinkOutlined />, title: 'Link', command: 'createLink' }, // Requires prompt for URL
    { icon: <PictureOutlined />, title: 'Image', command: 'insertImage' }, // Requires prompt for image URL
    { icon: <ScissorOutlined />, title: 'Cut', command: 'cut' },
    { icon: <UndoOutlined />, title: 'Undo', command: 'undo' },
    { icon: <QuestionCircleOutlined />, title: 'Help', command: null }, // No execCommand for help
  ];

  const handleToolbarButtonClick = (button) => {
    if (button.command) {
      let value = null;
      if (button.command === 'createLink') {
        value = prompt('Enter URL:');
        if (!value) return; // Don't execute if no URL provided
      } else if (button.command === 'insertImage') {
        value = prompt('Enter Image URL:');
        if (!value) return; // Don't execute if no URL provided
      } else if (button.command === 'foreColor') {
        value = prompt('Enter color (e.g., red, #FF0000):');
        if (!value) return;
      } else if (button.command === 'fontSize') {
        value = prompt('Enter font size (1-7):'); // execCommand uses 1-7 for font size
        if (!value || isNaN(parseInt(value)) || parseInt(value) < 1 || parseInt(value) > 7) {
          message.warning('Please enter a valid font size between 1 and 7.');
          return;
        }
      } else if (button.html) {
        // For commands that insert HTML directly
        applyFormatting('insertHTML', button.html);
        return;
      }
      applyFormatting(button.command, value);
    } else if (button.title === 'Help') {
      message.info('Rich text editor functionality is basic. Use standard browser shortcuts for more options.');
    }
  };

  return (
    <Card
      title={
        <Space>
          <FileTextOutlined />
          Notes
        </Space>
      }
      bordered={false}
      headStyle={{ backgroundColor: '#fafafa' }}
      className="campaign-card"
    >
      <div className="notes-toolbar">
        <Space size="small" wrap>
          {toolbarButtons.map((button, index) => (
            <Tooltip key={index} title={button.title}>
              <Button
                type="text"
                size="small"
                icon={button.icon}
                className="toolbar-button"
                onClick={() => handleToolbarButtonClick(button)}
              />
            </Tooltip>
          ))}
          <Divider type="vertical" />
          {/* Font family and size dropdowns for visual indication, actual application requires more complex execCommand or custom logic */}
          <Select
            defaultValue="Default"
            size="small"
            style={{ width: 100 }}
            bordered={false}
            onChange={(value) => applyFormatting('fontName', value)}
          >
            <Option value="Arial">Arial</Option>
            <Option value="Verdana">Verdana</Option>
            <Option value="Georgia">Georgia</Option>
            <Option value="Times New Roman">Times New Roman</Option>
            <Option value="Courier New">Courier New</Option>
            <Option value="Default">Default</Option> {/* Fira Sans is not a standard web safe font, use a generic "Default" */}
          </Select>
          <Select
            defaultValue="3" // Corresponds to a medium size in execCommand
            size="small"
            style={{ width: 60 }}
            bordered={false}
            onChange={(value) => applyFormatting('fontSize', value)}
          >
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
          </Select>
        </Space>
      </div>

      <div
        ref={editorRef}
        contentEditable="true"
        className="notes-editor"
        style={{
          minHeight: '200px',
          border: '1px solid #d9d9d9',
          borderRadius: '2px',
          padding: '8px 12px',
          overflowY: 'auto',
          backgroundColor: loading ? '#f0f0f0' : '#fff',
          cursor: loading ? 'not-allowed' : 'text',
        }}
        onInput={(e) => setNotes(e.currentTarget.innerHTML)} // Update state on input
        dangerouslySetInnerHTML={{ __html: notes }} // Set initial HTML content
      />
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      )}

      <div className="notes-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        {/* "Add note" button might imply adding a new section or entry, which is not implemented by a single rich editor field */}
        <Button
          type="default" // Changed to default as it doesn't perform a save action directly
          icon={<PlusOutlined />}
          className="campaign-button"
          onClick={() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = ''; // Clear editor for a new note
              setNotes('');
              editorRef.current.focus();
            }
          }}
        >
          Clear Notes
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveNotes}
          loading={saveLoading}
          className="campaign-button"
        >
          Save Notes
        </Button>
      </div>
    </Card>
  );
};








const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedPublishers, setApprovedPublishers] = useState([]); // State to hold approved publishers

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
      return dateString; // Return original if invalid date
    }
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
console.log("camapign------>",campaign)
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
{/* 
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <BlockPublishers campaignId={campaign.id} />
        </Col>
        <Col xs={24} lg={12}>
          <Notes campaignId={campaign.id} />
        </Col>
      </Row> */}

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
  <Col xs={24} lg={12}>
    <BlockPublishers campaignId={campaign.id} />
  </Col>
  <Col xs={24} lg={12}>
    <ConversionTracking value={campaign.trackingScript} />
  </Col>
</Row>
    </div>
  );
};

export default CampaignDetailPage;
