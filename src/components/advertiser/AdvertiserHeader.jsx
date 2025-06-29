// src/components/advertiser/AdvertiserHeader.jsx
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

const AdvertiserHeader = ({ 
  onSearchClick, 
  onColumnsClick, 
  onExport, 
  onAddAdvertiser, 
  onRefresh 
}) => {
  return (
    <div className="advertiser-header">
      <div className="header-title">
        <Title level={3} className="page-title">
          Manage Advertisers
        </Title>
        <Text type="secondary" className="page-subtitle">
          View and manage all your advertisers in one place
        </Text>
      </div>
      <Space className="header-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddAdvertiser}
          className="add-btn"
        >
          Add Advertiser
        </Button>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={onSearchClick}
          className="search-btn"
        >
          Search Advertiser
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

export default AdvertiserHeader;