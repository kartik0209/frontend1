// src/components/user/UserViewModal.jsx
import React from "react";
import { Modal, Descriptions, Tag, Avatar, Space, Typography } from "antd";
import { 
  UserOutlined,
  CalendarOutlined,
  MailOutlined
} from "@ant-design/icons";
import "../../styles/Userview.scss"

const { Text, Title } = Typography;

const UserViewModal = ({ visible, onClose, userData }) => {
  if (!userData) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'green',
      'Inactive': 'default',
      
      
    };
    return statusColors[status] || 'default';
  };

  const getRoleColor = (role) => {
    const roleColors = {
 
      advertiser: "green",
      publisher: "cyan",
     
    };
    return roleColors[role?.toLowerCase()] || "default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Modal
     
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="user-view-modal"
    >
      <div className="user-modal__profile">
        <div className="user-modal__profile-container">
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
            className="user-modal__profile-avatar"
          >
            {userData.name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="user-modal__profile-info">
            <Title level={3} className="user-modal__profile-name">
              {userData.name}
            </Title>
            <Text type="secondary" className="user-modal__profile-email">
              {userData.email}
            </Text>
          </div>
        </div>
      </div>

      <Descriptions 
        bordered 
        column={{ xs: 1, sm: 1, md: 2 }} 
        size="middle"
        className="user-modal__descriptions"
      >
        <Descriptions.Item 
          label={
            <Space>
              <UserOutlined />
              User ID
            </Space>
          }
        >
          <Text code>{userData.id}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item 
          label={
            <Space>
              <MailOutlined />
              Email
            </Space>
          }
        >
          <Text copyable>{userData.email}</Text>
        </Descriptions.Item>

        <Descriptions.Item 
          label="Role"
        >
          <Tag 
            color={getRoleColor(userData.role)} 
            className="user-modal__role-tag"
          >
            {userData.role?.toUpperCase() || 'N/A'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item 
          label={
            <Space>
              <CalendarOutlined />
              Created Date
            </Space>
          }
        >
          <div className="user-modal__date-info">
            <Text>{formatSimpleDate(userData.created_at)}</Text>
            <Text type="secondary" className="user-modal__date-detail">
              {formatDate(userData.created_at)}
            </Text>
          </div>
        </Descriptions.Item>

        <Descriptions.Item 
          label="Last Login"
          span={2}
        >
          {userData.last_login ? (
            <div className="user-modal__date-info">
              <Text>{formatSimpleDate(userData.last_login)}</Text>
              <Text type="secondary" className="user-modal__date-detail">
                {formatDate(userData.last_login)}
              </Text>
            </div>
          ) : (
            <Text type="secondary">Never logged in</Text>
          )}
        </Descriptions.Item>
      </Descriptions>

      {/* Additional Info Section */}
      <div className="user-modal__additional-info">
        <Title level={5} className="user-modal__additional-info-title">
          Additional Information
        </Title>
        <Space direction="vertical" size="small" className="user-modal__additional-info-content">
          <div className="user-modal__info-row">
            <Text type="secondary">Account Age:</Text>
            <Text>
              {userData.created_at ? 
                Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                : 'N/A'
              }
            </Text>
          </div>
          <div className="user-modal__info-row">
            <Text type="secondary">Last Activity:</Text>
            <Text>
              {userData.last_login ? 
                Math.floor((Date.now() - new Date(userData.last_login).getTime()) / (1000 * 60 * 60 * 24)) + ' days ago'
                : 'Never'
              }
            </Text>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default UserViewModal;