import React, { useState, useEffect } from "react";
import { Card, message, Tag } from "antd";
import PublisherHeader from "../components/publisher/PublisherHeader";
import PublisherTable from "../components/publisher/PublisherTable";
import PublisherSearchModal from "../components/publisher/PublisherSearchModal";
import PublisherColumnSettings from "../components/publisher/PublisherColumnSettings";
import PublisherModal from "../components/publisher/PublisherModal";
import PublisherViewModal from "../components/publisher/PublisherViewModal";
import { columnOptions, baseColumns } from "../data/publisherData";
import apiClient from "../services/apiServices";
import "../styles/PublisherManagement.scss";

const PublisherManagement = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [columnSettingsVisible, setColumnSettingsVisible] = useState(false);
  const [publisherModalVisible, setPublisherModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [viewingPublisher, setViewingPublisher] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const defaultVisibleColumns = {
    id: true,
    full_name: true,
    email: true,
    status: true,
    country: true,
    city: false,
    state: false,
    zip_code: false,
    phone: true,
    entity_type: true,
    im_type: false,
    im_username: false,
    promotion_method: false,
    reference_id: false,
    signup_company_name: false,
    signup_company_address: false,
    notify_by_email: false,
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
        render: (text) => <span className="publisher-name">{text}</span>,
      };
    }

    if (column.key === 'entity_type') {
      return {
        ...column,
        render: (entityType) => (
          <Tag color={entityType === "Individual" ? "blue" : "purple"}>
            {entityType}
          </Tag>
        ),
      };
    }

    if (column.key === 'notify_by_email') {
      return {
        ...column,
        render: (value) => (
          <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
        ),
      };
    }

    if (column.key === 'created_at' || column.key === 'updated_at') {
      return {
        ...column,
        render: (date) => date ? new Date(date).toLocaleDateString() : "N/A",
      };
    }
    
    return column;
  });

  // Fetch publishers from API
  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/common/publisher/list', {
        // Add any required parameters here
        // For example: page: 1, limit: 100, etc.
      });
      
      if (response.data && response.data.success) {
        setPublishers(response.data.data || response.data.publishers || []);
        message.success('Publishers loaded successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch publishers');
      }
    } catch (error) {
      console.error('Error fetching publishers:', error);
      message.error(error.response?.data?.message || 'Failed to load publishers');
      setPublishers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
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
      
      const response = await apiClient.post('/common/publisher/list', searchParams);
      
      console.log('Search response:', response);
      console.log('Search values:', values);
      console.log('Filtered search params:', searchParams);
             
      if (response.data && response.data.success) {
        setPublishers(response.data.data || response.data.publishers || []);
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

  const handleAddPublisher = () => {
    setEditingPublisher(null);
    setIsEditMode(false);
    setPublisherModalVisible(true);
  };

  const handleEditPublisher = (publisher) => {
    setEditingPublisher(publisher);
    setIsEditMode(true);
    setPublisherModalVisible(true);
  };

  const handleViewPublisher = (publisher) => {
    setViewingPublisher(publisher);
    setViewModalVisible(true);
  };

  const handleDeletePublisher = async (publisherId) => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/common/publisher/${publisherId}`);
      
      if (response.data && response.data.success) {
        message.success('Publisher deleted successfully!');
        fetchPublishers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || 'Failed to delete publisher');
      }
    } catch (error) {
      console.error('Error deleting publisher:', error);
      message.error(error.response?.data?.message || 'Failed to delete publisher');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (publisherId, newStatus) => {
    try {
      setLoading(true);
      const response = await apiClient.put(`/common/publisher/${publisherId}/status`, {
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        message.success(`Publisher status updated to ${newStatus}!`);
        fetchPublishers(); // Refresh the list
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

  const handlePublisherSubmit = async (values) => {
    try {
      setLoading(true);
      let response;
      
      if (isEditMode && editingPublisher) {
        response = await apiClient.put(`/common/publisher/${editingPublisher.id}`, values);
      } else {
        response = await apiClient.post('/common/publisher', values);
      }
      console.log('Publisher submit response:', response);
      
      if (response.data && response.data.success) {
        message.success(`Publisher ${isEditMode ? 'updated' : 'created'} successfully!`);
        setPublisherModalVisible(false);
        fetchPublishers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} publisher`);
      }
    } catch (error) {
      console.error('Error submitting publisher:', error);
      message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} publisher`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = visibleTableColumns.map((col) => col.title).join(",");
    const rows = publishers.map((publisher) =>
      visibleTableColumns.map((col) => {
        const value = publisher[col.dataIndex];
        // Handle special cases for export
        if (col.key === 'status' || col.key === 'entity_type') {
          return value || "";
        }
        if (col.key === 'notify_by_email') {
          return value ? "Yes" : "No";
        }
        if (col.key === 'created_at' || col.key === 'updated_at') {
          return value ? new Date(value).toLocaleDateString() : "";
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
      `publishers_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success("Publisher data exported successfully!");
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
    <div className="publisher-management">
      <PublisherHeader
        onSearchClick={() => setSearchVisible(true)}
        onColumnsClick={() => setColumnSettingsVisible(true)}
        onExport={handleExport}
        onAddPublisher={handleAddPublisher}
        onRefresh={fetchPublishers}
      />

      <Card className="publisher-table-card">
        <PublisherTable
          publishers={publishers}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
          onEdit={handleEditPublisher}
          onDelete={handleDeletePublisher}
          onView={handleViewPublisher}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <PublisherSearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSearch={handleSearch}
        loading={loading}
      />

      <PublisherColumnSettings
        visible={columnSettingsVisible}
        onClose={() => setColumnSettingsVisible(false)}
        visibleColumns={visibleColumns}
        columnOptions={columnOptions}
        onColumnChange={handleColumnChange}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />

      <PublisherModal
        visible={publisherModalVisible}
        onClose={() => setPublisherModalVisible(false)}
        onSubmit={handlePublisherSubmit}
        loading={loading}
        editData={editingPublisher}
        isEdit={isEditMode}
      />

      <PublisherViewModal
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
        publisherData={viewingPublisher}
      />
    </div>
  );
};

export default PublisherManagement;