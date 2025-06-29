// src/components/advertiser/AdvertiserModal.jsx
import React from "react";
import { Drawer, Form } from "antd";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import AdvertiserForm from "./AdvertiserForm";

const AdvertiserModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  loading, 
  editData = null, 
  isEdit = false 
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && isEdit && editData) {
      form.setFieldsValue(editData);
    } else if (visible && !isEdit) {
      form.resetFields();
    }
  }, [visible, isEdit, editData, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <Drawer
      title={
        <div className="drawer-header">
          {isEdit ? <EditOutlined className="drawer-icon" /> : <UserAddOutlined className="drawer-icon" />}
          <span>{isEdit ? "Edit Advertiser" : "Add New Advertiser"}</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={500}
      className="advertiser-drawer"
      destroyOnClose
      maskClosable={false}
      headerStyle={{
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }}
      bodyStyle={{
        padding: '24px',
        height: 'calc(100vh - 108px)',
        overflow: 'auto'
      }}
      footerStyle={{
        padding: '16px 24px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa'
      }}
    >
      <AdvertiserForm
        form={form}
        onFinish={handleSubmit}
        onCancel={onClose}
        loading={loading}
        isEdit={isEdit}
      />
    </Drawer>
  );
};

export default AdvertiserModal;