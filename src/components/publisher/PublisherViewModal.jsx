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
<<<<<<< HEAD
      'Suspended': 'purple',
      'Disabled': 'red',
      'Rejected': 'red',
      'Banned': 'red',
      'Inactive': 'default'
=======
      'Inactive': 'default',
      'Suspended': 'purple',
      'Disabled': 'red',
      'Rejected': 'red',
      'Banned': 'red'
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
    };
    return statusColors[status] || 'default';
  };

<<<<<<< HEAD
=======
  const getEntityTypeColor = (entityType) => {
    const colors = {
      'Individual': 'blue',
      'Company': 'purple',
      'Partnership': 'green'
    };
    return colors[entityType] || 'default';
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

  const renderTags = (tags) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return "N/A";
    }
    return tags.map(tag => (
      <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
        {tag}
      </Tag>
    ));
  };

>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
      width={800}
=======
      width={900}
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
      className="publisher-view-modal"
    >
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="ID">
          {publisherData.id}
        </Descriptions.Item>
<<<<<<< HEAD
        <Descriptions.Item label="Full Name">
          {publisherData.full_name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={2}>
=======
        <Descriptions.Item label="Name">
          {publisherData.name}
        </Descriptions.Item>
        <Descriptions.Item label="Username">
          {publisherData.username}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
          {publisherData.email}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(publisherData.status)}>
            {publisherData.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Entity Type">
<<<<<<< HEAD
          <Tag color={publisherData.entity_type === "Individual" ? "blue" : "purple"}>
=======
          <Tag color={getEntityTypeColor(publisherData.entity_type)}>
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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
<<<<<<< HEAD
        <Descriptions.Item label="Email Notifications">
          <Switch
            checked={publisherData.notify_by_email}
=======
        <Descriptions.Item label="Tax ID">
          {publisherData.tax_id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Referred By">
          {publisherData.referred_by || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Managers">
          {publisherData.managers || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          <Tag color={getCurrencyColor(publisherData.currency)}>
            {publisherData.currency || "N/A"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Notifications">
          <Switch
            checked={publisherData.notify}
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
            disabled
            checkedChildren="Yes"
            unCheckedChildren="No"
          />
        </Descriptions.Item>
<<<<<<< HEAD
        <Descriptions.Item label="Company Name" span={2}>
          {publisherData.signup_company_name || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Company Address" span={2}>
          {publisherData.signup_company_address || "N/A"}
=======
        <Descriptions.Item label="Tags" span={2}>
          {renderTags(publisherData.tags)}
        </Descriptions.Item>
        <Descriptions.Item label="Company Name" span={2}>
          {publisherData.companyName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Company Address" span={2}>
          {publisherData.companyAddress || "N/A"}
>>>>>>> 74f676f61720dd1cf91294d438002f09adf66eda
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