// src/components/CompanyTable.jsx
import React, { useState } from "react";
import { Table, Empty, Button, Avatar, Tag, Typography, Space } from "antd";
import {
  MailOutlined,
  CheckOutlined,
  CloseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import apiClient from "../services/apiServices";
import ApproveConfirmModal from "./model/ApproveConfirmModal";
import RejectConfirmModal from "./model/RejectConfirmModal";
import FailModal from "./model/FailModal";
import SuccessModal from "./model/SuccessModal";

const { Text } = Typography;

export default function CompanyTable({
  activeTab,
  companies,
  loading,
  onLocalUpdate,
}) {
  const [actionLoading, setActionLoading] = useState({});
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedCompanyToApprove, setSelectedCompanyToApprove] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCompanyToReject, setSelectedCompanyToReject] = useState(null);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
const [subscriptionDays, setSubscriptionDays] = useState(30); // Default value
const [subscriptiontype, setSubscriptiontype] = useState("");
  const [amount, setAmount] = useState(0); // Default value


  const openApproveModal = (company) => {
    setSelectedCompanyToApprove(company);
    setApproveModalOpen(true);
  };
  const closeApproveModal = () => {
    setApproveModalOpen(false);
    setSelectedCompanyToApprove(null);
  };

  // Now accepts subscription and amount values
  const handleConfirmApprove = async ({ subscriptionDays, amount }) => {
    if (!selectedCompanyToApprove) return;
    const { id, name } = selectedCompanyToApprove;
    setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: true }));
    try {
      // Pass payload to server
      const res = await apiClient.put(
        `/admin/company/approve/${id}`,
        { subscription_days: subscriptionDays, amount }
      );
      console.log("Company approved:", res.data);
      closeApproveModal();
      setSuccessMessage(`"${name}" has been approved successfully.`);
      setSuccessModalOpen(true);
      setSubscriptiontype(res.data.data?.subscription_type || "");
      console.log("Subscription Type:", res.data.data?.subscription_type);
      onLocalUpdate({ company: res.data.data || selectedCompanyToApprove, oldStatus: activeTab, newStatus: "approved" });
    } catch (err) {
      console.error('Approve API error:', err.response || err);
      const serverMsg = err.response?.data?.message || err.message;
      setFailMessage(
        serverMsg
          ? `Error: ${serverMsg}`
          : `Unable to approve "${name}". Please try again.`
      );
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: false }));
    }
  };

  const closeFailModal = () => {
    setFailModalOpen(false);
    setFailMessage("");
  };
  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
    setSuccessMessage("");
  };

  const openRejectModal = (company) => {
    setSelectedCompanyToReject(company);
    setRejectModalOpen(true);
  };
  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedCompanyToReject(null);
  };

  const handleConfirmReject = async () => {
    if (!selectedCompanyToReject) return;
    const { id, name } = selectedCompanyToReject;
    setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: true }));
    try {
      const res = await apiClient.put(`/admin/company/reject/${id}`);
      console.log("Company rejected:", res.data);
      closeRejectModal();
      setSuccessMessage(`"${name}" has been rejected successfully.`);
      setSuccessModalOpen(true);
      onLocalUpdate({ company: res.data.data || selectedCompanyToReject, oldStatus: activeTab, newStatus: "rejected" });
    } catch (err) {
      console.error('Reject API error:', err.response || err);
      const serverMsg = err.response?.data?.message || err.message;
      setFailMessage(
        serverMsg
          ? `Error: ${serverMsg}`
          : `Unable to reject "${name}". Please try again.`
      );
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: false }));
    }
  };

  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <Tag color="success">Approved</Tag>;
      case "pending":
        return <Tag color="warning">Pending</Tag>;
      case "rejected":
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>{status || "Unknown"}</Tag>;
    }
  };

  const getTableColumns = () => [
    { title: "Company", dataIndex: "name", key: "name", width: 180, render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.logo} size={40}>{name?.[0]?.toUpperCase() || "C"}</Avatar>
          <div style={{ marginLeft: 8 }}>
            <div>{name || "Unnamed Company"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.id}</Text>
          </div>
        </div>
      )
    },
    { title: "Admin Email", dataIndex: "admin_email", key: "admin_email", width: 220, render: (email) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MailOutlined style={{ marginRight: 4 }} />
          <Text copyable={{ text: email }}>{email}</Text>
        </div>
      )
    },
    { title: "Subdomain", dataIndex: "subdomain", key: "subdomain", width: 160, render: (sub) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <GlobalOutlined style={{ marginRight: 4 }} />
          <Text code>{sub}</Text>
        </div>
      )
    },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: getStatusTag },
    { title: "Subscription Type", dataIndex: "subscription_type", key: "subscription_type", width: 140, render: (type) => type || "-" },
    { title: "Days", dataIndex: "subscription_days", key: "subscription_days", width: 90, render: (days) => days ?? "-" },
    { title: "Start Date", dataIndex: "subscription_start_date", key: "subscription_start_date", width: 130, render: (date) => date ? new Date(date).toLocaleDateString() : "-" },
    { title: "Remaining", dataIndex: "subscription_remain_day", key: "subscription_remain_day", width: 80, render: (remain) => remain ?? "-" },
    { title: "Amount", dataIndex: "amount", key: "amount", width: 100, render: (amt) => amt != null ? `₹${amt}` : "-" },
    { title: "Actions", key: "actions", width: 180, render: (_, record) => {
        if (activeTab === "pending") return (
          <Space>
            <Button type="primary" icon={<CheckOutlined />} size="small" loading={actionLoading[`approve_${record.id}`]} onClick={() => openApproveModal(record)}>Approve</Button>
            <Button danger icon={<CloseOutlined />} size="small" loading={actionLoading[`reject_${record.id}`]} onClick={() => openRejectModal(record)}>Reject</Button>
          </Space>
        );
        if (activeTab === "approved") return (
          <Button danger icon={<CloseOutlined />} size="small" loading={actionLoading[`reject_${record.id}`]} onClick={() => openRejectModal(record)}>Reject</Button>
        );
        if (activeTab === "rejected") return (
          <Button type="primary" icon={<CheckOutlined />} size="small" loading={actionLoading[`approve_${record.id}`]} onClick={() => openApproveModal(record)}>Approve</Button>
        );
        return null;
      }
    },
  ];

  return (
    <>
      <Table
        columns={getTableColumns()}
        dataSource={companies}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} companies` }}
        locale={{ emptyText: <Empty description={`No companies with status "${activeTab}"`} /> }}
      />
      <ApproveConfirmModal
        open={approveModalOpen}
        companyName={selectedCompanyToApprove?.name}
        onConfirm={handleConfirmApprove}
        subscriptiontype={selectedCompanyToApprove?.subscription_type}
        setSubscriptionDays={setSubscriptionDays}
        setAmount={setAmount}
        onCancel={closeApproveModal}

        loading={actionLoading[`approve_${selectedCompanyToApprove?.id}`]}
      />
      <RejectConfirmModal
        open={rejectModalOpen}
        companyName={selectedCompanyToReject?.name}
        onConfirm={handleConfirmReject}
        onCancel={closeRejectModal}
        loading={actionLoading[`reject_${selectedCompanyToReject?.id}`]}
      />
      <FailModal open={failModalOpen} title="Operation Failed" message={failMessage} onOk={closeFailModal} />
      <SuccessModal open={successModalOpen} title="Success" message={successMessage} onClose={closeSuccessModal} />
    </>
  );
}
