import React, { useState, useEffect } from "react";
import {
  Card,
  Select,
  Table,
  DatePicker,
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
const { RangePicker } = DatePicker;
const { Title } = Typography;

const ConversionReportsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all campaigns for dropdown
  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/admin/campaign/list", {
        // Add any required parameters here
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.success) {
        const campaignData =
          response.data.data || response.data.campaigns || [];
        console.log("Campaign Data:", campaignData);

        // Ensure each campaign has a unique key for the table
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
      setCampaigns([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch campaign reports - Fixed to use campaignId
  const fetchCampaignReports = async (campaignId) => {
    if (!campaignId) return;
    setReportsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/admin/report/conversion-trackings/${campaignId}`
      );
      console.log("Campaign Reports Response:", response.data);

      if (response.data?.success) {
        const reports = response.data.data || [];
        setReportData(reports);

        // Set campaign details if available
        if (response.data.campaign) {
          setCampaignDetails(response.data.campaign);
        } else {
          // Find campaign details from campaigns array
          const campaign = campaigns.find((c) => c.id === campaignId);
          setCampaignDetails(campaign);
        }

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
  };

  // Handle campaign selection
  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
    if (campaignId) {
      fetchCampaignReports(campaignId);
    } else {
      setCampaignDetails(null);
      setReportData([]);
    }
  };

  // Handle date range change - REMOVED

  // Refresh data - Fixed
  const handleRefresh = async () => {
    try {
      if (selectedCampaign) {
        await fetchCampaignReports(selectedCampaign);
      }
      await fetchCampaigns();
    } catch (error) {
      console.error("Error during refresh:", error);
      message.error("Failed to refresh data");
    }
  };

  // Export functionality
  const handleExport = () => {
    try {
      // Convert data to CSV format
      if (reportData.length === 0) {
        message.warning("No data to export");
        return;
      }

      const headers = columns.map((col) => col.title).join(",");
      const rows = reportData.map((record) =>
        columns
          .map((col) => {
            const value = record[col.dataIndex];
            if (!value) return "N/A";
            if (
              col.dataIndex.includes("Time") ||
              col.dataIndex.includes("At")
            ) {
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
          `conversion_reports_${dayjs().format("YYYY-MM-DD")}.csv`
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
  };

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "clickTime",
      key: "clickTime",
      render: (clickTime) =>
        clickTime ? dayjs(clickTime).format("DD MMM YYYY") : "N/A",
      sorter: (a, b) => {
        if (!a.clickTime && !b.clickTime) return 0;
        if (!a.clickTime) return -1;
        if (!b.clickTime) return 1;
        return dayjs(a.clickTime).unix() - dayjs(b.clickTime).unix();
      },
      width: 120,
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      render: (value) => value || "N/A",
      sorter: (a, b) => (a.trackingId || 0) - (b.trackingId || 0),
      width: 100,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text || "N/A",
      width: 150,
    },
    {
      title: "Sale Amount",
      dataIndex: "saleAmount",
      key: "saleAmount",
      render: (value, record) => {
        if (!value) return "N/A";
        const currency = record.currency || "$";
        return `${currency}${parseFloat(value).toFixed(2)}`;
      },
      sorter: (a, b) =>
        (parseFloat(a.saleAmount) || 0) - (parseFloat(b.saleAmount) || 0),
      align: "right",
      width: 120,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (text) => text || "N/A",
      width: 100,
    },
    {
      title: "Click Count",
      dataIndex: "clickCount",
      key: "clickCount",
      render: (value) => (value || 0).toLocaleString(),
      sorter: (a, b) => (a.clickCount || 0) - (b.clickCount || 0),
      align: "right",
      width: 100,
    },
    {
      title: "Session ID",
      dataIndex: "sessionId",
      key: "sessionId",
      render: (text) =>
        text ? (
          <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
            {text.length > 12 ? `${text.substring(0, 12)}...` : text}
          </span>
        ) : (
          "N/A"
        ),
      width: 130,
    },
    {
      title: "Page URL",
      dataIndex: "pageUrl",
      key: "pageUrl",
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "12px" }}
          >
            {url.length > 30 ? `${url.substring(0, 30)}...` : url}
          </a>
        ) : (
          "N/A"
        ),
      width: 200,
    },
    {
      title: "Pixel Type",
      dataIndex: "pixelType",
      key: "pixelType",
      render: (type) => {
        if (!type) return <Tag color="gray">N/A</Tag>;
        const color =
          {
            iframe: "blue",
            image: "green",
            sdk: "purple",
          }[type.toLowerCase()] || "default";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
      width: 100,
      filters: [
        { text: "iFrame", value: "iframe" },
        { text: "Image", value: "image" },
        { text: "SDK", value: "sdk" },
      ],
      onFilter: (value, record) => record.pixelType?.toLowerCase() === value,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (type) => {
        if (!type) return <Tag color="gray">N/A</Tag>;
        const color =
          {
            conversion: "gold",
            lead: "blue",
            signup: "green",
          }[type.toLowerCase()] || "default";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
      width: 110,
      filters: [
        { text: "Conversion", value: "conversion" },
        { text: "Lead", value: "lead" },
        { text: "Signup", value: "signup" },
      ],
      onFilter: (value, record) => record.eventType?.toLowerCase() === value,
    },
    {
      title: "Conversion Time",
      dataIndex: "conversionTime",
      key: "conversionTime",
      render: (conversionTime) =>
        conversionTime
          ? dayjs(conversionTime).format("DD MMM YYYY HH:mm")
          : "N/A",
      sorter: (a, b) => {
        if (!a.conversionTime && !b.conversionTime) return 0;
        if (!a.conversionTime) return -1;
        if (!b.conversionTime) return 1;
        return dayjs(a.conversionTime).unix() - dayjs(b.conversionTime).unix();
      },
      width: 140,
    },
    {
      title: "Conversion Value",
      dataIndex: "conversionValue",
      key: "conversionValue",
      render: (value, record) => {
        if (!value || value === 0) return "N/A";
        const currency = record.currency || "$";
        return `${currency}${parseFloat(value).toFixed(2)}`;
      },
      sorter: (a, b) =>
        (parseFloat(a.conversionValue) || 0) -
        (parseFloat(b.conversionValue) || 0),
      align: "right",
      width: 130,
    },
    {
      title: "Conversion Status",
      dataIndex: "conversionStatus",
      key: "conversionStatus",
      render: (status) => {
        if (!status) return <Tag color="gray">N/A</Tag>;
        const color =
          {
            pending: "orange",
            approved: "green",
            rejected: "red",
          }[status.toLowerCase()] || "default";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      width: 130,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) =>
        record.conversionStatus?.toLowerCase() === value,
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
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Conversion Reports</Title>
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
                  {campaignDetails.status?.toUpperCase()}
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
            `${record.id || record.transactionId || Math.random()}-${
              record.trackingId || Math.random()
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
          scroll={{ x: 1400 }}
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

export default ConversionReportsPage;
