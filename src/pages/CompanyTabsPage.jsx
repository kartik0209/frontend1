// src/pages/CompanyTabsPage.jsx
import React, { useState, useEffect } from "react";
import { Card, Divider, Typography, Alert, Tabs } from "antd";
import apiClient from "../services/apiServices";
import CompanyStatsCards from "../components/company/CompanyStatsCards";
import CompanyTable from "../components/company/CompanyTable";
import "../styles/CompanyTabsPage.scss";

const { Title, Text } = Typography;

const CompanyTabsPage = () => {
  const [approvedCompanies, setApprovedCompanies] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [rejectedCompanies, setRejectedCompanies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  // Helper function to remove duplicates based on ID
  const removeDuplicatesById = (array) => {
    const seen = new Set();
    return array.filter(item => {
      if (seen.has(item.id)) {
        console.warn(`Duplicate company found with ID: ${item.id}`, item);
        return false;
      }
      seen.add(item.id);
      return true;
    });
  };

  const fetchAllLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const [aRes, pRes, rRes] = await Promise.all([
        apiClient.get("/admin/company/list?status=approved"),
        apiClient.get("/admin/company/list?status=pending"),
        apiClient.get("/admin/company/list?status=rejected"),
      ]);
      
      console.log("Fetched company lists:", { 
        approved: aRes.data, 
        pending: pRes.data, 
        rejected: rRes.data 
      });

      const approvedData = aRes.data?.data || [];
      const pendingData = pRes.data?.data || [];
      const rejectedData = rRes.data?.data || [];

      // Ensure arrays and remove duplicates
      const approvedArray = Array.isArray(approvedData) ? removeDuplicatesById(approvedData) : [];
      const pendingArray = Array.isArray(pendingData) ? removeDuplicatesById(pendingData) : [];
      const rejectedArray = Array.isArray(rejectedData) ? removeDuplicatesById(rejectedData) : [];

      console.log("After duplicate removal:", {
        approved: approvedArray.length,
        pending: pendingArray.length,
        rejected: rejectedArray.length
      });

      setApprovedCompanies(approvedArray);
      setPendingCompanies(pendingArray);
      setRejectedCompanies(rejectedArray);
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

  // Derive stats from array lengths
  const stats = {
    approved: approvedCompanies.length,
    pending: pendingCompanies.length,
    rejected: rejectedCompanies.length,
    total: approvedCompanies.length + pendingCompanies.length + rejectedCompanies.length,
  };

  // Enhanced local update handler with duplicate prevention
  const handleLocalUpdate = ({ company, oldStatus, newStatus, isUpdate = false }) => {
    console.log("Local update:", { 
      companyId: company.id, 
      oldStatus, 
      newStatus, 
      isUpdate 
    });

    if (isUpdate) {
      // For updates (like extend), just update the existing record in the same list
      if (newStatus === "approved") {
        setApprovedCompanies((prev) => 
          prev.map(c => c.id === company.id ? company : c)
        );
      } else if (newStatus === "pending") {
        setPendingCompanies((prev) => 
          prev.map(c => c.id === company.id ? company : c)
        );
      } else if (newStatus === "rejected") {
        setRejectedCompanies((prev) => 
          prev.map(c => c.id === company.id ? company : c)
        );
      }
      return;
    }

    // For status changes (approve/reject), move between lists
    // First, remove from old array
    if (oldStatus === "approved") {
      setApprovedCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } else if (oldStatus === "pending") {
      setPendingCompanies((prev) => prev.filter((c) => c.id !== company.id));
    } else if (oldStatus === "rejected") {
      setRejectedCompanies((prev) => prev.filter((c) => c.id !== company.id));
    }

    // Then, add to new array (check for duplicates before adding)
    if (newStatus === "approved") {
      setApprovedCompanies((prev) => {
        const exists = prev.some(c => c.id === company.id);
        if (exists) {
          console.warn(`Company ${company.id} already exists in approved list`);
          return prev.map(c => c.id === company.id ? company : c);
        }
        return [company, ...prev];
      });
    } else if (newStatus === "pending") {
      setPendingCompanies((prev) => {
        const exists = prev.some(c => c.id === company.id);
        if (exists) {
          console.warn(`Company ${company.id} already exists in pending list`);
          return prev.map(c => c.id === company.id ? company : c);
        }
        return [company, ...prev];
      });
    } else if (newStatus === "rejected") {
      setRejectedCompanies((prev) => {
        const exists = prev.some(c => c.id === company.id);
        if (exists) {
          console.warn(`Company ${company.id} already exists in rejected list`);
          return prev.map(c => c.id === company.id ? company : c);
        }
        return [company, ...prev];
      });
    }
  };

  // Build the three tab panes
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