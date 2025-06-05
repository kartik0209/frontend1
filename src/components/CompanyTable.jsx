// src/components/CompanyTable.jsx
import React, { useState } from 'react';
import {
  Table,
  Empty,
  Button,
  Avatar,
  Tag,
  Typography,
  message,
  Space,
} from 'antd';
import {
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import ApproveConfirmModal from './model/ApproveConfirmModal';
import RejectConfirmModal from './model/RejectConfirmModal';
import FailModal from './model/FailModal';
import SuccessModal from './model/SuccessModal';
//import './CompanyTable.scss'; // Optional: if you want extra styling

const { Text } = Typography;

const CompanyTable = ({ activeTab, companies, loading, onLocalUpdate }) => {
  // Track loading states for each company action individually
  const [actionLoading, setActionLoading] = useState({});

  // 1) Approve modal state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedCompanyToApprove, setSelectedCompanyToApprove] = useState(null);

  // 2) Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCompanyToReject, setSelectedCompanyToReject] = useState(null);

  // 3) Fail modal state
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  // 4) Success modal state
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Open the Approve confirmation modal
  const openApproveModal = (company) => {
    setSelectedCompanyToApprove(company);
    setApproveModalOpen(true);
  };

  // Close the Approve modal
  const closeApproveModal = () => {
    setApproveModalOpen(false);
    setSelectedCompanyToApprove(null);
  };

  // When “Yes, Approve” is clicked inside ApproveConfirmModal:
  const handleConfirmApprove = async () => {
    if (!selectedCompanyToApprove) return;
    const { id, name } = selectedCompanyToApprove;

    // Start loading spinner on that button
    setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: true }));

    try {
      await apiClient.put(`/admin/company/approve/${id}`);

      // 1) Close the Approve modal
      closeApproveModal();

      // 2) Show Success modal
      setSuccessMessage(`"${name}" has been approved successfully.`);
      setSuccessModalOpen(true);

      // 3) Update local state in parent (move from oldTab → 'approved')
      onLocalUpdate({
        company: selectedCompanyToApprove,
        oldStatus: activeTab,
        newStatus: 'approved',
      });
    } catch (err) {
      console.error('Approve API error:', err);
      // Show Fail modal
      setFailMessage(`Unable to approve "${name}". Please try again.`);
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: false }));
    }
  };

  // Close the Fail modal
  const closeFailModal = () => {
    setFailModalOpen(false);
    setFailMessage('');
  };

  // Close the Success modal
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setSuccessMessage('');
  };

  // Open the Reject confirmation modal
  const openRejectModal = (company) => {
    setSelectedCompanyToReject(company);
    setRejectModalOpen(true);
  };

  // Close the Reject modal
  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedCompanyToReject(null);
  };

  // When “Yes, Reject” is clicked inside RejectConfirmModal:
  const handleConfirmReject = async () => {
    if (!selectedCompanyToReject) return;
    const { id, name } = selectedCompanyToReject;

    // Start loading spinner
    setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: true }));

    try {
      await apiClient.put(`/admin/company/reject/${id}`);

      // 1) Close reject modal
      closeRejectModal();

      // 2) Show success modal
      setSuccessMessage(`"${name}" has been rejected successfully.`);
      setSuccessModalOpen(true);

      // 3) Update local state in parent (move from oldTab → 'rejected')
      onLocalUpdate({
        company: selectedCompanyToReject,
        oldStatus: activeTab,
        newStatus: 'rejected',
      });
    } catch (err) {
      console.error('Reject API error:', err);
      // Show Fail modal
      setFailMessage(`Unable to reject "${name}". Please try again.`);
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: false }));
    }
  };

  // Define status tag colors
  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Tag color="success">Approved</Tag>;
      case 'pending':
        return <Tag color="warning">Pending</Tag>;
      case 'rejected':
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>{status || 'Unknown'}</Tag>;
    }
  };

  // Table columns
  const getTableColumns = () => {
    const baseColumns = [
      {
        title: 'Company',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        fixed: 'left',
        render: (name, record) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={record.logo} size={40}>
              {name ? name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <div style={{ marginLeft: 8 }}>
              <div>{name || 'Unnamed Company'}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {record.id}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Admin Email',
        dataIndex: 'admin_email',
        key: 'admin_email',
        width: 250,
        render: (email) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MailOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            <Text copyable={{ text: email }}>{email}</Text>
          </div>
        ),
      },
      {
        title: 'Subdomain',
        dataIndex: 'subdomain',
        key: 'subdomain',
        width: 150,
        render: (sub) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GlobalOutlined style={{ marginRight: 4, color: '#13c2c2' }} />
            <Text code>{sub}</Text>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status) => getStatusTag(status),
      },
      {
        title: 'Created Date',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 130,
        render: (date) =>
          date
            ? new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '-',
      },
    ];

    const actionsColumn = {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        if (activeTab === 'pending') {
          // In Pending: show Approve + Reject
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={actionLoading[`approve_${record.id}`]}
                onClick={() => openApproveModal(record)}
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                loading={actionLoading[`reject_${record.id}`]}
                onClick={() => openRejectModal(record)}
              >
                Reject
              </Button>
            </Space>
          );
        } else if (activeTab === 'approved') {
          // In Approved: show only Reject
          return (
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              loading={actionLoading[`reject_${record.id}`]}
              onClick={() => openRejectModal(record)}
            >
              Reject
            </Button>
          );
        } else if (activeTab === 'rejected') {
          // In Rejected: show only Approve
          return (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              loading={actionLoading[`approve_${record.id}`]}
              onClick={() => openApproveModal(record)}
            >
              Approve
            </Button>
          );
        }
        return null;
      },
    };

    return [...baseColumns, actionsColumn];
  };

  return (
    <>
      <Table
        columns={getTableColumns()}
        dataSource={companies}
        loading={loading}
        rowKey="id"
        pagination={{
          total: companies.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} companies`,
          className: 'custom-pagination',
        }}
        locale={{
          emptyText: (
            <Empty description={`No companies with status "${activeTab}"`} />
          ),
        }}
        scroll={{ x: 1000 }}
      />

      {/* Approve Confirmation Modal */}
      <ApproveConfirmModal
        open={approveModalOpen}
        companyName={selectedCompanyToApprove?.name}
        onConfirm={handleConfirmApprove}
        onCancel={closeApproveModal}
        loading={actionLoading[`approve_${selectedCompanyToApprove?.id}`]}
      />

      {/* Reject Confirmation Modal */}
      <RejectConfirmModal
        open={rejectModalOpen}
        companyName={selectedCompanyToReject?.name}
        onConfirm={handleConfirmReject}
        onCancel={closeRejectModal}
        loading={actionLoading[`reject_${selectedCompanyToReject?.id}`]}
      />

      {/* Fail Modal (on API error) */}
      <FailModal
        open={failModalOpen}
        title="Operation Failed"
        message={failMessage}
        onOk={closeFailModal}
      />

      {/* Success Modal (auto‐closes after 3 seconds) */}
      <SuccessModal
        open={successModalOpen}
        title="Success"
        message={successMessage}
        onClose={closeSuccessModal}
      />
    </>
  );
};

export default CompanyTable;
