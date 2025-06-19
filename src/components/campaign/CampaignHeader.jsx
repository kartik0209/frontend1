import React from "react";
import { Button, Space, Typography } from "antd";
import {
  FilterOutlined,
  SettingOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const CampaignHeader = ({ onSearchClick, onColumnsClick, onExport }) => {
  return (
    <div className="campaign-header">
      <div className="header-title">
        <Title level={3} className="page-title">
          Manage Campaigns
        </Title>
        <Text type="secondary" className="page-subtitle">
          View and manage all your campaigns in one place
        </Text>
      </div>
      <Space className="header-actions">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={onSearchClick}
          className="search-btn"
        >
          Search Campaign
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

export default CampaignHeader;