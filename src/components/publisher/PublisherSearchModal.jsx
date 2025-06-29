// src/components/publisher/PublisherSearchModal.jsx
import React from "react";
import { Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PublisherSearchForm from "./PublisherSearchForm";

const PublisherSearchModal = ({ visible, onClose, onSearch, loading }) => {
  const [form] = Form.useForm();

  const handleSearch = (values) => {
    onSearch(values);
  };

  const handleClear = () => {
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="modal-header">
          <SearchOutlined className="modal-icon" />
          <span>Search Publisher</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="search-modal"
    >
      <PublisherSearchForm
        form={form}
        onFinish={handleSearch}
        onClear={handleClear}
        onClose={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default PublisherSearchModal;