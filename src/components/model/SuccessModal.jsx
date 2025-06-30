// src/components/SuccessModal.jsx
import React, { useEffect } from 'react';
import { Modal, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';


const { Text } = Typography;

const SuccessModal = ({ open, title, message, onClose }) => {
  // Auto‐close after 3 seconds when `open` becomes true
  useEffect(() => {
    let timer = null;
    if (open) {
      timer = setTimeout(() => {
        onClose();
      }, 4000); // 3000ms = 3 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, onClose]);

  return (
    <Modal
      visible={open}
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>{title || 'Success'}</span>
        </Space>
      }
      footer={null}
      onCancel={onClose}
      centered
      width={400}
      maskClosable={false}
      keyboard={false}
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Text>{message || 'Operation completed successfully.'}</Text>
      </div>
    </Modal>
  );
};

export default SuccessModal;
