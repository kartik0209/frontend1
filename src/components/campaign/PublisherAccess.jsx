import React, { useState, useEffect } from 'react';
import { Card, Transfer, Button, Spin, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiServices'; // Adjust the import path as necessary
import '../../styles/CampaignDetailPage.scss'; // Optional: Add your styles here

// PublisherAccess component to manage publisher approvals for campaigns




const PublisherAccess = ({ campaignId, onApprovedPublishersChange }) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [issaved, setIsSaved] = useState(false);

  // Fetch all publishers on component mount
  useEffect(() => {
    fetchPublishers();
  }, [campaignId]);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/common/publisher/list', {
        excludeApprovedForCampaign: true,
        campaign_id: campaignId
      });

      if (response.data?.success) {
        const publishersData = response.data.data.map(publisher => ({
          key: publisher.id.toString(),
          title: publisher.name,
          id: publisher.id,
          name: publisher.name
        }));
        
        setAllPublishers(publishersData);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch publishers');
      }
    } catch (error) {
      message.error(error.message || 'Failed to fetch publishers');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchApprovedPublishers = async () => {
      if (!campaignId) return;

      setLoading(true);
     

      try {
        const response = await apiClient.get(
          `/common/publisher/${campaignId}/approved-publishers`
        );
        if (response.data?.success) {
         console.log("response.data.data",response.data.data);
        } else {
          throw new Error(
            response.data?.message || "Failed to load publishers."
          );
        }
      } catch (error) {
        message.error(
          error.message || "An error occurred while fetching publishers."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPublishers();
  }, [campaignId,issaved]);






  // Handle transfer changes (approve/remove publishers)
  const handleTransferChange = (newTargetKeys, direction, moveKeys) => {
    console.log('Transfer change:', { newTargetKeys, direction, moveKeys });
    setTargetKeys(newTargetKeys);

    // Update parent with current selection for immediate UI feedback
    const currentApproved = allPublishers.filter(pub =>
      newTargetKeys.includes(pub.key)
    );
    onApprovedPublishersChange?.(currentApproved);
  };

  // Save approved publishers - API call only happens here
  const handleSave = async () => {
    if (!targetKeys.length) {
      message.warning('Please select at least one publisher to approve');
      return;
    }

    setSaveLoading(true);
    try {
      const response = await apiClient.post('/common/publisher/approve', {
        campaignId: Number(campaignId),
        publisherIds: targetKeys.map(Number),
      });

      if (response.data?.success) {
        message.success('Publishers approved successfully!');
        
        // Reset the right side (clear targetKeys)
        setTargetKeys([]);
        
        // Update parent with empty approved list
        onApprovedPublishersChange?.([]);

        fetchPublishers(); 
        setIsSaved(true);
      } else {
        throw new Error(response.data?.message || 'Failed to approve publishers');
      }
    } catch (error) {
      message.error(error.message || 'Failed to save publisher approval');
    } finally {
      setSaveLoading(false);
    }
  };

  // Filter function for search
  const filterPublishers = (inputValue, item) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase());

  // Simple render function to show only publisher name
const renderItem = (item) => `${item.id} - ${item.name}`;


  if (loading) {
    return (
      <Card 
        title="Approve Publishers" 
        bordered={false}
        headStyle={{ backgroundColor: '#fafafa' }}
        className="campaign-card"
      >
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Loading publishers...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Approve Publishers"
      bordered={false}
      headStyle={{ backgroundColor: '#fafafa' }}
      className="campaign-card"
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={saveLoading}
          disabled={!targetKeys.length}
          style={{
            backgroundColor: "transparent",
            color: 'black',
            border: "none"
          }}
        >
          Save ({targetKeys.length})
        </Button>
      }
    >
      <Transfer
        dataSource={allPublishers}
        targetKeys={targetKeys}
        onChange={handleTransferChange}
        render={renderItem}
        titles={['Available Publishers', 'Approved Publishers']}
        listStyle={{
          width: '40%',
          height: 300,
          border: '1px solid #d9d9d9',
          borderRadius: '6px'
        }}
        operations={['Approve', 'Remove']}
        showSearch
        filterOption={filterPublishers}
        locale={{
          itemsUnit: 'publishers',
          itemUnit: 'publisher',
          searchPlaceholder: 'Search publishers...'
        }}
        oneWay={false}
      />
    </Card>
  );
};
export default PublisherAccess;