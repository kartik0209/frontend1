// src/components/campaign/CampaignViewModal.jsx
import React from "react";
import { Modal, Descriptions, Tag, Switch } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const CampaignViewModal = ({ visible, onClose, campaignData }) => {
  if (!campaignData) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'active': 'green',
      'paused': 'orange',
      'draft': 'default',
      'completed': 'blue',
      'cancelled': 'red',
      'scheduled': 'purple'
    };
    return statusColors[status?.toLowerCase()] || 'default';
  };

  const getVisibilityColor = (visibility) => {
    const colors = {
      'public': 'blue',
      'private': 'red',
      'limited': 'orange'
    };
    return colors[visibility?.toLowerCase()] || 'default';
  };

  const getObjectiveColor = (objective) => {
    const colors = {
      'awareness': 'blue',
      'consideration': 'orange',
      'conversion': 'green',
      'retention': 'purple'
    };
    return colors[objective?.toLowerCase()] || 'default';
  };

  const getCurrencyColor = (currency) => {
    const colors = {
      'USD': 'green',
      'EUR': 'blue',
      'GBP': 'purple',
      'INR': 'orange',
      'CAD': 'cyan',
      'AUD': 'gold'
    };
    return colors[currency] || 'default';
  };

  const renderTags = (tags, color = "blue") => {
    if (!tags || (Array.isArray(tags) && tags.length === 0)) {
      return "N/A";
    }
    
    if (Array.isArray(tags)) {
      return tags.map((tag, index) => (
        <Tag key={index} color={color} style={{ marginBottom: 4 }}>
          {tag}
        </Tag>
      ));
    }
    
    return (
      <Tag color={color} style={{ marginBottom: 4 }}>
        {tags}
      </Tag>
    );
  };

  const renderArrayAsString = (arr) => {
    if (!arr) return "N/A";
    if (Array.isArray(arr)) {
      return arr.join(", ");
    }
    return arr;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return "N/A";
    return `${amount} ${currency}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <EyeOutlined className="modal-icon" />
          <span>Campaign Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="campaign-view-modal"
    >
      <Descriptions bordered column={2} size="small">
        {/* Basic Information */}
        <Descriptions.Item label="Campaign ID">
          {campaignData.id}
        </Descriptions.Item>
        <Descriptions.Item label="Title">
          <span className="campaign-title">{campaignData.title || "N/A"}</span>
        </Descriptions.Item>
        
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(campaignData.status)}>
            {campaignData.status ? campaignData.status.toUpperCase() : 'N/A'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Visibility">
          <Tag color={getVisibilityColor(campaignData.visibility)}>
            {campaignData.visibility ? campaignData.visibility.toUpperCase() : 'N/A'}
          </Tag>
        </Descriptions.Item>

        {/* Advertiser Information */}
        <Descriptions.Item label="Advertiser ID">
          {campaignData.advertiserId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Advertiser Name">
          {campaignData.advertiser || "N/A"}
        </Descriptions.Item>

        {/* Campaign Details */}
        <Descriptions.Item label="Objective">
          <Tag color={getObjectiveColor(campaignData.objective)}>
            {campaignData.objective || "N/A"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {renderTags(campaignData.category, "blue")}
        </Descriptions.Item>

        {/* Geographic and Targeting */}
        <Descriptions.Item label="Geo Coverage" span={2}>
          {renderArrayAsString(campaignData.geo)}
        </Descriptions.Item>
        
        <Descriptions.Item label="Device Targeting">
          {renderTags(campaignData.device, "cyan")}
        </Descriptions.Item>
        <Descriptions.Item label="Operating System">
          {renderTags(campaignData.operatingSystem, "purple")}
        </Descriptions.Item>

        {/* Financial Information */}
        <Descriptions.Item label="Payout">
          <Tag color={getCurrencyColor(campaignData.currency)}>
            {formatCurrency(campaignData.payout, campaignData.currency)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Revenue">
          <Tag color={getCurrencyColor(campaignData.currency)}>
            {formatCurrency(campaignData.revenue, campaignData.currency)}
          </Tag>
        </Descriptions.Item>

        {/* Technical Details */}
        <Descriptions.Item label="External Offer ID">
          {campaignData.externalOfferId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="App ID">
          {campaignData.appId || "N/A"}
        </Descriptions.Item>
        
        <Descriptions.Item label="App Name" span={2}>
          {campaignData.appName || "N/A"}
        </Descriptions.Item>

        {/* Tracking Information */}
        <Descriptions.Item label="Primary Tracking Domain" span={2}>
          {campaignData.primaryTrackingDomain || "N/A"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Tracking Method">
          {campaignData.trackingMethod || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Conversion Tracking Domain">
          {campaignData.conversionTrackingDomain || "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Redirect Type">
          {campaignData.redirectType || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          <Tag color={getCurrencyColor(campaignData.currency)}>
            {campaignData.currency || "USD"}
          </Tag>
        </Descriptions.Item>

        {/* Dates */}
        <Descriptions.Item label="Created Date">
          {formatDate(campaignData.createdDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {formatDate(campaignData.startDate)}
        </Descriptions.Item>
        
        <Descriptions.Item label="Expiry Date" span={2}>
          {formatDate(campaignData.expiryDate)}
        </Descriptions.Item>

        {/* Additional Information */}
        {campaignData.description && (
          <Descriptions.Item label="Description" span={2}>
            {campaignData.description}
          </Descriptions.Item>
        )}
        
        {campaignData.terms && (
          <Descriptions.Item label="Terms & Conditions" span={2}>
            {campaignData.terms}
          </Descriptions.Item>
        )}

        {campaignData.restrictions && (
          <Descriptions.Item label="Restrictions" span={2}>
            {campaignData.restrictions}
          </Descriptions.Item>
        )}

        {/* System Information */}
        <Descriptions.Item label="Last Updated">
          {formatDate(campaignData.updatedAt || campaignData.updated_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Active">
          <Switch
            checked={campaignData.status?.toLowerCase() === 'active'}
            disabled
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default CampaignViewModal;