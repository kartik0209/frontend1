// src/components/publisher/PublisherViewModal.jsx
import React from "react";
import { Modal, Descriptions, Tag, Switch } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const PublisherViewModal = ({ visible, onClose, publisherData }) => {
  if (!publisherData) return null;

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
          <span>Publisher Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="publisher-view-modal"
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="ID">
          {publisherData.id}
        </Descriptions.Item>
        <Descriptions.Item label="Full Name">
          {publisherData.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
          {publisherData.email}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(publisherData.status)}>
            {publisherData.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Entity Type">
          <Tag color={publisherData.entity_type === "Individual" ? "blue" : "purple"}>
            {publisherData.entity_type}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Country">
          {publisherData.country}
        </Descriptions.Item>
        <Descriptions.Item label="City">
          {publisherData.city}
        </Descriptions.Item>
        <Descriptions.Item label="State">
          {publisherData.state}
        </Descriptions.Item>
        <Descriptions.Item label="ZIP Code">
          {publisherData.zip_code}
        </Descriptions.Item>
        <Descriptions.Item label="Phone" span={2}>
          {publisherData.phone}
        </Descriptions.Item>
        <Descriptions.Item label="IM Type">
          {publisherData.im_type || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="IM Username">
          {publisherData.im_username || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Promotion Method" span={2}>
          {publisherData.promotion_method || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Reference ID">
          {publisherData.reference_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Email Notifications">
          <Switch
            checked={publisherData.notify_by_email}
            disabled
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Descriptions.Item>
        <Descriptions.Item label="Company Name" span={2}>
          {publisherData.signup_company_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Company Address" span={2}>
          {publisherData.signup_company_address || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {publisherData.created_at ? new Date(publisherData.created_at).toLocaleDateString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Last Updated">
          {publisherData.updated_at ? new Date(publisherData.updated_at).toLocaleDateString() : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PublisherViewModal;