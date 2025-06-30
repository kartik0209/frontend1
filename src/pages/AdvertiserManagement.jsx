import React, { useState, useEffect } from "react";
import { Card, message, Tag } from "antd";
import AdvertiserHeader from "../components/advertiser/AdvertiserHeader";
import AdvertiserTable from "../components/advertiser/AdvertiserTable";
import AdvertiserSearchModal from "../components/advertiser/AdvertiserSearchModal";
import AdvertiserColumnSettings from "../components/advertiser/AdvertiserColumnSettings";
import AdvertiserModal from "../components/advertiser/AdvertiserModal";
import AdvertiserViewModal from "../components/advertiser/AdvertiserViewModal";
import { columnOptions, baseColumns } from "../data/advertiserData";
import apiClient from "../services/apiServices";
import "../styles/AdvertiserManagement.scss";

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

  // Create allColumns with render functions
  const allColumns = baseColumns.map(column => {
    if (column.key === 'status') {
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
                : status === "Disabled" || status === "Rejected" || status === "Banned"
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
    
    if (column.key === 'full_name') {
      return {
        ...column,
        render: (text) => <span className="advertiser-name">{text}</span>,
      };
    }

    if (column.key === 'created_at' || column.key === 'updated_at') {
      return {
        ...column,
        render: (date) => date ? new Date(date).toLocaleDateString() : "N/A",
      };
    }

    if (column.key === 'notes') {
      return {
        ...column,
        render: (notes) => (
          <span style={{ 
            maxWidth: '200px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}>
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
      const response = await apiClient.post('/common/advertiser/list', {
        // Add any required parameters here
        // For example: page: 1, limit: 100, etc.
      });
      console.log('Fetch advertisers response:1', response.data.data);
      if (response.data.data && response.data.success) {
        setAdvertisers(response.data.data || response.data.advertisers || []);
      
        message.success('Advertisers loaded successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch advertisers');
      }
    } catch (error) {
      console.error('Error fetching advertisers:', error);
      message.error(error.response?.data?.message || 'Failed to load advertisers');
      setAdvertisers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
   
  };
 console.log('Advertisers after fetch:', advertisers);
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
        if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
          acc[key] = values[key];
        }
        return acc;
      }, {});
      
      const response = await apiClient.post('/common/advertiser/list', searchParams);
      
      console.log('Search response:', response);
      console.log('Search values:', values);
      console.log('Filtered search params:', searchParams);
             
      if (response.data && response.data.success) {
        setAdvertisers(response.data.data || response.data.advertisers || []);
        message.success("Search completed successfully!");
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

  const handleDeleteAdvertiser = async (advertiserId) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/common/advertiser/${advertiserId}`);
      
      if (response.data && response.data.success) {
        message.success('Advertiser deleted successfully!');
        fetchAdvertisers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || 'Failed to delete advertiser');
      }
    } catch (error) {
      console.error('Error deleting advertiser:', error);
      message.error(error.response?.data?.message || 'Failed to delete advertiser');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (advertiserId, newStatus) => {
    try {
      setLoading(true);
      const response = await apiClient.patch(`/common/advertiser/${advertiserId}/status`, {
        status: newStatus
      });
      console.log('Status change response:', response);
      if (response.data && response.data.success) {
        message.success(`Advertiser status updated to ${newStatus}!`);
        fetchAdvertisers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvertiserSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
 // Add detailed logging
    console.log('Submitting advertiser:', values);
    console.log('Is edit mode:', isEditMode);
    console.log('Editing advertiser:', editingAdvertiser);
    console.log('Advertiser ID:', editingAdvertiser?.id);
    
      
      if (isEditMode && editingAdvertiser) {
        response = await apiClient.put(`/common/advertiser/${editingAdvertiser.id}`, values);
        console.log('Advertiser update response:', response);
      } else {
        response = await apiClient.post('/common/advertiser', values);
      }
      console.log('Advertiser submit response:', response);
      if (response.data && response.data.success) {
        message.success(`Advertiser ${isEditMode ? 'updated' : 'created'} successfully!`);
        setAdvertiserModalVisible(false);
        fetchAdvertisers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} advertiser`);
      }
    } catch (error) {
      console.error('Error submitting advertiser:', error);
      message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} advertiser`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = visibleTableColumns.map((col) => col.title).join(",");
    const rows = advertisers.map((advertiser) =>
      visibleTableColumns.map((col) => {
        const value = advertiser[col.dataIndex];
        // Handle special cases for export
        if (col.key === 'status') {
          return value || "";
        }
        if (col.key === 'created_at' || col.key === 'updated_at') {
          return value ? new Date(value).toLocaleDateString() : "";
        }
        if (col.key === 'notes') {
          return value ? value.replace(/,/g, ';') : ""; // Replace commas to avoid CSV issues
        }
        return value || "";
      }).join(",")
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

    message.success("Advertiser data exported successfully!");
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
      <AdvertiserHeader
        onSearchClick={() => setSearchVisible(true)}
        onColumnsClick={() => setColumnSettingsVisible(true)}
        onExport={handleExport}
        onAddAdvertiser={handleAddAdvertiser}
        onRefresh={fetchAdvertisers}
      />

      <Card className="advertiser-table-card">
        <AdvertiserTable
          advertisers={advertisers}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
          onEdit={handleEditAdvertiser}
          onDelete={handleDeleteAdvertiser}
          onView={handleViewAdvertiser}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <AdvertiserSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        loading={loading}
      />

      <AdvertiserColumnSettings
        visible={columnSettingsVisible}
        onClose={() => setColumnSettingsVisible(false)}
        visibleColumns={visibleColumns}
        columnOptions={columnOptions}
        onColumnChange={handleColumnChange}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />

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
    </div>
  );
};

export default AdvertiserManagement;