// src/components/CompanyTable.jsx
import React, { useState } from "react";
import { Table, Empty, Dropdown, Button, Avatar, Tag, Typography, Menu } from "antd";
import {
  MailOutlined,
  GlobalOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiServices";
import ApproveConfirmModal from "../model/ApproveConfirmModal";
import RejectConfirmModal from "../model/RejectConfirmModal";
import ExtendDaysModal from "../model/ExtendDaysModal";
import FailModal from "../model/FailModal";
import SuccessModal from "../model/SuccessModal";

const { Text } = Typography;

export default function CompanyTable({ activeTab, companies, loading, onLocalUpdate }) {
  const [actionLoading, setActionLoading] = useState({});
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [selectedCompanyToApprove, setSelectedCompanyToApprove] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCompanyToReject, setSelectedCompanyToReject] = useState(null);
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedCompanyToExtend, setSelectedCompanyToExtend] = useState(null);
  const [modalDays, setModalDays] = useState(30);
  const [modalAmount, setModalAmount] = useState(0);
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [failMessage, setFailMessage] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Open/close modals
  const openApproveModal = (company) => {
    setSelectedCompanyToApprove(company);
    setModalDays(company.subscription_days || 30);
    setModalAmount(company.amount || 0);
    setApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setApproveModalOpen(false);
    setSelectedCompanyToApprove(null);
  };

  const openRejectModal = (company) => {
    setSelectedCompanyToReject(company);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedCompanyToReject(null);
  };

  const openExtendModal = (company) => {
    setSelectedCompanyToExtend(company);
    setModalDays(company.subscription_remain_day || 0);
    setModalAmount(0);
    setExtendModalOpen(true);
  };

  const closeExtendModal = () => {
    setExtendModalOpen(false);
    setSelectedCompanyToExtend(null);
  };

  // Action handlers
  const handleConfirmApprove = async ({ subscriptionDays, amount }) => {
    if (!selectedCompanyToApprove) return;
    
    const { id, name } = selectedCompanyToApprove;
    setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: true }));
    
    try {
      const res = await apiClient.put(
        `/admin/company/approve/${id}`,
        { subscription_days: subscriptionDays, amount }
      );
      
      closeApproveModal();
      setSuccessMessage(`"${name}" approved successfully.`);
      setSuccessModalOpen(true);
      
      // Create updated company object with proper data merging
      const updatedCompany = {
        ...selectedCompanyToApprove,
        ...res.data.data,
        status: 'approved' // Ensure status is set correctly
      };
      
      onLocalUpdate({ 
        company: updatedCompany, 
        oldStatus: activeTab, 
        newStatus: "approved" 
      });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      setFailMessage(serverMsg || `Unable to approve "${name}".`);
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve_${id}`]: false }));
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedCompanyToReject) return;
    
    const { id, name } = selectedCompanyToReject;
    setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: true }));
    
    try {
      const res = await apiClient.put(`/admin/company/reject/${id}`);
      console.log("Reject - API Response:", res.data);
      
      closeRejectModal();
      setSuccessMessage(`"${name}" rejected successfully.`);
      setSuccessModalOpen(true);
      
      // Create updated company object
      const updatedCompany = {
        ...selectedCompanyToReject,
        ...res.data.data,
        status: 'rejected' // Ensure status is set correctly
      };
      
      onLocalUpdate({ 
        company: updatedCompany, 
        oldStatus: activeTab, 
        newStatus: "rejected" 
      });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      setFailMessage(serverMsg || `Unable to reject "${name}".`);
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject_${id}`]: false }));
    }
  };

  const handleConfirmExtend = async ({ subscriptionDays, amount }) => {
    if (!selectedCompanyToExtend) return;
    
    const { id, name } = selectedCompanyToExtend;
    setActionLoading((prev) => ({ ...prev, [`extend_${id}`]: true }));
    
    try {
      const res = await apiClient.put(
        `/admin/company/${id}/extend-subscription`,
        { subscription_days: subscriptionDays, amount }
      );

      // Properly merge the updated data
      const updatedCompany = {
        ...selectedCompanyToExtend,
        ...res.data?.data,
        status: 'approved' // Ensure status remains approved
      };

      console.log("Extend - Old Company:", selectedCompanyToExtend);
      console.log("Extend - API Response:", res.data?.data);
      console.log("Extend - Updated Company:", updatedCompany);

      closeExtendModal();
      setSuccessMessage(`"${name}" subscription extended successfully.`);
      setSuccessModalOpen(true);

      // For extend, we update within the same status (approved -> approved)
      onLocalUpdate({
        company: updatedCompany,
        oldStatus: activeTab,
        newStatus: "approved", // Status remains approved
        isUpdate: true // Flag to indicate this is an update, not a move
      });
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.message;
      setFailMessage(serverMsg || `Unable to extend subscription for "${name}".`);
      setFailModalOpen(true);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`extend_${id}`]: false }));
    }
  };

  const getStatusTag = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return <Tag color="success">Approved</Tag>;
      case "pending": return <Tag color="warning">Pending</Tag>;
      case "rejected": return <Tag color="error">Rejected</Tag>;
      default: return <Tag>{status || "Unknown"}</Tag>;
    }
  };

  const getActionMenu = (record) => {
    const items = [];
    
    if (activeTab !== "approved") {
      items.push({ 
        key: 'approve', 
        label: 'Approve', 
        onClick: () => openApproveModal(record) 
      });
    }
    
    if (activeTab !== "rejected") {
      items.push({ 
        key: 'reject', 
        label: 'Reject', 
        onClick: () => openRejectModal(record) 
      });
    }
    
    if (activeTab === "approved") {
      items.push({ 
        key: 'extend', 
        label: 'Extend Days', 
        onClick: () => openExtendModal(record) 
      });
    }
    
    return (
      <Dropdown 
        overlay={<Menu items={items} />} 
        trigger={['click']} 
        placement="bottomRight"
      >
        <Button icon={<MoreOutlined />} size="small" />
      </Dropdown>
    );
  };

  const columns = [
    { 
      title: "Company", 
      dataIndex: "name", 
      key: "name", 
      width: 180, 
      render: (name, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.logo} size={40}>
            {name?.[0]?.toUpperCase() || "C"}
          </Avatar>
          <div style={{ marginLeft: 8 }}>
            <div>{name || "Unnamed Company"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </div>
      )
    },
    { 
      title: "Admin Email", 
      dataIndex: "admin_email", 
      key: "admin_email", 
      width: 220, 
      render: (email) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <MailOutlined style={{ marginRight: 4 }} />
          <Text copyable>{email}</Text>
        </div>
      )
    },
    { 
      title: "Subdomain", 
      dataIndex: "subdomain", 
      key: "subdomain", 
      width: 160, 
      render: (sub) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <GlobalOutlined style={{ marginRight: 4 }} />
          <Text code>{sub}</Text>
        </div>
      )
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      width: 100, 
      render: getStatusTag 
    },
    { 
      title: "Subscription Type", 
      dataIndex: "subscription_type", 
      key: "subscription_type", 
      width: 140, 
      render: type => type || "-" 
    },
    { 
      title: "Days", 
      dataIndex: "subscription_days", 
      key: "subscription_days", 
      width: 90, 
      render: days => days ?? "-" 
    },
    { 
      title: "Start Date", 
      dataIndex: "subscription_start_date", 
      key: "subscription_start_date", 
      width: 130, 
      render: date => date ? new Date(date).toLocaleDateString() : "-" 
    },
    { 
      title: "Remaining", 
      dataIndex: "subscription_remain_day", 
      key: "subscription_remain_day", 
      width: 80, 
      render: remain => remain ?? "-" 
    },
    { 
      title: "Amount", 
      dataIndex: "amount", 
      key: "amount", 
      width: 100, 
      render: amt => amt != null ? `₹${amt}` : "-" 
    },
    { 
      title: "Actions", 
      key: "actions", 
      width: 80, 
      render: (_, record) => getActionMenu(record) 
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={companies}
        loading={loading}
        rowKey="id"
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true, 
          showQuickJumper: true, 
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} companies` 
        }}
        locale={{ 
          emptyText: <Empty description={`No companies with status "${activeTab}"`} /> 
        }}
      />

      <ApproveConfirmModal
        open={approveModalOpen}
        companyName={selectedCompanyToApprove?.name}
        onConfirm={handleConfirmApprove}
        subscriptionDays={modalDays}
        amount={modalAmount}
        setSubscriptionDays={setModalDays}
        setAmount={setModalAmount}
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

      <ExtendDaysModal
        open={extendModalOpen}
        companyName={selectedCompanyToExtend?.name}
        onConfirm={handleConfirmExtend}
        subscriptionDays={modalDays}
        amount={modalAmount}
        setSubscriptionDays={setModalDays}
        setAmount={setModalAmount}
        onCancel={closeExtendModal}
        loading={actionLoading[`extend_${selectedCompanyToExtend?.id}`]}
      />

      <FailModal 
        open={failModalOpen} 
        title="Operation Failed" 
        message={failMessage} 
        onOk={() => setFailModalOpen(false)} 
      />
      
      <SuccessModal 
        open={successModalOpen} 
        title="Success" 
        message={successMessage} 
        onClose={() => setSuccessModalOpen(false)} 
      />
    </>
  );
}