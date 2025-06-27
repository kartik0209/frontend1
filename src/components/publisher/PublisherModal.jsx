// src/components/publisher/PublisherModal.jsx
import React from "react";
import { Modal, Form } from "antd";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import PublisherForm from "./PublisherForm";

const PublisherModal = ({ 
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
    <Modal
      title={
        <div className="modal-header">
          {isEdit ? <EditOutlined className="modal-icon" /> : <UserAddOutlined className="modal-icon" />}
          <span>{isEdit ? "Edit Publisher" : "Add New Publisher"}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="publisher-modal"
      destroyOnClose
    >
      <PublisherForm
        form={form}
        onFinish={handleSubmit}
        onCancel={onClose}
        loading={loading}
        isEdit={isEdit}
      />
    </Modal>
  );
};

export default PublisherModal;