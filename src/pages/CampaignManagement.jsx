import React, { useState, useEffect, useMemo } from "react";
import {Button, Card, Input, Tag, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import CampaignHeader from "../components/campaign/CampaignHeader";
import CampaignTable from "../components/campaign/CampaignTable";
import SearchModal from "../components/campaign/SearchModal";
import ColumnSettings from "../components/campaign/ColumnSettings";
import CampaignModal from "../components/campaign/CampaignModal";
import CampaignViewModal from "../components/campaign/CampaignViewModal";
import { columnOptions, baseColumns } from "../data/campaignData";
import apiClient from "../services/apiServices";
import { fetchCampaigns, updateCampaignStatus as updateCampaignStatusThunk } from "../store/campaignsSlice";
import { debounce } from "../utils/helpers";
import "../styles/CampaignManagement.scss";
import TableSkeleton from "../components/skeletons/TableSkeleton";
import { useNavigate } from "react-router-dom";
import CampaignAdvancedFilterDrawer from "../components/campaign/CampaignAdvancedFilterDrawer";
import {
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const CampaignManagement = () => {
  const dispatch = useDispatch();
  const { list: campaigns, loading } = useSelector((state) => state.campaigns);
  const navigate = useNavigate();
  const [searchVisible, setSearchVisible] = useState(false);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
const [selectedCampaign, setSelectedCampaign] = useState(null);
const [editModalVisible, setEditModalVisible] = useState(false);

const [isFilterVisible, setIsFilterVisible] = useState(false);
const [searchText, setSearchText] = useState("");
const [filteredCampaigns, setFilteredCampaigns] = useState([]);


// CHANGE: Update the handleQuickSearch function for Campaigns to search by ID, Title, and Advertiser

  const doQuickSearch = (value, list) => {
    if (!value.trim()) {
      setFilteredCampaigns(list);
      return;
    }

    const searchValue = value.toLowerCase();

    const filtered = list.filter((campaign) => {
      const id = (campaign.id || "").toString().toLowerCase();
      const title = (campaign.title || "").toLowerCase();
      const advertiserName = campaign.advertiser
        ? (typeof campaign.advertiser === "string"
            ? campaign.advertiser
            : campaign.advertiser.name || ""
          ).toLowerCase()
        : "";
      const trackingSlug = (campaign.trackingSlug || "").toLowerCase();

      return (
        id.includes(searchValue) ||
        title.includes(searchValue) ||
        advertiserName.includes(searchValue) ||
        trackingSlug.includes(searchValue)
      );
    });

    setFilteredCampaigns(filtered);
  };

  const debouncedQuickSearch = useMemo(
    () =>
      debounce((value, list) => {
        doQuickSearch(value, list);
      }, 400),
    []
  );

  const handleQuickSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedQuickSearch(value, campaigns);
  };

  // Keep filtered list in sync with campaigns
  useEffect(() => {
    setFilteredCampaigns(campaigns);
  }, [campaigns]);
// 1. Add these state variables in CampaignManagement component
const [saveLoading, setSaveLoading] = useState(false);

// 2. Add these API functions in CampaignManagement component
const saveColumnPreferences = async () => {
  setSaveLoading(true);
  try {
    const selectedFields = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    
    const response = await apiClient.post('/common/user-preference', {
      form: 'campaign',
      fields: selectedFields
    });
    
    if (response.data && response.data.success) {
      message.success('Column preferences saved successfully!');
      setColumnSettingsVisible(false);
    } else {
      throw new Error(response.data?.message || 'Failed to save preferences');
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    message.error(error.response?.data?.message || 'Failed to save preferences');
  } finally {
    setSaveLoading(false);
  }
};

const fetchColumnPreferences = async () => {
  try {
    const response = await apiClient.get('/common/user-preference/campaign');
    
    if (response.data && response.data.success && response.data.data) {
      const savedFields = response.data.data.fields || [];
      const newVisibleColumns = {};
      
      // Set all columns to false first
      columnOptions.forEach((col) => {
        newVisibleColumns[col.key] = false;
      });
      
      // Set saved fields to true
      savedFields.forEach((field) => {
        if (newVisibleColumns.hasOwnProperty(field)) {
          newVisibleColumns[field] = true;
        }
      });
      
      setVisibleColumns(newVisibleColumns);
    }
  } catch (error) {
    console.error('Error fetching column preferences:', error);
    // If no preferences found, use default columns
  }
};

// 3. Update the useEffect to fetch preferences on component mount
useEffect(() => {
  dispatch(fetchCampaigns({}));
  fetchColumnPreferences(); // Add this line
}, [dispatch]);




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
    expiryDate: false,
    redirectType: false,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // Create allColumns with enhanced render functions for API data structure
  const allColumns = baseColumns.map((column) => {
    // Status column with campaignStatus field
    if (column.key === "status") {
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
            {status ? status.toUpperCase() : "N/A"}
          </Tag>
        ),
      };
    }

    // Title column
    if (column.key === "title") {
      return {
        ...column,
        render: (text) => (
          <span className="campaign-title">{text || "N/A"}</span>
        ),
      };
    }

    // Visibility column
    if (column.key === "visibility") {
      return {
        ...column,
        render: (visibility) => (
          <Tag color={visibility === "private" ? "red" : "blue"}>
            {visibility ? visibility.toUpperCase() : "N/A"}
          </Tag>
        ),
      };
    }

    // Category column - handle array
    if (column.key === "category") {
      return {
        ...column,
        render: (categories) => {
          if (Array.isArray(categories)) {
            return categories.map((cat, index) => (
              <Tag key={index} color="blue">
                {cat}
              </Tag>
            ));
          }
          return categories ? <Tag color="blue">{categories}</Tag> : "N/A";
        },
      };
    }

    // Geo column - handle array
    if (column.key === "geo") {
      return {
        ...column,
        render: (geoCoverage) => {
          if (Array.isArray(geoCoverage)) {
            return geoCoverage.join(", ");
          }
          return geoCoverage || "N/A";
        },
      };
    }

    // Device column - handle array
    if (column.key === "device") {
      return {
        ...column,
        render: (devices) => {
          if (Array.isArray(devices)) {
            return devices.map((device, index) => (
              <Tag key={index} color="cyan">
                {device}
              </Tag>
            ));
          }
          return devices ? <Tag color="cyan">{devices}</Tag> : "N/A";
        },
      };
    }

    // Operating System column - handle array
    if (column.key === "operatingSystem") {
      return {
        ...column,
        render: (os) => {
          if (Array.isArray(os)) {
            return os.map((system, index) => (
              <Tag key={index} color="purple">
                {system}
              </Tag>
            ));
          }
          return os ? <Tag color="purple">{os}</Tag> : "N/A";
        },
      };
    }

    // Payout column with currency formatting
    if (column.key === "payout") {
      return {
        ...column,
        render: (payout, record) => {
          const currency = record.currency || "USD";
          return payout ? `${payout} ${currency}` : "N/A";
        },
      };
    }

    // Revenue column with currency formatting
    if (column.key === "revenue") {
      return {
        ...column,
        render: (revenue, record) => {
          const currency = record.currency || "USD";
          return revenue ? `${revenue} ${currency}` : "N/A";
        },
      };
    }

    // Created Date formatting
    if (column.key === "createdDate") {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return "N/A";
        },
      };
    }

    // Start Date formatting
    if (column.key === "startDate") {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return "N/A";
        },
      };
    }

    // End Date formatting
    if (column.key === "expiryDate") {
      return {
        ...column,
        render: (date) => {
          if (date) {
            return new Date(date).toLocaleDateString();
          }
          return "N/A";
        },
      };
    }

    // Default render for other columns
    return {
      ...column,
      render: (value) => value || "N/A",
    };
  });

  // NOTE: fetching is now handled via Redux in the useEffect above

  const visibleTableColumns = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  const handleSearch = async (values) => {
      try {
        // Clean up search parameters
        const searchParams = Object.keys(values).reduce((acc, key) => {
          if (
            values[key] !== undefined &&
            values[key] !== null &&
            values[key] !== ""
          ) {
            acc[key] = values[key];
          }
          return acc;
        }, {});

        console.log("Search params:", searchParams);

        await dispatch(fetchCampaigns(searchParams)).unwrap();
        message.success("Search completed!");
      } catch (error) {
        console.error("Search error:", error);
        message.error(error.response?.data?.message || "Search failed");
      } finally {
        setSearchVisible(false);
      }
    };

  const handleExport = () => {
    if (campaigns.length === 0) {
      message.warning("No data to export");
      return;
    }

    const headers = visibleTableColumns.map((col) => col.title).join(",");
    const rows = campaigns.map((campaign) =>
      visibleTableColumns
        .map((col) => {
          let value = "";
          if (col.dataIndex && Array.isArray(col.dataIndex)) {
            // Handle nested properties like ['company', 'name']
            value =
              col.dataIndex.reduce((obj, key) => obj?.[key], campaign) || "";
          } else if (col.dataIndex) {
            value = campaign[col.dataIndex] || "";
          }

          // Handle arrays
          if (Array.isArray(value)) {
            value = value.join("; ");
          }

          // Escape commas and quotes for CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          return value;
        })
        .join(",")
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

  const handleView = (campaign) => {
    console.log('View campaign:', campaign);
  setSelectedCampaign(campaign);
  setViewModalVisible(true);
};

const handledetails = (campaign) => {
  navigate(`/campaign/${campaign.id}`);
}

const handleEdit = (campaign) => {
 // navigate(`/campaign/edit/${campaign.id}`);
  setSelectedCampaign(campaign);
  setEditModalVisible(true);
};

const handleDelete = (campaignId) => {
  // Your delete logic here
  console.log('Delete campaign:', campaignId);
};

const handleStatusChange = async (campaignId, newStatus) => {
  try {
    await dispatch(
      updateCampaignStatusThunk({ id: campaignId, status: newStatus })
    ).unwrap();
    message.success(`Campaign status updated to ${newStatus.toUpperCase()}`);
  } catch (error) {
    console.error('Error updating campaign status:', error);
    message.error(error.response?.data?.message || 'Failed to update campaign status');
  }
};

 return (
  <div className="campaign-management">
    {/* Floating Filter Button */}
    <Button
      icon={<FilterOutlined />}
      onClick={() => setIsFilterVisible(true)}
      type="primary"
      shape="circle"
      size="large"
      title="Advanced Filters"
      className="filter-button"
    />

    {/* Unified Card - Everything in One */}
    <Card className="campaign-unified-card">
      {/* Header Toolbar with Search and Buttons */}
      <div className="card-header-toolbar">
        
        <div className="search-section">
          <Input
            placeholder="Search by campaign ID, title or advertiser..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleQuickSearch}
            allowClear
            className="quick-search"
          />
        </div>
        
        {/* Right: Action Buttons */}
        <div className="action-buttons">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            size="small"
            className="export-btn"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <CampaignTable
          campaigns={filteredCampaigns}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onDetail={handledetails}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Modals inside Card */}
      <CampaignViewModal
        visible={viewModalVisible}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedCampaign(null);
        }}
        campaignData={selectedCampaign}
      />
      <CampaignModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedCampaign(null);
        }}
        loading={loading}
        editData={selectedCampaign}
        isEdit={true}
      />
    </Card>

    {/* Advanced Filter Drawer */}
    <CampaignAdvancedFilterDrawer
      visible={isFilterVisible}
      onClose={() => setIsFilterVisible(false)}
      onSearch={handleSearch}
      searchLoading={loading}
      visibleColumns={visibleColumns}
      columnOptions={columnOptions}
      onColumnChange={handleColumnChange}
      onSelectAll={handleSelectAll}
      onClearAll={handleClearAll}
      onSave={saveColumnPreferences}
      saveLoading={saveLoading}
    />
  </div>
);
};

export default CampaignManagement;
