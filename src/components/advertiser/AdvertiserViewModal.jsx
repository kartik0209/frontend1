// src/components/advertiser/AdvertiserViewModal.jsx
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const AdvertiserViewModal = ({ visible, onClose, advertiserData }) => {
  if (!advertiserData) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'green',
      'Pending': 'orange',
      'Suspended': 'purple',
      'Disabled': 'red',
      'Rejected': 'red',
      'Banned': 'red',
      'Inactive': 'default'
    };
    return statusColors[status] || 'default';
  };

  const renderTags = (tags) => {
    if (!tags || tags.length === 0) return "No tags";
    return tags.map((tag, index) => (
      <Tag key={index} color="blue">{tag}</Tag>
    ));
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <EyeOutlined className="modal-icon" />
          <span>Advertiser Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="advertiser-view-modal"
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="ID">
          {advertiserData.id}
        </Descriptions.Item>
        <Descriptions.Item label="Name">
          {advertiserData.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {advertiserData.email}
        </Descriptions.Item>
        <Descriptions.Item label="Company Name">
          {advertiserData.companyName}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {advertiserData.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(advertiserData.status)}>
            {advertiserData.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Reference ID">
          {advertiserData.reference_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Managers" span={2}>
          {advertiserData.managers || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Website URL" span={2}>
          {advertiserData.website_url ? (
            <a href={advertiserData.website_url} target="_blank" rel="noopener noreferrer">
              {advertiserData.website_url}
            </a>
          ) : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Country">
          {advertiserData.country || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="City">
          {advertiserData.city || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          {advertiserData.currency || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Entity Type">
          {advertiserData.entity_type || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Notifications">
          {advertiserData.notify ? (
            <Tag color="green" icon={<CheckCircleOutlined />}>Enabled</Tag>
          ) : (
            <Tag color="red" icon={<CloseCircleOutlined />}>Disabled</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tags" span={2}>
          {renderTags(advertiserData.tags)}
        </Descriptions.Item>
        <Descriptions.Item label="Notes" span={2}>
          {advertiserData.notes || "No notes available"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {advertiserData.created_at ? new Date(advertiserData.created_at).toLocaleDateString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {advertiserData.updated_at ? new Date(advertiserData.updated_at).toLocaleDateString() : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default AdvertiserViewModal;