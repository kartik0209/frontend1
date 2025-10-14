import React, { useState, useEffect } from "react";
import { Button, Card, Input, Tag } from "antd";
import AdvertiserHeader from "../components/advertiser/AdvertiserHeader";
import AdvertiserTable from "../components/advertiser/AdvertiserTable";
import AdvertiserSearchModal from "../components/advertiser/AdvertiserSearchModal";
import AdvertiserColumnSettings from "../components/advertiser/AdvertiserColumnSettings";
import AdvertiserModal from "../components/advertiser/AdvertiserModal";
import AdvertiserViewModal from "../components/advertiser/AdvertiserViewModal";
import SuccessModal from "../components/model/SuccessModal";
import FailModal from "../components/model/FailModal";
import { columnOptions, baseColumns } from "../data/advertiserData";
import apiClient from "../services/apiServices";
import "../styles/AdvertiserManagement.scss";
import AdvertiserTableSkeleton from "../components/skeletons/TableSkeleton";
import ConfirmModal from "../components/model/ConfirmModal";
import { useNavigate } from "react-router-dom";
import AdvancedFilterDrawer from "../components/advertiser/AdvertiserAdvancedFilterDrawer";
import {
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
const AdvertiserManagement = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [advertiserModalVisible, setAdvertiserModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState(null);
  const [viewingAdvertiser, setViewingAdvertiser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
const [saveLoading, setSaveLoading] = useState(false);

const [isFilterVisible, setIsFilterVisible] = useState(false);
const [searchText, setSearchText] = useState("");
const [filteredAdvertisers, setFilteredAdvertisers] = useState([]);

const handleQuickSearch = (e) => {
  const value = e.target.value;
  setSearchText(value);
  
  if (value.trim()) {
    const filtered = advertisers.filter((advertiser) => {
      const name = advertiser.full_name?.toLowerCase() || '';
      const email = advertiser.email?.toLowerCase() || '';
      const searchValue = value.toLowerCase();
      
      return name.includes(searchValue) || email.includes(searchValue);
    });
    setFilteredAdvertisers(filtered);
  } else {
    setFilteredAdvertisers(advertisers);
  }
};

useEffect(() => {
  setFilteredAdvertisers(advertisers);
}, [advertisers]);

const saveColumnPreferences = async () => {
  setSaveLoading(true);
  try {
    const selectedFields = Object.keys(visibleColumns).filter(key => visibleColumns[key]);
    
    const response = await apiClient.post('/common/user-preference', {
      form: 'advertiser',
      fields: selectedFields
    });
    
    if (response.data && response.data.success) {
      showSuccess('Preferences Saved', 'Column preferences saved successfully!');
      setColumnSettingsVisible(false);
    } else {
      throw new Error(response.data?.message || 'Failed to save preferences');
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    showError('Save Failed', error.response?.data?.message || 'Failed to save preferences');
  } finally {
    setSaveLoading(false);
  }
};

const fetchColumnPreferences = async () => {
  try {
    const response = await apiClient.get('/common/user-preference/advertiser');
    
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

// 5. Update the useEffect to fetch preferences on component mount
useEffect(() => {
  fetchAdvertisers();
  fetchColumnPreferences(); // Add this line
}, []);


  const navigate=useNavigate();

  // Modal states
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [failModal, setFailModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const defaultVisibleColumns = {
    id: true,
    full_name: true,
    email: true,
    status: true,
    reference_id: true,
    account_manager: true,
    notes: false,
    created_at: true,
    updated_at: false,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  // Helper functions for modals
  const showSuccess = (title, message) => {
    setSuccessModal({
      open: true,
      title,
      message,
    });
  };

  const showError = (title, message) => {
    setFailModal({
      open: true,
      title,
      message,
    });
  };
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    danger: false,
  });

  // Add this helper function with other modal helper functions
  const showConfirm = (title, message, onConfirm, danger = false) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm,
      danger,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, open: false, onConfirm: null }));
  };
  const closeSuccessModal = () => {
    setSuccessModal((prev) => ({ ...prev, open: false }));
  };

  const closeFailModal = () => {
    setFailModal((prev) => ({ ...prev, open: false }));
  };

  // Create allColumns with render functions
  const allColumns = baseColumns.map((column) => {
    if (column.key === "status") {
      return {
        ...column,
        render: (status) => (
          <Tag
            color={
              status === "Active"
                ? "green"
                : status === "Pending"
                ? "orange"
                : status === "Suspended"
                ? "purple"
                : status === "Disabled" ||
                  status === "Rejected" ||
                  status === "Banned"
                ? "red"
                : "default"
            }
            className="status-tag"
          >
            {status}
          </Tag>
        ),
      };
    }

    if (column.key === "full_name") {
      return {
        ...column,
        render: (text) => <span className="advertiser-name">{text}</span>,
      };
    }

    if (column.key === "created_at" || column.key === "updated_at") {
      return {
        ...column,
        render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      };
    }

    if (column.key === "notes") {
      return {
        ...column,
        render: (notes) => (
          <span
            style={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {notes || "No notes"}
          </span>
        ),
      };
    }

    return column;
  });

  // Fetch advertisers from API
  const fetchAdvertisers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/common/advertiser/list", {
        // Add any required parameters here
        // For example: page: 1, limit: 100, etc.
      });
      console.log("Fetch advertisers response:1", response.data.data);
      if (response.data.data && response.data.success) {
        setAdvertisers(response.data.data || response.data.advertisers || []);
        //   showSuccess('Load Success', 'Advertisers loaded successfully!');
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch advertisers"
        );
      }
    } catch (error) {
      console.error("Error fetching advertisers:", error);
      showError(
        "Load Failed",
        error.response?.data?.message || "Failed to load advertisers"
      );
      setAdvertisers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  console.log("Advertisers after fetch:", advertisers);

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  const visibleTableColumns = allColumns.filter(
    (col) => visibleColumns[col.key]
  );

  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // Filter out empty values
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

      const response = await apiClient.post(
        "/common/advertiser/list",
        searchParams
      );

      console.log("Search response:", response);
      console.log("Search values:", values);
      console.log("Filtered search params:", searchParams);

      if (response.data && response.data.success) {
        setAdvertisers(response.data.data || response.data.advertisers || []);
        showSuccess("Search Complete", "Search completed successfully!");
      } else {
        throw new Error(response.data?.message || "Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      showError(
        "Search Failed",
        error.response?.data?.message || "Search failed"
      );
    } finally {
      setLoading(false);
      setSearchVisible(false);
    }
  };

  const handleAddAdvertiser = () => {
    setEditingAdvertiser(null);
    setIsEditMode(false);
    setAdvertiserModalVisible(true);
  };

  const handleEditAdvertiser = (advertiser) => {
    setEditingAdvertiser(advertiser);
    setIsEditMode(true);
    setAdvertiserModalVisible(true);
  };

  const handleViewAdvertiser = (advertiser) => {
    setViewingAdvertiser(advertiser);
    setViewModalVisible(true);
  };


  const handledetails = (advertiser) => {
    console.log("navigation")
  navigate(`/advertisers/${advertiser.id}`);
}

  const handleDeleteAdvertiser = async (advertiserId) => {
    showConfirm(
      "Delete Advertiser",
      "Are you sure you want to delete this advertiser? This action cannot be undone.",
      async () => {
        try {
          setLoading(true);
          const response = await apiClient.delete(
            `/common/advertiser/${advertiserId}`
          );

          if (response.data && response.data.success) {
            showSuccess("Delete Success", "Advertiser deleted successfully!");
            fetchAdvertisers(); // Refresh the list
          } else {
            throw new Error(
              response.data?.message || "Failed to delete advertiser"
            );
          }
        } catch (error) {
          console.error("Error deleting advertiser:", error);
          showError(
            "Delete Failed",
            error.response?.data?.message || "Failed to delete advertiser"
          );
        } finally {
          setLoading(false);
          closeConfirmModal();
        }
      },
      true // danger = true for delete action
    );
  };
  const handleStatusChange = async (advertiserId, newStatus) => {
    try {
      setLoading(true);
      const response = await apiClient.patch(
        `/common/advertiser/${advertiserId}/status`,
        {
          status: newStatus,
        }
      );
      console.log("Status change response:", response);
      if (response.data && response.data.success) {
        showSuccess(
          "Status Updated",
          `Advertiser status updated to ${newStatus}!`
        );
        fetchAdvertisers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showError(
        "Status Update Failed",
        error.response?.data?.message || "Failed to update status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdvertiserSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      // Add detailed logging
     

      if (isEditMode && editingAdvertiser) {
        response = await apiClient.put(
          `/common/advertiser/${editingAdvertiser.id}`,
          values
        );
        console.log("Advertiser update response:", response);
      } else {
        response = await apiClient.post("/common/advertiser", values);
      }
      console.log("Advertiser submit response:", response);
      if (response.data && response.data.success) {
        showSuccess(
          isEditMode ? "Update Success" : "Create Success",
          `Advertiser ${isEditMode ? "updated" : "created"} successfully!`
        );
        setAdvertiserModalVisible(false);
        fetchAdvertisers(); // Refresh the list
      } else {
        throw new Error(
          response.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} advertiser`
        );
      }
    } catch (error) {
      console.error("Error submitting advertiser:", error);
      showError(
        isEditMode ? "Update Failed" : "Create Failed",
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} advertiser`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const headers = visibleTableColumns.map((col) => col.title).join(",");
      const rows = advertisers.map((advertiser) =>
        visibleTableColumns
          .map((col) => {
            const value = advertiser[col.dataIndex];
            // Handle special cases for export
            if (col.key === "status") {
              return value || "";
            }
            if (col.key === "created_at" || col.key === "updated_at") {
              return value ? new Date(value).toLocaleDateString() : "";
            }
            if (col.key === "notes") {
              return value ? value.replace(/,/g, ";") : ""; // Replace commas to avoid CSV issues
            }
            return value || "";
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
        `advertisers_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSuccess("Export Success", "Advertiser data exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      showError("Export Failed", "Failed to export advertiser data");
    }
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
  <div className="advertiser-management">
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
    <Card className="advertiser-unified-card">
      {/* Header Toolbar with Search and Buttons */}
      <div className="card-header-toolbar">
        {/* Left: Search Bar */}
        <div className="search-section">
          <Input
            placeholder="Search by name or email..."
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
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddAdvertiser}
            size="small"
            className="add-btn"
          >
            Add Advertiser
          </Button>
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
        <AdvertiserTableSkeleton />
      ) : (
        <AdvertiserTable
          advertisers={filteredAdvertisers}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
          onEdit={handleEditAdvertiser}
          onDelete={handleDeleteAdvertiser}
          onView={handleViewAdvertiser}
          onStatusChange={handleStatusChange}
          onDetails={handledetails}
        />
      )}
    </Card>

    {/* Advanced Filter Drawer */}
    <AdvancedFilterDrawer
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

    {/* Other Modals - Keep existing modals */}
    <AdvertiserModal
      visible={advertiserModalVisible}
      onClose={() => setAdvertiserModalVisible(false)}
      onSubmit={handleAdvertiserSubmit}
      loading={loading}
      editData={editingAdvertiser}
      isEdit={isEditMode}
    />

    <AdvertiserViewModal
      visible={viewModalVisible}
      onClose={() => setViewModalVisible(false)}
      advertiserData={viewingAdvertiser}
    />

    <SuccessModal
      open={successModal.open}
      title={successModal.title}
      message={successModal.message}
      onClose={closeSuccessModal}
    />

    <FailModal
      open={failModal.open}
      title={failModal.title}
      message={failModal.message}
      onOk={closeFailModal}
    />

    <ConfirmModal
      open={confirmModal.open}
      title={confirmModal.title}
      message={confirmModal.message}
      onConfirm={confirmModal.onConfirm}
      onCancel={closeConfirmModal}
      confirmText="Yes, Delete"
      cancelText="Cancel"
      danger={confirmModal.danger}
    />
  </div>
);
};

export default AdvertiserManagement;
