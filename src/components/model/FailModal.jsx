// src/components/FailModal.jsx
import React from 'react';
import { Modal, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';


const { Text } = Typography;

const FailModal = ({ open, title, message, onOk }) => {
  return (
    <Modal
      visible={open}
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>{title || 'Operation Failed'}</span>
        </Space>
      }
      onOk={onOk}
      onCancel={onOk}
      okText="OK"
      cancelButtonProps={{ style: { display: 'none' } }}
      centered
      width={400}
      maskClosable={false}
      keyboard={false}
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Text type="danger">{message || 'Something went wrong. Please try again.'}</Text>
      </div>
    </Modal>
  );
};

export default FailModal;
