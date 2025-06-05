import React from 'react';
import { Modal, Space, Alert, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ApproveConfirmModal = ({ 
  open, 
  companyName, 
  onConfirm, 
  onCancel, 
  loading 
}) => {
  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>Approve Company Registration</span>
        </Space>
      }
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yes, Approve"
      cancelText="Cancel"
      okType="primary"
      centered
      width={500}
      maskClosable={false}
      keyboard={false}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Confirm Company Approval"
          description={
            <Text>
              Are you sure you want to approve <strong>"{companyName}"</strong>? 
              Once approved, the company will gain access to the system and can start using all features.
            </Text>
          }
          type="info"
          showIcon
        />
        
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f6ffed', 
          borderRadius: '6px', 
          border: '1px solid #b7eb8f' 
        }}>
          <Text type="secondary">
            <strong>What happens next:</strong>
          </Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Company status will change to "Approved"</li>
            <li>Admin will receive approval notification</li>
            <li>Company can access the dashboard immediately</li>
            <li>All company features will be unlocked</li>
          </ul>
        </div>
      </Space>
    </Modal>
  );
};

export default ApproveConfirmModal;