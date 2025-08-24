import { useState, useEffect } from 'react';
import { message } from 'antd';
import apiClient from '../services/apiServices';

// Custom hook for managing campaign data
export const useCampaign = (campaignId) => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!campaignId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/admin/campaign/${campaignId}`);
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
  }, [campaignId]);

  const updateCampaign = (updatedData) => {
    setCampaign(prev => ({ ...prev, ...updatedData }));
  };

 const updateTrackingType = async (newType) => {
  const originalCampaign = campaign;
  setCampaign(prev => ({ ...prev, conversionTracking: newType }));

  try {
    const response = await apiClient.put(`/admin/campaign/${campaignId}`, { 
      conversionTracking: newType 
    });

    if (response.data?.success) {
      message.success('Tracking type updated successfully!');
      // Update with the actual response data to ensure consistency
      setCampaign(prev => ({ ...prev, ...response.data.data }));
    } else {
      throw new Error(response.data?.message || 'Failed to update tracking type.');
    }
  } catch (error) {
    message.error(error.message || 'An error occurred.');
    setCampaign(originalCampaign);
  }
};

  const updateTrackingScript = (newScript) => {
    setCampaign(prev => ({ ...prev, trackingScript: newScript }));
  };


  const refreshCampaign = async () => {
  try {
    const response = await apiClient.get(`/admin/campaign/${campaignId}`);
    if (response.data?.success) {
      setCampaign(response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.error('Failed to refresh campaign:', error);
  }
};
  return {
    campaign,
    loading,
    error,
    updateCampaign,
    updateTrackingType,
    updateTrackingScript,
    setCampaign,
    refreshCampaign,
  };
};

// Custom hook for managing publishers
export const usePublishers = (campaignId) => {
  const [allPublishers, setAllPublishers] = useState([]);
  const [blockedPublishers, setBlockedPublishers] = useState([]);
  const [approvedPublishers, setApprovedPublishers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPublishers = async () => {
      if (!campaignId) return;
      setLoading(true);
      try {
        const allPublishersResponse = await apiClient.post('/common/publisher/list', {});
        if (allPublishersResponse.data?.success) {
          setAllPublishers(allPublishersResponse.data.data);
        }

        const blockedResponse = await apiClient.get(`/admin/campaign/${campaignId}/blocked-publishers`);
        if (blockedResponse.data?.success) {
          setBlockedPublishers(blockedResponse.data.data || []);
        }
      } catch (error) {
        message.error('Failed to load publishers: ' + (error.message || 'An error occurred.'));
      } finally {
        setLoading(false);
      }
    };

    fetchPublishers();
  }, [campaignId]);

  const blockPublisher = async (publisherId) => {
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
        return true;
      } else {
        message.error(response.data?.message || 'Failed to block publisher');
        return false;
      }
    } catch (error) {
      message.error('Failed to block publisher: ' + (error.message || 'An error occurred.'));
      return false;
    }
  };

  const unblockPublisher = async (publisherId) => {
    try {
      const response = await apiClient.delete(`/admin/campaign/${campaignId}/block-publisher/${publisherId}`);

      if (response.data?.success) {
        setBlockedPublishers(prev => prev.filter(p => p.id.toString() !== publisherId.toString()));
        message.success('Publisher unblocked successfully');
        return true;
      } else {
        message.error(response.data?.message || 'Failed to unblock publisher');
        return false;
      }
    } catch (error) {
      message.error('Failed to unblock publisher: ' + (error.message || 'An error occurred.'));
      return false;
    }
  };

  return {
    allPublishers,
    blockedPublishers,
    approvedPublishers,
    loading,
    blockPublisher,
    unblockPublisher,
    setApprovedPublishers
  };
};