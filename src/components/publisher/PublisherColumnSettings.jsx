
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
   onSave, // Add this new prop
  saveLoading, // Add this new prop for loading state
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
      width={350}
      
     // style={{width:"250px"}}
      className="column-settings-drawer"
    >
      <div className="column-controls">
        <Space>
          <Button size="small" style={{fontSize:"15px"}}  onClick={onSelectAll} className="select-all-btn">
            Select All
          </Button>
          <Button size="small" style={{fontSize:"15px"}}  onClick={onClearAll} className="clear-all-btn">
            Clear All
          </Button>
          <Button 
      size="small" 
      style={{fontSize:"15px"}} 
      onClick={onSave}
      loading={saveLoading}
      type="primary"
     className="select-all-btn"
    >
      Save
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