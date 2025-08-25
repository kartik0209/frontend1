import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Row, Col, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import CampaignDetailSkeleton from '../components/skeletons/CampaignDetailSkeleton';
import EditCampaignModal from '../components/campaign/EditCampaignModal';
import CampaignDetailsCard from '../components/campaign/CampaignDetailsCard';
import TrackingLinkCard from '../components/campaign/TrackingLinkCard';
import PublisherAccess from '../components/campaign/PublisherAccess';
import BlockPublishers from '../components/campaign/BlockPublishers';
import ConversionTracking from '../components/campaign/ConversionTracking';
import { useCampaign } from '../hooks/useCampaign';
import { conversionTrackingOptions } from '../data/formOptions';
import '../styles/CampaignDetailPage.scss';
import CombinedPublisherManagement from '../components/campaign/CombinedPublisherManagement';

const { Title } = Typography;

const CampaignDetailPage = () => {
  const { id } = useParams();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [issaved, setIsSaved] = useState(false);
  const [approvedPublishers, setApprovedPublishers] = useState([]);


  const {
    campaign,
    loading,
    error,
    updateCampaign,
    updateTrackingType,
    updateTrackingScript,
    refreshCampaign
  } = useCampaign(id);


  const [publisherListVersion, setPublisherListVersion] = useState(0);
  const handleApprovedPublishersChange = useCallback((publishers) => {
    setApprovedPublishers(publishers);
      setPublisherListVersion(prev => prev + 1);
  }, []);

  const handleCampaignUpdate = (updatedCampaign) => {
    updateCampaign(updatedCampaign);
  };

  const handleTrackingTypeChange = async (newType) => {
    await updateTrackingType(newType);
  

  };

  const handleScriptChange = (newScript) => {
    updateTrackingScript(newScript);
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
      {/* Header */}
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


      {/* <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <CampaignDetailsCard campaign={campaign} />
        </Col>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <TrackingLinkCard
              campaignId={campaign.id}
              issaved={issaved}
              refreshTrigger={publisherListVersion}
            />
            <PublisherAccess
              campaignId={campaign.id}
              onApprovedPublishersChange={handleApprovedPublishersChange}
              setIsSaved={setIsSaved}
            />
          </Space>
        </Col>
      </Row> */}


      
      <Row gutter={[24, 24]}>
  <Col xs={24} lg={12}>
    <CampaignDetailsCard campaign={campaign} />
  </Col>
  <Col xs={24} lg={12}>
    <CombinedPublisherManagement
      campaignId={campaign.id}
      onApprovedPublishersChange={handleApprovedPublishersChange}
      setIsSaved={setIsSaved}
    />
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