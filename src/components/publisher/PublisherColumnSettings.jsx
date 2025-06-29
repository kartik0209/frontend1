// src/components/publisher/PublisherColumnSettings.jsx
import React from "react";
import { Drawer, Button, Space, Divider, Checkbox } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const PublisherColumnSettings = ({
  visible,
  onClose,
  visibleColumns,
  columnOptions,
  onColumnChange,
  onSelectAll,
  onClearAll,
}) => {
  return (
    <Drawer
      title={
        <div className="drawer-header">
          <SettingOutlined className="drawer-icon" />
          <span>Column Settings</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className="column-settings-drawer"
    >
      <div className="column-controls">
        <Space>
          <Button size="small" onClick={onSelectAll} className="select-all-btn">
            Select All
          </Button>
          <Button size="small" onClick={onClearAll} className="clear-all-btn">
            Clear All
          </Button>
        </Space>
      </div>

      <Divider />

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
    </Drawer>
  );
};

export default PublisherColumnSettings;