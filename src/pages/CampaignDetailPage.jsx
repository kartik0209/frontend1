import React, { useState, useEffect } from 'react';
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
  Checkbox,
  message,
  Transfer,
  Table,
  Tooltip,
  Select,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
  CopyOutlined,
  BlockOutlined,
  FileTextOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
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

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Block Publishers Component
const BlockPublishers = ({ campaignId }) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [blockedPublishers, setBlockedPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchPublishers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.post('/common/publisher/list', {});
        if (response.data?.success) {
          setAllPublishers(response.data.data);
        }
        
        // Fetch blocked publishers for this campaign
        try {
          const blockedResponse = await apiClient.get(`/admin/campaign/${campaignId}/blocked-publishers`);
          if (blockedResponse.data?.success) {
            setBlockedPublishers(blockedResponse.data.data || []);
          }
        } catch (error) {
          // Handle if endpoint doesn't exist yet
          setBlockedPublishers([]);
        }
      } catch (error) {
        message.error('Failed to load publishers');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchPublishers();
    }
  }, [campaignId]);

  const handleBlockPublisher = async (publisherId) => {
    if (!publisherId) return;
    
    setSaveLoading(true);
    try {
      const response = await apiClient.post(`/admin/campaign/${campaignId}/block-publisher`, {
        publisherId: publisherId
      });
      
      if (response.data?.success) {
        const publisher = allPublishers.find(p => p.id === publisherId);
        setBlockedPublishers(prev => [...prev, publisher]);
        message.success('Publisher blocked successfully');
      }
    } catch (error) {
      message.error('Failed to block publisher');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUnblockPublisher = async (publisherId) => {
    setSaveLoading(true);
    try {
      const response = await apiClient.delete(`/admin/campaign/${campaignId}/block-publisher/${publisherId}`);
      
      if (response.data?.success) {
        setBlockedPublishers(prev => prev.filter(p => p.id !== publisherId));
        message.success('Publisher unblocked successfully');
      }
    } catch (error) {
      message.error('Failed to unblock publisher');
    } finally {
      setSaveLoading(false);
    }
  };

  const availablePublishers = allPublishers.filter(
    pub => !blockedPublishers.some(blocked => blocked.id === pub.id)
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
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Select Publishers</Text>
        <Select
          style={{ width: '100%', marginTop: 8 }}
          placeholder="Select publishers to block"
          onSelect={handleBlockPublisher}
          loading={loading}
          disabled={saveLoading}
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

      <Button 
        type="primary" 
        style={{ marginTop: 16, backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
        loading={saveLoading}
        disabled={blockedPublishers.length === 0}
      >
        Save
      </Button>
    </Card>
  );
};

// Notes Component
const Notes = ({ campaignId }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/admin/campaign/${campaignId}/notes`);
        if (response.data?.success) {
          setNotes(response.data.data?.notes || '');
        }
      } catch (error) {
        // Handle if endpoint doesn't exist yet
        setNotes('');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchNotes();
    }
  }, [campaignId]);

  const handleSaveNotes = async () => {
    setSaveLoading(true);
    try {
      const response = await apiClient.post(`/admin/campaign/${campaignId}/notes`, {
        notes: notes
      });
      
      if (response.data?.success) {
        message.success('Notes saved successfully');
      }
    } catch (error) {
      message.error('Failed to save notes');
    } finally {
      setSaveLoading(false);
    }
  };

  const toolbarButtons = [
    { icon: <BoldOutlined />, title: 'Bold' },
    { icon: <ItalicOutlined />, title: 'Italic' },
    { icon: <UnderlineOutlined />, title: 'Underline' },
    { icon: <StrikethroughOutlined />, title: 'Strikethrough' },
    { icon: <FontSizeOutlined />, title: 'Font Size' },
    { icon: <FontColorsOutlined />, title: 'Font Color' },
    { icon: <UnorderedListOutlined />, title: 'Bullet List' },
    { icon: <OrderedListOutlined />, title: 'Numbered List' },
    { icon: <AlignLeftOutlined />, title: 'Align' },
    { icon: <TableOutlined />, title: 'Table' },
    { icon: <LinkOutlined />, title: 'Link' },
    { icon: <PictureOutlined />, title: 'Image' },
    { icon: <ScissorOutlined />, title: 'Cut' },
    { icon: <UndoOutlined />, title: 'Undo' },
    { icon: <QuestionCircleOutlined />, title: 'Help' },
  ];

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
    >
      {/* Rich Text Editor Toolbar */}
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderBottom: 'none',
        padding: '8px',
        backgroundColor: '#fafafa',
        borderRadius: '6px 6px 0 0'
      }}>
        <Space size="small" wrap>
          {toolbarButtons.map((button, index) => (
            <Tooltip key={index} title={button.title}>
              <Button 
                type="text" 
                size="small" 
                icon={button.icon}
                style={{ minWidth: 32 }}
              />
            </Tooltip>
          ))}
          <Divider type="vertical" />
          <Select
            defaultValue="Fira Sans"
            size="small"
            style={{ width: 100 }}
            bordered={false}
          >
            <Option value="Fira Sans">Fira Sans</Option>
            <Option value="Arial">Arial</Option>
            <Option value="Times">Times</Option>
          </Select>
          <Select
            defaultValue="15"
            size="small"
            style={{ width: 60 }}
            bordered={false}
          >
            <Option value="12">12</Option>
            <Option value="14">14</Option>
            <Option value="15">15</Option>
            <Option value="16">16</Option>
            <Option value="18">18</Option>
          </Select>
        </Space>
      </div>

      {/* Text Area */}
      <TextArea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add your notes here..."
        rows={8}
        style={{ 
          borderRadius: '0 0 6px 6px',
          borderTop: 'none',
          resize: 'vertical'
        }}
        loading={loading}
      />

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
        >
          Add note
        </Button>
        <Button 
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSaveNotes}
          loading={saveLoading}
        >
          Save Notes
        </Button>
      </div>
    </Card>
  );
}; 

const PublisherAccess = ({ campaignId, onApprovedPublishersChange }) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [assignmentData, setAssignmentData] = useState([]);
  const [questionnaire, setQuestionnaire] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setAssignmentData([]);
      try {
        const allPubsResponse = await apiClient.post('/common/publisher/list', {});
        if (allPubsResponse.data?.success) {
          const formattedData = allPubsResponse.data.data.map(pub => ({
            key: pub.id.toString(),
            title: `(ID: ${pub.id}) ${pub.name}`,
            publisherData: pub,
          }));
          setAllPublishers(formattedData);
        } else {
          throw new Error("Failed to load publisher list.");
        }
        try {
            
        } catch (assignedError) {
            setTargetKeys([]);
            onApprovedPublishersChange && onApprovedPublishersChange([]);
        }
      } catch (error) {
        message.error(error.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) {
        fetchData();
    }
  }, [campaignId, onApprovedPublishersChange]);

  const handleChange = (newTargetKeys) => {
    setTargetKeys(newTargetKeys);
    
    // Update approved publishers when selection changes
    const approvedPublishers = allPublishers.filter(pub => 
      newTargetKeys.includes(pub.key)
    );
    onApprovedPublishersChange && onApprovedPublishersChange(approvedPublishers);
  };

  const handleSave = async () => {
    setSaveLoading(true);
    setAssignmentData([]);
    try {
      const response = await apiClient.post('/admin/campaign-assignment/assign', {
        campaignId: campaignId,
        publisherIds: targetKeys,
      });
      console.log("Response Data", response.data);
      if (response.data?.success) {
        message.success('Publisher access updated successfully!');
        setAssignmentData(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to update publisher access.');
      }
    } catch (error) {
      message.error(error.message || 'An error occurred while saving.');
    } finally {
      setSaveLoading(false);
    }
  };

  const getPublisherName = (publisherId) => {
    const publisher = allPublishers.find(p => p.key === publisherId.toString());
    return publisher ? publisher.title : `Publisher ID: ${publisherId}`;
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Link copied!');
  };

  const assignmentColumns = [
    {
      title: 'Publisher',
      dataIndex: 'publisherId',
      key: 'publisherId',
      render: getPublisherName,
    },
    {
      title: 'Generated Tracking Link',
      dataIndex: 'publisherLink',
      key: 'publisherLink',
      render: (link) => (
        <Space>
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          <Tooltip title="Copy Link">
            <Button icon={<CopyOutlined />} size="small" onClick={() => copyToClipboard(link)} />
          </Tooltip>
        </Space>
      )
    },
  ];

  return (
    <Card
      title="Publisher Access: Ask for Permission"
      bordered={false}
      headStyle={{ backgroundColor: '#fafafa' }}
      extra={<Button type="primary" onClick={handleSave} loading={saveLoading}>Save</Button>}
    >
      <div style={{ marginBottom: 16 }}>
        <Text strong>Questionnaire</Text>
        <Input.TextArea
          rows={2}
          placeholder="Write here what you want to ask publisher to run this campaign"
          value={questionnaire}
          onChange={(e) => setQuestionnaire(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </div>
      <Checkbox defaultChecked style={{ marginBottom: 16 }}>
        Also disable tracking links when removing access
      </Checkbox>
      <Transfer
        dataSource={allPublishers}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={item => item.title}
        listStyle={{ width: '100%', height: 300, border: '1px solid #d9d9d9', borderRadius: '2px' }}
        titles={['Pending', 'Approved']}
        showSearch
        loading={loading}
        filterOption={(inputValue, item) =>
            item.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
        }
        operations={['Approve', 'Deny']}
      />
      {assignmentData.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Generated Publisher Links</Title>
          <Table
            columns={assignmentColumns}
            dataSource={assignmentData.map(item => ({ ...item, key: item.id }))}
            pagination={false}
            size="small"
            bordered
          />
        </div>
      )}
    </Card>
  );
};

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvedPublishers, setApprovedPublishers] = useState([]);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/admin/campaign/${id}`);
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

  const handleApprovedPublishersChange = (publishers) => {
    setApprovedPublishers(publishers);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" tip="Loading Campaign Details..." /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '24px' }} />;
  }

  if (!campaign) {
    return <Alert message="No campaign data available." type="warning" showIcon style={{ margin: '24px' }} />;
  }

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Space align="center" size="large">
            <Link to="/campaigns" style={{ color: 'rgba(0,0,0,.85)' }}>
              <ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer' }}/>
            </Link>
            <Title level={4} style={{ marginBottom: 0 }}>
              Campaigns  ID: {campaign.id}
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
            extra={
              <Space>
                <Button icon={<DownloadOutlined />} />
                <Button icon={<UploadOutlined />} />
                <Button icon={<EditOutlined />} />
              </Space>
            }
          >
            <Descriptions column={1} bordered size="small" labelStyle={{ width: '35%' }}>
              <Descriptions.Item label="Title">{campaign.title}</Descriptions.Item>
              <Descriptions.Item label="Description">{campaign.description || 'No description available'}</Descriptions.Item>
              <Descriptions.Item label="Status">
                  <Tag color={campaign.status === 'active' ? 'green' : 'orange'}>
                  {campaign.status?.toUpperCase()}
                  </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Advertiser">
                  <a href="#">(ID: {campaign.company_id}) {campaign.company?.name}</a>
              </Descriptions.Item>
              <Descriptions.Item label="Category">{campaign.category || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Visibility">{campaign.visibility}</Descriptions.Item>
              <Descriptions.Item label="Objective">{campaign.objective}</Descriptions.Item>
              <Descriptions.Item label="Currency">{campaign.currency}</Descriptions.Item>
              <Descriptions.Item label="Commission Rate">{campaign.commission_rate ? `${campaign.commission_rate}%` : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Commission Type">{campaign.commission_type || 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Start Date">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="End Date">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Not specified'}</Descriptions.Item>
              <Descriptions.Item label="Created Date">{new Date(campaign.created_at).toLocaleDateString()}</Descriptions.Item>
              <Descriptions.Item label="Preview URL">
                  <a href={campaign.preview_url} target="_blank" rel="noopener noreferrer">
                  {campaign.preview_url}
                  </a>
              </Descriptions.Item>
              <Descriptions.Item label="Tracking URL">{campaign.tracking_url || 'Not specified'}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <TrackingLinkCard 
              campaignId={campaign.id} 
              approvedPublishers={approvedPublishers}
            />
            <PublisherAccess 
              campaignId={campaign.id}
              onApprovedPublishersChange={handleApprovedPublishersChange}
            />
          </Space>
        </Col>
      </Row>
      
      {/* Block Publishers and Notes in full width below */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <BlockPublishers campaignId={campaign.id} />
        </Col>
        <Col xs={24} lg={12}>
          <Notes campaignId={campaign.id} />
        </Col>
      </Row>
    </div>
  );
};

export default CampaignDetailPage;