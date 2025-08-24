import React, { useState, useEffect } from 'react';
import { Card, Space, Typography, Select, Tag, Button, message } from 'antd';
import { BlockOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiServices'; // Adjust the path as needed

const { Text } = Typography;
const { Option } = Select;

const BlockPublishers = ({ campaignId }) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [blockedPublishers, setBlockedPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchPublishers = async () => {
      setLoading(true);
      try {
        const allPublishersResponse = await apiClient.post('/common/publisher/list', {});
        if (allPublishersResponse.data?.success) {
          setAllPublishers(allPublishersResponse.data.data);
        } else {
          message.error('Failed to load all publishers.');
        }

        const blockedResponse = await apiClient.get(`/admin/campaign/${campaignId}/blocked-publishers`);
        if (blockedResponse.data?.success) {
          setBlockedPublishers(blockedResponse.data.data || []);
        } else {
          setBlockedPublishers([]);
        }
      } catch (error) {
        message.error('Failed to load publishers: ' + (error.message || 'An error occurred.'));
        setBlockedPublishers([]);
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
          value={null}
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
        loading={saveLoading}
        disabled={blockedPublishers.length === 0 && availablePublishers.length === allPublishers.length}
      >
        Save
      </Button>
    </Card>
  );
};

export default BlockPublishers;
        
