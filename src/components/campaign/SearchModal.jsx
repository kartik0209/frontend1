import React from "react";
import { Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SearchForm from "./SearchForm";

const SearchModal = ({ visible, onClose, onSearch, loading }) => {
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
          <span>Search Campaign</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="search-modal"
    >
      <SearchForm
        form={form}
        onFinish={handleSearch}
        onClear={handleClear}
        onClose={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default SearchModal;