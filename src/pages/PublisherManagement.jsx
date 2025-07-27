import React, { useState, useEffect } from "react";
import { Card, Tag } from "antd";
import PublisherHeader from "../components/publisher/PublisherHeader";
import PublisherTable from "../components/publisher/PublisherTable";
import PublisherSearchModal from "../components/publisher/PublisherSearchModal";
import PublisherColumnSettings from "../components/publisher/PublisherColumnSettings";
import PublisherModal from "../components/publisher/PublisherModal";
import PublisherViewModal from "../components/publisher/PublisherViewModal";
import SuccessModal from "../components/model/SuccessModal";
import FailModal from "../components/model/FailModal";
import { columnOptions, baseColumns } from "../data/publisherData";
import apiClient from "../services/apiServices";
import "../styles/PublisherManagement.scss";
import TableSkeleton from "../components/skeletons/TableSkeleton";
import ConfirmModal from "../components/model/ConfirmModal";
import { useNavigate } from "react-router-dom";

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


  const navigate=useNavigate();
  // Success and Fail modal states
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: '',
    message: ''
  });
  const [failModal, setFailModal] = useState({
    open: false,
    title: '',
    message: ''
  });

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

  // Helper functions for modals
  const showSuccessModal = (title, message) => {
    setSuccessModal({
      open: true,
      title,
      message
    });
  };

  const showFailModal = (title, message) => {
    setFailModal({
      open: true,
      title,
      message
    });
  };

  const closeSuccessModal = () => {
    setSuccessModal({
      open: false,
      title: '',
      message: ''
    });
  };

  const closeFailModal = () => {
    setFailModal({
      open: false,
      title: '',
      message: ''
    });
  };
  const [confirmModal, setConfirmModal] = useState({
  open: false,
  title: '',
  message: '',
  onConfirm: null,
  danger: false
});

// Add this helper function with other modal helper functions
const showConfirm = (title, message, onConfirm, danger = false) => {
  setConfirmModal({
    open: true,
    title,
    message,
    onConfirm,
    danger
  });
};

const closeConfirmModal = () => {
  setConfirmModal(prev => ({ ...prev, open: false, onConfirm: null }));
};


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
      //  showSuccessModal('Data Loaded', 'Publishers Added successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch publishers');
      }
    } catch (error) {
      console.error('Error fetching publishers:', error);
      showFailModal('Load Failed', error.response?.data?.message || 'Failed to load publishers');
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
        showSuccessModal('Search Complete', 'Search completed successfully!');
      } else {
        throw new Error(response.data?.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      showFailModal('Search Failed', error.response?.data?.message || 'Search failed');
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

  const handledetails = (publisher) => {
  navigate(`/publisher/${publisher.id}`);
}

 const handleDeletePublisher = async (publisherId) => {
  showConfirm(
    'Delete Publisher',
    'Are you sure you want to delete this publisher? This action cannot be undone.',
    async () => {
      try {
        setLoading(true);
        const response = await apiClient.delete(`/common/publisher/${publisherId}`);
        
        if (response.data && response.data.success) {
          showSuccessModal('Publisher Deleted', 'Publisher deleted successfully!');
          fetchPublishers(); // Refresh the list
        } else {
          throw new Error(response.data?.message || 'Failed to delete publisher');
        }
      } catch (error) {
        console.error('Error deleting publisher:', error);
        showFailModal('Delete Failed', error.response?.data?.message || 'Failed to delete publisher');
      } finally {
        setLoading(false);
        closeConfirmModal();
      }
    },
    true // danger = true for delete action
  );
};

  const handleStatusChange = async (publisherId, newStatus) => {
    try {
      console.log('Changing status for publisher:', publisherId, 'to', newStatus);
      setLoading(true);
      const response = await apiClient.patch(`/common/publisher/${publisherId}/status`, {
        status: newStatus
      });
      console.log('Status change response:', response);
      
      if (response.data && response.data.success) {
        showSuccessModal('Status Updated', `Publisher status updated to ${newStatus}!`);
        fetchPublishers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showFailModal('Status Update Failed', error.response?.data?.message || 'Failed to update status');
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
        showSuccessModal(
          `Publisher ${isEditMode ? 'Updated' : 'Created'}`, 
          `Publisher ${isEditMode ? 'updated' : 'created'} successfully!`
        );
        setPublisherModalVisible(false);
        fetchPublishers(); // Refresh the list
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} publisher`);
      }
    } catch (error) {
      console.error('Error submitting publisher:', error);
      showFailModal(
        `Publisher ${isEditMode ? 'Update' : 'Creation'} Failed`,
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} publisher`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
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

      showSuccessModal('Export Complete', 'Publisher data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showFailModal('Export Failed', 'Failed to export publisher data');
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
    <div className="publisher-management">
      <PublisherHeader
        onSearchClick={() => setSearchVisible(true)}
        onColumnsClick={() => setColumnSettingsVisible(true)}
        onExport={handleExport}
        onAddPublisher={handleAddPublisher}
        onRefresh={fetchPublishers}
      />

      <Card className="publisher-table-card">
      {loading ? <TableSkeleton/>:
        <PublisherTable
          publishers={publishers}
          columns={visibleTableColumns}
          loading={loading}
          rowSelection={rowSelection}
          onEdit={handleEditPublisher}
          onDelete={handleDeletePublisher}
          onView={handleViewPublisher}
          onStatusChange={handleStatusChange}
          onDetail={handledetails}
        />}
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

      {/* Success Modal */}
      <SuccessModal
        open={successModal.open}
        title={successModal.title}
        message={successModal.message}
        onClose={closeSuccessModal}
      />

      {/* Fail Modal */}
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

export default PublisherManagement;