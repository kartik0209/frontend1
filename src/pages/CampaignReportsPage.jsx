import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Table,
  Button,
  Row,
  Col,
  Alert,
  Spin,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../services/apiServices";
import { FilterOutlined } from "@ant-design/icons";
import "../styles/ConversionReportsPage.scss";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const ConversionReportsPage = () => {
   const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
const [isFilterVisible, setIsFilterVisible] = useState(false);
const [appliedFilters, setAppliedFilters] = useState({});
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/admin/campaign/list", {});
      
      if (response.data && response.data.success) {
        const campaignData = response.data.data || response.data.campaigns || [];
        const campaignsWithKeys = campaignData.map((campaign) => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substring(2, 11),
        }));
        setCampaigns(campaignsWithKeys);
        message.success(`${campaignsWithKeys.length} campaigns loaded successfully!`);
      } else {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to load campaigns";
      message.error(errorMessage);
      setError(errorMessage);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

 const fetchAllReports = async (page = 1, pageSize = 10) => {
  setReportsLoading(true);
  setError(null);
  try {
    const response = await apiClient.get(`/admin/report/campaign-trackings?page=${page}&pageSize=${pageSize}`);
    
    if (response.data?.success) {
      const reports = response.data.data?.trackings || [];
      const total = response.data.data?.total || response.data.totalCount || reports.length;
      
      setReportData(reports);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: total,
      }));
      
      message.success(`${reports.length} reports loaded successfully!`);
    } else {
      throw new Error(response.data?.message || "Failed to fetch reports.");
    }
  } catch (err) {
    console.error("Error fetching reports:", err);
    const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching reports.";
    setError(errorMessage);
    message.error(errorMessage);
    setReportData([]);
    setPagination(prev => ({
      ...prev,
      total: 0,
    }));
  } finally {
    setReportsLoading(false);
  }
};
 


const fetchCampaignReports = async (campaignId, page = 1, pageSize = 10) => {
  if (!campaignId) return;
  
  setReportsLoading(true);
  setError(null);
  try {
    const response = await apiClient.get(`/admin/report/campaign-trackings?page=${page}&pageSize=${pageSize}&campaignId=${campaignId}`);
    
    if (response.data?.success) {
      const reports = response.data.data?.trackings || []; // Fixed this line
      const total = response.data.data?.total || response.data.totalCount || reports.length;
      
      setReportData(reports);
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: total,
      }));

      if (response.data.campaign) {
        setCampaignDetails(response.data.campaign);
      } else {
        const campaign = campaigns.find((c) => c.id === campaignId);
        setCampaignDetails(campaign);
      }

      message.success(`${reports.length} reports loaded successfully!`);
    } else {
      throw new Error(response.data?.message || "Failed to fetch reports.");
    }
  } catch (err) {
    console.error("Error fetching reports:", err);
    const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching reports.";
    setError(errorMessage);
    message.error(errorMessage);
    setReportData([]);
    setPagination(prev => ({
      ...prev,
      total: 0,
    }));
  } finally {
    setReportsLoading(false);
  }
};


  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
    
    if (campaignId) {
      fetchCampaignReports(campaignId, 1, pagination.pageSize);
    } else {
      setCampaignDetails(null);
      fetchAllReports(1, pagination.pageSize);
    }
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    
    if (selectedCampaign) {
      fetchCampaignReports(selectedCampaign, current, pageSize);
    } else {
      fetchAllReports(current, pageSize);
    }
  };

  const handleRefresh = async () => {
    try {
      if (selectedCampaign) {
        await fetchCampaignReports(selectedCampaign, pagination.current, pagination.pageSize);
      } else {
        await fetchAllReports(pagination.current, pagination.pageSize);
      }
      await fetchCampaigns();
    } catch (error) {
      console.error("Error during refresh:", error);
      message.error("Failed to refresh data");
    }
  };

  const handleExportAll = async () => {
    try {
      setReportsLoading(true);
      let allData = [];
      let currentPage = 1;
      const pageSize = 100;
      let hasMoreData = true;

      while (hasMoreData) {
       const url = selectedCampaign 
  ? `/admin/report/campaign-trackings?page=${currentPage}&pageSize=${pageSize}&campaignId=${selectedCampaign}`
  : `/admin/report/campaign-trackings?page=${currentPage}&pageSize=${pageSize}`;
        const response = await apiClient.get(url);
        
        if (response.data?.success) {
         const pageData = response.data.data?.trackings || [];
          allData = [...allData, ...pageData];
          
          if (pageData.length < pageSize) {
            hasMoreData = false;
          } else {
            currentPage++;
          }
        } else {
          hasMoreData = false;
        }
      }

      if (allData.length === 0) {
        message.warning("No data to export");
        return;
      }

      const headers = columns.map((col) => col.title).join(",");
      const rows = allData.map((record) =>
        columns
          .map((col) => {
            const value = record[col.dataIndex];
            if (!value) return "N/A";
            if (col.dataIndex.includes("Time") || col.dataIndex.includes("At")) {
              return dayjs(value).format("YYYY-MM-DD HH:mm:ss");
            }
            return typeof value === "string" ? `"${value}"` : value;
          })
          .join(",")
      );

      const csvContent = [headers, ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `conversion_reports_${selectedCampaign ? `campaign_${selectedCampaign}_` : "all_"}${dayjs().format("YYYY-MM-DD")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success(`Report with ${allData.length} records exported successfully!`);
      }
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    } finally {
      setReportsLoading(false);
    }
  };

const columns = [
  {
    title: "Date",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (timestamp) =>
      timestamp ? dayjs(timestamp).format("DD MMM YYYY") : "N/A",
    sorter: (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0),
    width: 120,
    style: { fontSize: "12px" },
  },
  {
    title: "Click ID",
    dataIndex: "clickId",
    key: "clickId",
    render: (value) => value || "N/A",
    sorter: (a, b) => {
      const aVal = (a.clickId || "").toString().toLowerCase();
      const bVal = (b.clickId || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 100,
    style: { fontSize: "12px" },
  },
  {
    title: "Campaign",
    dataIndex: "campaign",
    key: "campaign",
    render: (campaign) => {
      if (!campaign) return <Tag color="gray">N/A</Tag>;
      
      const { id, title } = campaign;
      
      return (
        <a 
          onClick={(e) => {
            e.preventDefault();
            navigate(`/campaign/${id}`);
          }}
          style={{ 
            color: "#1890ff",
            fontWeight: 500,
            fontSize: "13px",
            cursor: "pointer"
          }}
        >
          {title || `Campaign ${id}`}
        </a>
      );
    },
    sorter: (a, b) => {
      const aVal = (a.campaign?.title || "").toString().toLowerCase();
      const bVal = (b.campaign?.title || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 150,
    style: { fontSize: "12px" },
  },
  {
    title: "Campaign ID",
    dataIndex: "campaignId",
    key: "campaignId",
    render: (value) => value || "N/A",
    sorter: (a, b) => (parseInt(a.campaignId) || 0) - (parseInt(b.campaignId) || 0),
    width: 100,
    style: { fontSize: "12px" },
  },
  {
    title: "Publisher",
    dataIndex: "publisher",
    key: "publisher",
    render: (publisher) => publisher?.name || "N/A",
    sorter: (a, b) => {
      const aVal = (a.publisher?.name || "").toString().toLowerCase();
      const bVal = (b.publisher?.name || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 120,
    style: { fontSize: "12px" },
  },
  {
    title: "IP Address",
    dataIndex: "ipAddress",
    key: "ipAddress",
    render: (text) => text || "N/A",
    sorter: (a, b) => {
      const aVal = (a.ipAddress || "").toString().toLowerCase();
      const bVal = (b.ipAddress || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 130,
    style: { fontSize: "12px" },
  },
  {
    title: "Location",
    dataIndex: "city",
    key: "location",
    render: (city, record) => {
      const location = [record.city, record.region, record.country]
        .filter(Boolean)
        .join(", ");
      return location || "N/A";
    },
    sorter: (a, b) => {
      const aVal = [a.city, a.region, a.country].filter(Boolean).join(", ").toLowerCase();
      const bVal = [b.city, b.region, b.country].filter(Boolean).join(", ").toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 150,
    style: { fontSize: "12px" },
  },
  {
    title: "Device",
    dataIndex: "device",
    key: "device",
    render: (device) => device || "N/A",
    sorter: (a, b) => {
      const aVal = (a.device || "").toString().toLowerCase();
      const bVal = (b.device || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 100,
    style: { fontSize: "12px" },
  },
  {
    title: "OS",
    dataIndex: "os",
    key: "os",
    render: (os) => os || "N/A",
    sorter: (a, b) => {
      const aVal = (a.os || "").toString().toLowerCase();
      const bVal = (b.os || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 100,
    style: { fontSize: "12px" },
  },
  {
    title: "Browser",
    dataIndex: "browser",
    key: "browser",
    render: (browser) => browser || "N/A",
    sorter: (a, b) => {
      const aVal = (a.browser || "").toString().toLowerCase();
      const bVal = (b.browser || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 120,
    style: { fontSize: "12px" },
  },
  {
    title: "Event Type",
    dataIndex: "eventType",
    key: "eventType",
    render: (type) => {
      if (!type) return <Tag color="gray">N/A</Tag>;
      const color = {
        click: "blue",
        conversion: "gold",
        lead: "green",
      }[type.toLowerCase()] || "default";
      return <Tag color={color}>{type.toUpperCase()}</Tag>;
    },
    sorter: (a, b) => {
      const aVal = (a.eventType || "").toString().toLowerCase();
      const bVal = (b.eventType || "").toString().toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 110,
    style: { fontSize: "12px" },
  },
  {
    title: "Parameters",
    key: "parameters",
    render: (_, record) => {
      const params = [record.p1, record.p2, record.p3, record.p4]
        .filter(Boolean)
        .join(", ");
      return params || "N/A";
    },
    sorter: (a, b) => {
      const aVal = [a.p1, a.p2, a.p3, a.p4].filter(Boolean).join(", ").toLowerCase();
      const bVal = [b.p1, b.p2, b.p3, b.p4].filter(Boolean).join(", ").toLowerCase();
      return aVal.localeCompare(bVal);
    },
    width: 150,
    style: { fontSize: "12px" },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (createdAt) =>
      createdAt ? dayjs(createdAt).format("DD MMM YYYY HH:mm") : "N/A",
    sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    width: 140,
    style: { fontSize: "12px" },
  },
];

  useEffect(() => {
    fetchCampaigns();
    fetchAllReports(1, 10);
  }, []);

 // ============================================
// CHANGES FOR ConversionReportsPage.jsx
// ============================================

// 1. IMPORTS ARE ALREADY CORRECT - No changes needed

// 2. REPLACE THE ENTIRE RETURN STATEMENT WITH THIS:
return (
  <div style={{ padding: "24px", background: "#f0f2f5" }}>


    {error && (
      <Alert
        message="Error"
        description={error}
        type="error"
        closable
        style={{ marginBottom: "24px" }}
        onClose={() => setError(null)}
      />
    )}

    <Card
      style={{
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      {/* Filters Row */}
      <Row gutter={[12, 12]} align="middle" style={{ marginBottom: "16px" }}>
        {/* Campaign Dropdown */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <div style={{ marginBottom: "4px", fontSize: "12px" }}>
            <strong>Campaign</strong>
          </div>
       <Select
  placeholder="All Campaigns"
  style={{ width: "100%" }}
  value={selectedCampaign}
  onChange={handleCampaignChange}
  loading={loading}
  showSearch
  allowClear
  size="small"
  filterOption={(input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
>
  {campaigns.map((campaign) => (
    <Option key={campaign.id} value={campaign.id}>
      {`${campaign.id} - ${campaign.name || campaign.title}`}
    </Option>
  ))}
</Select>
        </Col>

        {/* Action Buttons */}
        <Col xs={24} sm={12} md={16} lg={18}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: "8px",
              height: "100%",
              paddingBottom: "2px",
            }}
          >
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={reportsLoading}
              size="small"
              title="Refresh"
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              disabled={pagination.total === 0}
              onClick={handleExportAll}
              loading={reportsLoading}
              size="small"
              title="Export All CSV"
              style={{
                background: "#52c41a",
                borderColor: "#52c41a",
              }}
            />
          </div>
        </Col>
      </Row>

      {/* Campaign Details */}
      {campaignDetails && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <strong style={{ fontSize: "13px" }}>Campaign:</strong>{" "}
              <span style={{ fontSize: "13px" }}>
                {campaignDetails.name || campaignDetails.title}
              </span>
            </Col>
            <Col span={12}>
              <strong style={{ fontSize: "13px" }}>Status:</strong>{" "}
              <Tag
                color={
                  campaignDetails.status === "active" ? "green" : "orange"
                }
              >
                {campaignDetails.status?.toUpperCase()}
              </Tag>
            </Col>
          </Row>
        </div>
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={reportData}
        rowKey={(record) =>
          `${record.id || record.transactionId || Math.random()}-${
            record.trackingId || Math.random()
          }`
        }
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: 1400 }}
        loading={reportsLoading}
        locale={{
          emptyText: "No reports data available",
        }}
        size="small"
        bordered
        onChange={handleTableChange}
      />
    </Card>
  </div>
);

// 3. REMOVE UNUSED STATE VARIABLES (delete these lines):
// - const [isFilterVisible, setIsFilterVisible] = useState(false);
// - const [appliedFilters, setAppliedFilters] = useState({});

// 4. ALL OTHER CODE REMAINS THE SAME - No changes to:
// - fetchCampaigns
// - fetchAllReports
// - fetchCampaignReports
// - handleCampaignChange
// - handleTableChange
// - handleRefresh
// - handleExportAll
// - columns definition
// - useEffect
};

export default ConversionReportsPage;