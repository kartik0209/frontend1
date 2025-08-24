import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spin, Alert, Row, Col, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import apiClient from '../services/apiServices';
import CampaignDetailSkeleton from '../components/skeletons/CampaignDetailSkeleton';
import EditCampaignModal from './EditCampaignModal';
import CampaignDetailsCard from './CampaignDetailsCard';
import TrackingLinkCard from '../components/campaign/TrackingLinkCard';
import PublisherAccess from '../components/campaign/PublisherAccess';
import BlockPublishers from './BlockPublishers';
import ConversionTracking from '../components/campaign/ConversionTracking';
import { conversionTrackingOptions } from '../data/formOptions';
import '../styles/CampaignDetailPage.scss';

const { Title } = Typography;

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

  const handleTrackingTypeChange = async (newType) => {
    const originalCampaign = campaign;
    setCampaign(prev => ({ ...prev, conversionTracking: newType }));

    try {
      const response = await apiClient.put(`/admin/campaign/${id}`, { 
        conversionTracking: newType 
      });

      if (response.data?.success) {
        message.success('Tracking type updated successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to update tracking type.');
      }
    } catch (error) {
      message.error(error.message || 'An error occurred.');
      setCampaign(originalCampaign);
    }
  };

  const handleScriptChange = (newScript) => {
    setCampaign(prev => ({ ...prev, trackingScript: newScript }));
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
          <CampaignDetailsCard campaign={campaign} />
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