import React, { useState, useEffect } from "react";
import { Card, message, Tag } from "antd";
import CampaignHeader from "../components/campaign/CampaignHeader";
import CampaignTable from "../components/campaign/CampaignTable";
import SearchModal from "../components/campaign/SearchModal";
import ColumnSettings from "../components/campaign/ColumnSettings";
import { columnOptions, baseColumns } from "../data/campaignData";
import apiClient from "../services/apiServices";
import { columnOptions, baseColumns } from "../data/campaignData";
import apiClient from "../services/apiServices";
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
    trackingMethod: false,
    conversionTrackingDomain: false,
    createdDate: false,
    startDate: false,
    startDate: false,
    expiryDate: false,
    redirectType: false,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // Create allColumns with enhanced render functions for API data structure
  // Create allColumns with enhanced render functions for API data structure
  const allColumns = baseColumns.map(column => {
    // Status column with campaignStatus field
    // Status column with campaignStatus field
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
            {status ? status.toUpperCase() : 'N/A'}
            {status ? status.toUpperCase() : 'N/A'}
          </Tag>
        ),
      };
    }
    
    // Title column
    // Title column
    if (column.key === 'title') {
      return {
        ...column,
        render: (text) => <span className="campaign-title">{text || 'N/A'}</span>,
        render: (text) => <span className="campaign-title">{text || 'N/A'}</span>,
      };
    }

    // Visibility column
    // Visibility column
    if (column.key === 'visibility') {
      return {
        ...column,
        render: (visibility) => (
          <Tag color={visibility === "private" ? "red" : "blue"}>
            {visibility ? visibility.toUpperCase() : 'N/A'}
            {visibility ? visibility.toUpperCase() : 'N/A'}
          </Tag>
        ),
      };
    }

    // Category column - handle array
    if (column.key === 'category') {
      return {
        ...column,
        render: (categories) => {
          if (Array.isArray(categories)) {
            return categories.map((cat, index) => (
              <Tag key={index} color="blue">{cat}</Tag>
            ));
          }
          return categories ? <Tag color="blue">{categories}</Tag> : 'N/A';
        },
      };
    }

    // Geo column - handle array
    if (column.key === 'geo') {
      return {
        ...column,
        render: (geoCoverage) => {
          if (Array.isArray(geoCoverage)) {
            return geoCoverage.join(', ');
          }
          return geoCoverage || 'N/A';
        },
      };
    }

    // Device column - handle array
    if (column.key === 'device') {
      return {
        ...column,
        render: (devices) => {
          if (Array.isArray(devices)) {
            return devices.map((device, index) => (
              <Tag key={index} color="cyan">{device}</Tag>
            ));
          }
          return devices ? <Tag color="cyan">{devices}</Tag> : 'N/A';
        },
      };
    }

    // Operating System column - handle array
    if (column.key === 'operatingSystem') {
      return {
        ...column,
        render: (os) => {
          if (Array.isArray(os)) {
            return os.map((system, index) => (
              <Tag key={index} color="purple">{system}</Tag>
            ));
          }
          return os ? <Tag color="purple">{os}</Tag> : 'N/A';
        },
      };
    }

    // Payout column with currency formatting
    if (column.key === 'payout') {
      return {
        ...column,
        render: (payout, record) => {
          const currency = record.currency || 'USD';
          return payout ? `${payout} ${currency}` : 'N/A';
        },
      };
    }

    // Revenue column with currency formatting
    if (column.key === 'revenue') {
      return {
        ...column,
        render: (revenue, record) => {
          const currency = record.currency || 'USD';
          return revenue ? `${revenue} ${currency}` : 'N/A';
        },
      };
    }

    // Created Date formatting
    if (column.key === 'createdDate') {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return 'N/A';
        },
      };
    }

    // Start Date formatting
    if (column.key === 'startDate') {
    // Category column - handle array
    if (column.key === 'category') {
      return {
        ...column,
        render: (categories) => {
          if (Array.isArray(categories)) {
            return categories.map((cat, index) => (
              <Tag key={index} color="blue">{cat}</Tag>
            ));
          }
          return categories ? <Tag color="blue">{categories}</Tag> : 'N/A';
        },
      };
    }

    // Geo column - handle array
    if (column.key === 'geo') {
      return {
        ...column,
        render: (geoCoverage) => {
          if (Array.isArray(geoCoverage)) {
            return geoCoverage.join(', ');
          }
          return geoCoverage || 'N/A';
        },
      };
    }

    // Device column - handle array
    if (column.key === 'device') {
      return {
        ...column,
        render: (devices) => {
          if (Array.isArray(devices)) {
            return devices.map((device, index) => (
              <Tag key={index} color="cyan">{device}</Tag>
            ));
          }
          return devices ? <Tag color="cyan">{devices}</Tag> : 'N/A';
        },
      };
    }

    // Operating System column - handle array
    if (column.key === 'operatingSystem') {
      return {
        ...column,
        render: (os) => {
          if (Array.isArray(os)) {
            return os.map((system, index) => (
              <Tag key={index} color="purple">{system}</Tag>
            ));
          }
          return os ? <Tag color="purple">{os}</Tag> : 'N/A';
        },
      };
    }

    // Payout column with currency formatting
    if (column.key === 'payout') {
      return {
        ...column,
        render: (payout, record) => {
          const currency = record.currency || 'USD';
          return payout ? `${payout} ${currency}` : 'N/A';
        },
      };
    }

    // Revenue column with currency formatting
    if (column.key === 'revenue') {
      return {
        ...column,
        render: (revenue, record) => {
          const currency = record.currency || 'USD';
          return revenue ? `${revenue} ${currency}` : 'N/A';
        },
      };
    }

    // Created Date formatting
    if (column.key === 'createdDate') {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return 'N/A';
        },
      };
    }

    // Start Date formatting
    if (column.key === 'startDate') {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return 'N/A';
        },
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return 'N/A';
        },
      };
    }

    // End Date formatting
    if (column.key === 'expiryDate') {
    // End Date formatting
    if (column.key === 'expiryDate') {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return 'N/A';
        },
      };
    }

    // Default render for other columns
    return {
      ...column,
      render: (value) => value || 'N/A',
    };
  });

  // Fetch campaigns from API
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/admin/campaign/list', {
        // Add any required parameters here
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success) {
        const campaignData = response.data.data || response.data.campaigns || [];
        console.log('Campaign Data:', campaignData);
        
        // Ensure each campaign has a unique key for the table
        const campaignsWithKeys = campaignData.map(campaign => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substr(2, 9)
        }));
        
        setCampaigns(campaignsWithKeys);
        message.success(`${campaignsWithKeys.length} campaigns loaded successfully!`);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      message.error(error.response?.data?.message || 'Failed to load campaigns');
      setCampaigns([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchCampaigns();
  }, []);

  const visibleTableColumns = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // Clean up search parameters
      const searchParams = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
          acc[key] = values[key];
        }
        return acc;
      }, {});
      
      console.log('Search params:', searchParams);
      
      const response = await apiClient.post('/admin/campaign/list', searchParams);
      
      console.log('Search response:', response.data);
      
      if (response.data && response.data.success) {
        const campaignData = response.data.data || response.data.campaigns || [];
        const campaignsWithKeys = campaignData.map(campaign => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substr(2, 9)
        }));
        
        setCampaigns(campaignsWithKeys);
        message.success(`Search completed! Found ${campaignsWithKeys.length} campaigns.`);
      } else {
        throw new Error(response.data?.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
      setSearchVisible(false);
    }
  };

  const handleExport = () => {
    if (campaigns.length === 0) {
      message.warning('No data to export');
      return;
    }

    if (campaigns.length === 0) {
      message.warning('No data to export');
      return;
    }

    const headers = visibleTableColumns.map((col) => col.title).join(",");
    const rows = campaigns.map((campaign) =>
      visibleTableColumns.map((col) => {
        let value = '';
        if (col.dataIndex && Array.isArray(col.dataIndex)) {
          // Handle nested properties like ['company', 'name']
          value = col.dataIndex.reduce((obj, key) => obj?.[key], campaign) || '';
        } else if (col.dataIndex) {
          value = campaign[col.dataIndex] || '';
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        
        // Escape commas and quotes for CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(",")
      visibleTableColumns.map((col) => {
        let value = '';
        if (col.dataIndex && Array.isArray(col.dataIndex)) {
          // Handle nested properties like ['company', 'name']
          value = col.dataIndex.reduce((obj, key) => obj?.[key], campaign) || '';
        } else if (col.dataIndex) {
          value = campaign[col.dataIndex] || '';
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
          value = value.join('; ');
        }
        
        // Escape commas and quotes for CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(",")
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
        onRefresh={fetchCampaigns}
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