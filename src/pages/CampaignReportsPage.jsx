import React, { useState, useEffect, useCallback } from "react";
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
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../services/apiServices";

const { Option } = Select;
const { Title } = Typography;

const CampaignReportsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all campaigns for dropdown
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/admin/campaign/list", {});

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        const campaignData =
          response.data.data || response.data.campaigns || [];
        console.log("Campaign Data:", campaignData);

        // Ensure each campaign has a unique key
        const campaignsWithKeys = campaignData.map((campaign) => ({
          ...campaign,
          key: campaign.id || Math.random().toString(36).substring(2, 11),
        }));
        setCampaigns(campaignsWithKeys);
        message.success(
          `${campaignsWithKeys.length} campaigns loaded successfully!`
        );
      } else {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load campaigns";
      message.error(errorMessage);
      setError(errorMessage);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch campaign details
  const fetchCampaignDetails = useCallback(
    async (campaignId) => {
      if (!campaignId) return;

      try {
        // First check if we already have the campaign details in our campaigns array
        const campaign = campaigns.find((c) => c.id === campaignId);
        if (campaign) {
          setCampaignDetails(campaign);
          return;
        }

        // If not found in campaigns array, fetch from API
        const response = await apiClient.get(`/admin/campaign/${campaignId}`);
        if (response.data?.success) {
          setCampaignDetails(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
        // Set basic details from campaigns array as fallback
        const campaign = campaigns.find((c) => c.id === campaignId);
        if (campaign) {
          setCampaignDetails(campaign);
        }
      }
    },
    [campaigns]
  );

  // Fetch campaign reports - Fixed API endpoint
  const fetchCampaignReports = useCallback(async (campaignId) => {
    if (!campaignId) return;

    setReportsLoading(true);
    setError(null);
    try {
      // Fixed API endpoint with proper slash
      const response = await apiClient.get(
        `/admin/report/campaign-trackings/${campaignId}`
      );
      console.log("Campaign Reports Response:", response.data);

      if (response.data?.success) {
        const reports = response.data.data || [];
        setReportData(reports);
        message.success(`${reports.length} reports loaded successfully!`);
      } else {
        throw new Error(response.data?.message || "Failed to fetch reports.");
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching reports.";
      setError(errorMessage);
      message.error(errorMessage);
      setReportData([]);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  // Handle campaign selection - Fixed
  const handleCampaignChange = useCallback(
    (campaignId) => {
      setSelectedCampaign(campaignId);
      if (campaignId) {
        fetchCampaignDetails(campaignId);
        fetchCampaignReports(campaignId);
      } else {
        setCampaignDetails(null);
        setReportData([]);
      }
    },
    [fetchCampaignDetails, fetchCampaignReports]
  );

  // Refresh data - Fixed
  const handleRefresh = useCallback(async () => {
    try {
      if (selectedCampaign) {
        await fetchCampaignReports(selectedCampaign);
      }
      await fetchCampaigns();
    } catch (error) {
      console.error("Error during refresh:", error);
      message.error("Failed to refresh data");
    }
  }, [selectedCampaign, fetchCampaignReports, fetchCampaigns]);

  // Export functionality - Actually works now
  const handleExport = useCallback(() => {
    try {
      if (reportData.length === 0) {
        message.warning("No data to export");
        return;
      }

      // Convert data to CSV format
      const headers = columns.map((col) => col.title).join(",");
      const rows = reportData.map((record) =>
        columns
          .map((col) => {
            if (col.key === "actions") return ""; // Skip actions column

            const value = col.dataIndex
              ? Array.isArray(col.dataIndex)
                ? col.dataIndex.reduce((obj, key) => obj?.[key], record)
                : record[col.dataIndex]
              : record[col.key];

            if (!value) return "N/A";
            if (col.key === "timestamp" || col.key === "createdAt") {
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
          `campaign_reports_${dayjs().format("YYYY-MM-DD")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success("Report exported successfully!");
      }
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    }
  }, [reportData]);

  // Table columns - Optimized and fixed
  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) =>
        timestamp ? dayjs(timestamp).format("DD MMM YYYY") : "N/A",
      sorter: (a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return -1;
        if (!b.timestamp) return 1;
        return dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix();
      },
      width: 120,
    },
    {
      title: "Campaign ID",
      dataIndex: "campaignId",
      key: "campaignId",
      render: (value) => value || "N/A",
      width: 100,
    },
    {
      title: "Publisher",
      dataIndex: ["publisher", "name"],
      key: "publisher_name",
      render: (text, record) => {
    
        const publisherName =
          record.publisher?.name ||
          record.publisherName ||
          record.publisher_name ||
          record.publisher?.username ||
          record.publisher?.email ||
          "N/A";
        return publisherName;
      },
      width: 150,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (eventType) => {
        if (!eventType) return <Tag color="gray">N/A</Tag>;
        const color =
          {
            click: "blue",
            impression: "green",
            conversion: "gold",
          }[eventType.toLowerCase()] || "default";
        return <Tag color={color}>{eventType.toUpperCase()}</Tag>;
      },
      width: 120,
      filters: [
        { text: "Click", value: "click" },
        { text: "Impression", value: "impression" },
        { text: "Conversion", value: "conversion" },
      ],
      onFilter: (value, record) => record.eventType?.toLowerCase() === value,
    },
    {
      title: "Click ID",
      dataIndex: "clickId",
      key: "clickId",
      render: (clickId) =>
        clickId ? (
          <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
            {clickId.length > 15 ? `${clickId.substring(0, 15)}...` : clickId}
          </span>
        ) : (
          "N/A"
        ),
      width: 140,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (country) => country || "N/A",
      width: 100,
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
      render: (device) => device || "N/A",
      width: 100,
    },
    {
      title: "OS",
      dataIndex: "os",
      key: "os",
      render: (os) => os || "N/A",
      width: 100,
    },
    {
      title: "Browser",
      dataIndex: "browser",
      key: "browser",
      render: (browser) => browser || "N/A",
      width: 100,
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (ip) =>
        ip ? (
          <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
            {ip}
          </span>
        ) : (
          "N/A"
        ),
      width: 130,
    },
    {
      title: "Region",
      dataIndex: "region",
      key: "region",
      render: (region) => region || "N/A",
      width: 100,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (city) => city || "N/A",
      width: 100,
    },
    {
      title: "Carrier",
      dataIndex: "carrier",
      key: "carrier",
      render: (carrier) => carrier || "N/A",
      width: 100,
    },
    {
      title: "P1",
      dataIndex: "p1",
      key: "p1",
      render: (value) => value || "N/A",
      width: 80,
    },
    {
      title: "P2",
      dataIndex: "p2",
      key: "p2",
      render: (value) => value || "N/A",
      width: 80,
    },
    {
      title: "P3",
      dataIndex: "p3",
      key: "p3",
      render: (value) => value || "N/A",
      width: 80,
    },
    {
      title: "P4",
      dataIndex: "p4",
      key: "p4",
      render: (value) => value || "N/A",
      width: 80,
    },
    {
      title: "User Agent",
      dataIndex: "userAgent",
      key: "userAgent",
      render: (userAgent) =>
        userAgent ? (
          <span title={userAgent} style={{ fontSize: "12px" }}>
            {userAgent.length > 30
              ? `${userAgent.substring(0, 30)}...`
              : userAgent}
          </span>
        ) : (
          "N/A"
        ),
      width: 200,
    },
    {
      title: "Referer",
      dataIndex: "referer",
      key: "referer",
      render: (referer) =>
        referer ? (
          <a
            href={referer}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "12px" }}
          >
            {referer.length > 30 ? `${referer.substring(0, 30)}...` : referer}
          </a>
        ) : (
          "N/A"
        ),
      width: 200,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("DD MMM YYYY HH:mm") : "N/A",
      sorter: (a, b) => {
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return -1;
        if (!b.createdAt) return 1;
        return dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix();
      },
      width: 140,
    },
   
  ];

  // Load campaigns on component mount
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Campaign Reports</Title>
      </div>

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

      {/* Campaign Selection and Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Select Campaign:</strong>
            </div>
            <Select
              placeholder="Choose a campaign"
              style={{ width: "100%" }}
              value={selectedCampaign}
              onChange={handleCampaignChange}
              loading={loading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {campaigns.map((campaign) => (
                <Option key={campaign.id} value={campaign.id}>
                  {campaign.name || campaign.title}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={24} md={16} lg={18}>
            <div style={{ textAlign: "right", marginTop: "24px" }}>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  disabled={!selectedCampaign}
                  loading={reportsLoading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  disabled={!selectedCampaign || reportData.length === 0}
                  onClick={handleExport}
                >
                  Export CSV
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Campaign Details */}
        {campaignDetails && (
          <div
            style={{
              marginTop: "16px",
              padding: "16px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <strong>Campaign:</strong>{" "}
                {campaignDetails.name || campaignDetails.title}
              </Col>
              <Col span={12}>
                <strong>Status:</strong>{" "}
                <Tag
                  color={
                    campaignDetails.status === "active" ? "green" : "orange"
                  }
                >
                  {campaignDetails.status?.toUpperCase() || "UNKNOWN"}
                </Tag>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      {/* Reports Table */}
      <Card
        title="Campaign Reports"
        extra={
          selectedCampaign && (
            <span style={{ color: "#666" }}>
              Total Records: {reportData.length}
            </span>
          )
        }
      >
        <Table
          columns={columns}
          dataSource={reportData}
          rowKey={(record) =>
            `${record.id || record.clickId || Math.random()}-${
              record.campaignId || Math.random()
            }`
          }
          pagination={{
            total: reportData.length,
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 1600 }}
          loading={reportsLoading}
          locale={{
            emptyText: selectedCampaign
              ? "No reports data available for the selected campaign"
              : "Please select a campaign to view reports",
          }}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default CampaignReportsPage;
