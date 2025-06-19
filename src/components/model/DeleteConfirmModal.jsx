
import React from 'react';
import { Modal, Space, Alert, Typography } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const DeleteConfirmModal = ({
  open,
  userName,
  userEmail,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Modal
      open={open}
      title={
        <Space>
          <DeleteOutlined style={{ color: '#ff4d4f' }} />
          <span>Delete User Confirmation</span>
        </Space>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yes, Delete User"
      cancelText="Cancel"
      okType="danger"
      centered
      width={520}
      maskClosable={false}
      keyboard={false}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Warning: This action cannot be undone"
          description={
            <div>
              <Text>
                Are you sure you want to permanently delete the user{' '}
                <strong>"{userName}"</strong>?
              </Text>
              <br />
              <Text type="secondary">
                Email: {userEmail}
              </Text>
            </div>
          }
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
        />

        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff2f0',
            borderRadius: '6px',
            border: '1px solid #ffccc7',
          }}
        >
          <Text type="secondary">
            <strong>What happens when you delete this user:</strong>
          </Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>User will be permanently removed from the system</li>
            <li>All user data and permissions will be deleted</li>
            <li>User will lose access to all features immediately</li>
            <li>This action cannot be reversed</li>
          </ul>
        </div>

        <Alert
          message="Important"
          description="Make sure you have backed up any important data associated with this user before proceeding."
          type="info"
          showIcon
          style={{ marginTop: '12px' }}
        />
      </Space>
    </Modal>
  );
};

export default DeleteConfirmModal;