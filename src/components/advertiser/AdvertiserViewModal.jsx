// src/components/advertiser/AdvertiserViewModal.jsx
import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";

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
        <Descriptions.Item label="Full Name">
          {advertiserData.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {advertiserData.email}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(advertiserData.status)}>
            {advertiserData.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Reference ID">
          {advertiserData.reference_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Account Manager" span={2}>
          {advertiserData.account_manager || "N/A"}
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