// src/components/advertiser/AdvertiserAdvancedFilterDrawer.jsx
import React, { useState } from "react";
import { Drawer, Tabs, Button, Form, Space, Divider, Checkbox } from "antd";
import { FilterOutlined, SearchOutlined, SettingOutlined, CloseOutlined } from "@ant-design/icons";
import AdvertiserSearchForm from "./AdvertiserSearchForm";
import "../../styles/AdvancedFilterDrawer.scss";

const AdvertiserAdvancedFilterDrawer = ({
  visible,
  onClose,
  // Search props
  onSearch,
  searchLoading,
  // Column props
  visibleColumns,
  columnOptions,
  onColumnChange,
  onSelectAll,
  onClearAll,
  onSave,
  saveLoading,
}) => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("search");

  const handleSearch = (values) => {
    onSearch(values);
  };

  const handleClear = () => {
    form.resetFields();
  };

  const handleClose = () => {
    onClose();
    // Reset to search tab when closing
    setActiveTab("search");
  };

  const tabItems = [
    {
      key: "search",
      label: (
        <span className="tab-label">
          <SearchOutlined />
          Search
        </span>
      ),
      children: (
        <div className="tab-content search-tab">
          <AdvertiserSearchForm
            form={form}
            onFinish={handleSearch}
            onClear={handleClear}
            onClose={handleClose}
            loading={searchLoading}
          />
        </div>
      ),
    },
    {
      key: "columns",
      label: (
        <span className="tab-label">
          <SettingOutlined />
          Columns
        </span>
      ),
      children: (
        <div className="tab-content columns-tab">
          <div className="column-controls">
            <Space>
              <Button size="small" onClick={onSelectAll} className="control-btn">
                Select All
              </Button>
              <Button size="small" onClick={onClearAll} className="control-btn">
                Clear All
              </Button>
              <Button
                size="small"
                onClick={onSave}
                loading={saveLoading}
                type="primary"
                className="save-btn"
              >
                Save
              </Button>
            </Space>
          </div>

          <Divider style={{ margin: "16px 0" }} />

          <div className="column-checkboxes">
            {columnOptions.map((column) => (
              <div key={column.key} className="column-checkbox-item">
                <Checkbox
                  checked={visibleColumns[column.key]}
                  onChange={(e) => onColumnChange(column.key, e.target.checked)}
                  className="column-checkbox"
                >
                  {column.label}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="drawer-header">
          <FilterOutlined className="drawer-icon" />
          <span>Advanced Filters</span>
        </div>
      }
      placement="right"
      onClose={handleClose}
      open={visible}
      width={600}
      className="advanced-filter-drawer"
      closeIcon={<CloseOutlined />}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="filter-tabs"
      />
    </Drawer>
  );
};

export default AdvertiserAdvancedFilterDrawer;