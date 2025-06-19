import React, { useState, useEffect } from "react";
import { Card, message, Tag } from "antd";
import CampaignHeader from "../components/campaign/CampaignHeader";
import CampaignTable from "../components/campaign/CampaignTable";
import SearchModal from "../components/campaign/SearchModal";
import ColumnSettings from "../components/campaign/ColumnSettings";
import { sampleCampaigns, columnOptions, baseColumns } from "../data/campaignData";
import "../styles/CampaignManagement.scss";

const CampaignManagement = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultVisibleColumns = {
    id: true,
    title: true,
    status: true,
    advertiserId: true,
    advertiser: true,
    category: false,
    visibility: true,
    assignedPubs: true,
    objective: true,
    geo: true,
    payout: true,
    revenue: true,
    externalOfferId: false,
    appId: false,
    appName: false,
    device: false,
    operatingSystem: false,
    primaryTrackingDomain: false,
    todayConversion: false,
    trackMultipleConversions: false,
    dailyConversionCap: false,
    trackingMethod: false,
    blockedPublisher: false,
    conversionTrackingDomain: false,
    createdDate: false,
    expiryDate: false,
    redirectType: false,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // Create allColumns with render functions
  const allColumns = baseColumns.map(column => {
    if (column.key === 'status') {
      return {
        ...column,
        render: (status) => (
          <Tag
            color={
              status === "active"
                ? "green"
                : status === "paused"
                ? "orange"
                : "red"
            }
            className="status-tag"
          >
            {status.toUpperCase()}
          </Tag>
        ),
      };
    }
    
    if (column.key === 'title') {
      return {
        ...column,
        render: (text) => <span className="campaign-title">{text}</span>,
      };
    }

    if (column.key === 'visibility') {
      return {
        ...column,
        render: (visibility) => (
          <Tag color={visibility === "private" ? "red" : "blue"}>
            {visibility.toUpperCase()}
          </Tag>
        ),
      };
    }

    if (column.key === 'todayConversion') {
      return {
        ...column,
        render: (value) => <span className="conversion-count">{value}</span>,
      };
    }

    if (column.key === 'trackMultipleConversions') {
      return {
        ...column,
        render: (value) => (
          <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
        ),
      };
    }
    
    return column;
  });

  useEffect(() => {
    setCampaigns(sampleCampaigns);
  }, []);

  const visibleTableColumns = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  const handleSearch = (values) => {
    setLoading(true);
    console.log("Search values:", values);
    setTimeout(() => {
      setLoading(false);
      setSearchVisible(false);
      message.success("Search completed successfully!");
    }, 1000);
  };

  const handleExport = () => {
    const headers = visibleTableColumns.map((col) => col.title).join(",");
    const rows = campaigns.map((campaign) =>
      visibleTableColumns.map((col) => campaign[col.dataIndex] || "").join(",")
    );
    const csvContent = [headers, ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `campaigns_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("Campaign data exported successfully!");
  };

  const handleColumnChange = (columnKey, checked) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: checked,
    }));
  };

  const handleSelectAll = () => {
    const allSelected = {};
    columnOptions.forEach((col) => {
      allSelected[col.key] = true;
    });
    setVisibleColumns(allSelected);
  };

  const handleClearAll = () => {
    const allCleared = {};
    columnOptions.forEach((col) => {
      allCleared[col.key] = false;
    });
    setVisibleColumns(allCleared);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="campaign-management">
      <CampaignHeader
        onSearchClick={() => setSearchVisible(true)}
        onColumnsClick={() => setColumnSettingsVisible(true)}
        onExport={handleExport}
      />

      <Card className="campaign-table-card">
        <CampaignTable
          campaigns={campaigns}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
        />
      </Card>

      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        loading={loading}
      />

      <ColumnSettings
        visible={columnSettingsVisible}
        onClose={() => setColumnSettingsVisible(false)}
        visibleColumns={visibleColumns}
        columnOptions={columnOptions}
        onColumnChange={handleColumnChange}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default CampaignManagement;