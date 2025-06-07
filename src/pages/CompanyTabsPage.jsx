import React, { useState, useEffect } from "react";
import { Card, Divider, Typography, Alert, Tabs } from "antd";
import apiClient from "../services/apiServices";
import CompanyStatsCards from "../components/CompanyStatsCards";
import CompanyTable from "../components/CompanyTable";
import "../styles/CompanyTabsPage.scss";

const { Title, Text } = Typography;

const CompanyTabsPage = () => {
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [rejectedCompanies, setRejectedCompanies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("pending");

  const fetchAllLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const [aRes, pRes, rRes] = await Promise.all([
        apiClient.get("/admin/company/list?status=approved"),
        apiClient.get("/admin/company/list?status=pending"),
        apiClient.get("/admin/company/list?status=rejected"),
      ]);
      console.log("Fetched company lists:", aRes  );

      const approvedData = aRes.data?.data || [];
      const pendingData = pRes.data?.data || [];
      const rejectedData = rRes.data?.data || [];

      setApprovedCompanies(Array.isArray(approvedData) ? approvedData : []);
      setPendingCompanies(Array.isArray(pendingData) ? pendingData : []);
      setRejectedCompanies(Array.isArray(rejectedData) ? rejectedData : []);
    } catch (err) {
      console.error("Error fetching company lists:", err);
      setError("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLists();
  }, []);

  // 5) Derive stats from array lengths
  const stats = {
    approved: approvedCompanies.length,
    pending: pendingCompanies.length,
    rejected: rejectedCompanies.length,
    total:
      approvedCompanies.length +
      pendingCompanies.length +
      rejectedCompanies.length,
  };

  // 6) Move a company between lists whenever Approve/Reject succeeds
  //
  //    payload: { company, oldStatus, newStatus }
  const handleLocalUpdate = ({ company, oldStatus, newStatus }) => {
    // Remove from old array
    if (oldStatus === "approved") {
      setApprovedCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } else if (oldStatus === "pending") {
      setPendingCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } else if (oldStatus === "rejected") {
      setRejectedCompanies((prev) => prev.filter((c) => c.id !== company.id));
    }

    // Add to new array at the top
    if (newStatus === "approved") {
      setApprovedCompanies((prev) => [company, ...prev]);
    } else if (newStatus === "pending") {
      setPendingCompanies((prev) => [company, ...prev]);
    } else if (newStatus === "rejected") {
      setRejectedCompanies((prev) => [company, ...prev]);
    }
  };

  // 7) Build the three tab panes
  const tabItems = [
    {
      key: "approved",
      label: `Approved `,
      children: (
        <CompanyTable
          activeTab="approved"
          companies={approvedCompanies}
          loading={loading}
          onLocalUpdate={handleLocalUpdate}
        />
      ),
    },
    {
      key: "pending",
      label: `Pending `,
      children: (
        <CompanyTable
          activeTab="pending"
          companies={pendingCompanies}
          loading={loading}
          onLocalUpdate={handleLocalUpdate}
        />
      ),
    },
    {
      key: "rejected",
      label: `Rejected `,
      children: (
        <CompanyTable
          activeTab="rejected"
          companies={rejectedCompanies}
          loading={loading}
          onLocalUpdate={handleLocalUpdate}
        />
      ),
    },
  ];

  return (
    <div className="company-tabs-page">
      <div className="page-container">
        <Card className="main-card">
          <div className="page-header">
            <Title level={2}>Company Management</Title>
            <Text type="secondary">Manage and review company applications</Text>
          </div>

          {/* Stats cards at the top */}
          <CompanyStatsCards stats={stats} />

          <Divider />

          {error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={tabItems}
              size="large"
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default CompanyTabsPage;
