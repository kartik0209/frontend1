// src/components/RejectConfirmModal.jsx
import React from 'react';
import { Modal, Space, Alert, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';


const { Text } = Typography;

const RejectConfirmModal = ({
  open,
  companyName,
  onConfirm,
  onCancel,
  loading,
}) => {
  return (
    <Modal
      visible={open}
      title={
        <Space>
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Reject Company Registration</span>
        </Space>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yes, Reject"
      cancelText="Cancel"
      okButtonProps={{
        style: { backgroundColor: '#ff4d4f', color:"white", borderColor: '#ff4d4f' },
      }}
      okType="danger"
      centered
      width={500}
      maskClosable={false}
      keyboard={false}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="Confirm Company Rejection"
          description={
            <Text>
              Are you sure you want to reject <strong>"{companyName}"</strong>? 
              Once rejected, the company will not have access to the system unless they re‐submit.
            </Text>
          }
          type="warning"
          showIcon
        />

        <div
          className="modal-extra-info-reject"
          style={{
            padding: '16px',
            backgroundColor: '#fff1f0',
            borderRadius: '6px',
            border: '1px solid #ffa39e',
            marginTop: '16px',
          }}
        >
          <Text type="secondary">
            <strong>What happens next:</strong>
          </Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Company status will change to "Rejected"</li>
            <li>Admin will receive rejection notification</li>
            <li>Company cannot access any features until re‐approval</li>
          </ul>
        </div>
      </Space>
    </Modal>
  );
};

export default RejectConfirmModal;
