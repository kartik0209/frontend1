import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ConfirmModal = ({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonProps = {},
  cancelButtonProps = {},
  danger = false
}) => {
  return (
    <Modal
      open={open}
      title={
        <Space>
          <QuestionCircleOutlined style={{ 
            color: danger ? '#ff4d4f' : '#faad14', 
            fontSize: '18px' 
          }} />
          <span style={{ fontWeight: 600 }}>
            {title || 'Confirm Action'}
          </span>
        </Space>
      }
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ 
        danger: danger,
        ...confirmButtonProps
      }}
      cancelButtonProps={cancelButtonProps}
      centered
      width={400}
      maskClosable={false}
      keyboard={true}
      className="confirm-modal"
    >
      <div style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{ fontSize: '16px', color: '#333' }}>
          {message || 'Are you sure you want to proceed?'}
        </Text>
      </div>
    </Modal>
  );
};

export default ConfirmModal;