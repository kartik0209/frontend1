// src/components/publisher/PublisherHeader.jsx
import React from "react";
import { Button, Space, Typography } from "antd";
import {
  FilterOutlined,
  SettingOutlined,
  DownloadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const PublisherHeader = ({ 
  onSearchClick, 
  onColumnsClick, 
  onExport, 
  onAddPublisher, 
  onRefresh 
}) => {
  return (
    <div className="publisher-header">
      <div className="header-title">
        <Title level={3} className="page-title">
          Manage Publishers
        </Title>
        <Text type="secondary" className="page-subtitle">
          View and manage all your publishers in one place
        </Text>
      </div>
      <Space className="header-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddPublisher}
          className="add-btn"
        >
          Add Publisher
        </Button>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={onSearchClick}
          className="search-btn"
        >
          Search Publisher
        </Button>
        <Button
          icon={<SettingOutlined />}
          onClick={onColumnsClick}
          className="columns-btn"
        >
          Columns
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={onExport}
          className="export-btn"
        >
          Export
        </Button>
      
      </Space>
    </div>
  );
};

export default PublisherHeader;