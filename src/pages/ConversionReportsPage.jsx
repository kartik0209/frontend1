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
  FilterOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../services/apiServices";
import ConversionReportFilter from "../components/campaign/ConversionRepotFilter";

const { Option } = Select;
const { Title } = Typography;

const ConversionReportsPage = ({ name }) => {
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

  // State for filter modal visibility and applied filters
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Determine groupBy based on name prop
  const getGroupByFromName = (name) => {
    if (!name) return "campaign";
    
    const nameLower = name.toLowerCase();
    if (nameLower.includes("campaign")) return "campaign";
    if (nameLower.includes("publisher")) return "publisher";
    if (nameLower.includes("daily") || nameLower.includes("day")) return "day";
    return "campaign"; // default
  };

  const currentGroupBy = getGroupByFromName(name);

  // Helper function to build the query string from applied filters
  const buildFilterQuery = (filters) => {
    const params = new URLSearchParams();
    if (!filters || !filters.basicFilters) return params.toString();

    const { basicFilters } = filters;

    if (
      basicFilters.dateRange &&
      basicFilters.dateRange[0] &&
      basicFilters.dateRange[1]
    ) {
      params.append(
        "startDate",
        dayjs(basicFilters.dateRange[0]).startOf("day").format("YYYY-MM-DD")
      );
      params.append(
        "endDate",
        dayjs(basicFilters.dateRange[1]).endOf("day").format("YYYY-MM-DD")
      );
    }
    if (basicFilters.pixelType)
      params.append("pixelType", basicFilters.pixelType);
    if (basicFilters.eventType)
      params.append("eventType", basicFilters.eventType);
    if (basicFilters.conversionStatus)
      params.append("conversionStatus", basicFilters.conversionStatus);
    if (basicFilters.transactionId)
      params.append("transactionId", basicFilters.transactionId);
    if (basicFilters.trackingId)
      params.append("trackingId", basicFilters.trackingId);
    if (basicFilters.minAmount)
      params.append("minAmount", basicFilters.minAmount);
    if (basicFilters.maxAmount)
      params.append("maxAmount", basicFilters.maxAmount);

    return params.toString();
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/admin/campaign/list", {});

      if (response.data && response.data.success) {
        const campaignData =
          response.data.data || response.data.campaigns || [];
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
  };

  const fetchMainReports = async (
    page = 1,
    pageSize = 10,
    filters = appliedFilters,
    campaignId = null
  ) => {
    setReportsLoading(true);
    setError(null);
    const filterQuery = buildFilterQuery(filters);
    
    try {
      let url = `/admin/report/main-report?page=${page}&pageSize=${pageSize}&groupBy=${currentGroupBy}`;
      
      if (campaignId) {
        url += `&campaignId=${campaignId}`;
      }
      
      if (filterQuery) {
        url += `&${filterQuery}`;
      }

      const response = await apiClient.get(url);

      if (response.data?.success) {
        const reports = response.data.data?.reports || response.data.data || [];
        const total =
          response.data.data?.total ||
          response.data.totalCount ||
          reports.length;

        setReportData(Array.isArray(reports) ? reports : []);

        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: total,
        }));

        if (page === 1) {
          message.success(`${reports.length} reports loaded successfully!`);
        }
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
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setReportsLoading(false);
    }
  };

  // Handler for applying filters from the modal
  const handleApplyFilters = (filters) => {
    // Auto-select the appropriate groupBy option based on name
    const updatedFilters = {
      ...filters,
      groupByOptions: {
        ...filters.groupByOptions,
        [currentGroupBy]: true,
      },
    };
    
    setAppliedFilters(updatedFilters);
    // Re-fetch data with the new filters, resetting to page 1
    fetchMainReports(1, pagination.pageSize, updatedFilters, selectedCampaign);
  };

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
    if (campaignId) {
      const campaign = campaigns.find((c) => c.id === campaignId);
      setCampaignDetails(campaign);
    } else {
      setCampaignDetails(null);
    }
    fetchMainReports(1, pagination.pageSize, appliedFilters, campaignId);
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    fetchMainReports(current, pageSize, appliedFilters, selectedCampaign);
  };

  const handleRefresh = async () => {
    try {
      await fetchMainReports(
        pagination.current,
        pagination.pageSize,
        appliedFilters,
        selectedCampaign
      );
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
        const filterQuery = buildFilterQuery(appliedFilters);
        let url = `/admin/report/main-report?page=${currentPage}&pageSize=${pageSize}&groupBy=${currentGroupBy}`;
        
        if (selectedCampaign) {
          url += `&campaignId=${selectedCampaign}`;
        }
        
        if (filterQuery) {
          url += `&${filterQuery}`;
        }

        const response = await apiClient.get(url);

        if (response.data?.success) {
          const pageData = response.data.data?.reports || response.data.data || [];
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
            if (
              col.dataIndex.includes("Time") ||
              col.dataIndex.includes("At") ||
              col.dataIndex.includes("date")
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
          `${currentGroupBy}_reports_${
            selectedCampaign ? `campaign_${selectedCampaign}_` : "all_"
          }${dayjs().format("YYYY-MM-DD")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success(
          `Report with ${allData.length} records exported successfully!`
        );
      }
    } catch (error) {
      console.error("Export error:", error);
      message.error("Failed to export data");
    } finally {
      setReportsLoading(false);
    }
  };

  // Dynamic columns based on groupBy type
 const getColumns = () => {
  // Common data columns for all cases
  const dataColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (value, record) => value || record.title || "N/A",
      width: 200,
    },
    {
      title: "Clicks",
      dataIndex: "grossClicks",
      key: "grossClicks",
      render: (value) => (parseInt(value) || 0).toLocaleString(),
      sorter: false,
      align: "right",
      width: 100,
    },
    {
      title: "Conversions",
      dataIndex: "totalConversions",
      key: "totalConversions",
      render: (value) => (parseInt(value) || 0).toLocaleString(),
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (value) => {
        if (!value || value === 0) return "$0.00";
        return `$${parseFloat(value).toFixed(2)}`;
      },
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Payout",
      dataIndex: "totalPayout",
      key: "totalPayout",
      render: (value) => {
        if (!value || value === 0) return "$0.00";
        return `$${parseFloat(value).toFixed(2)}`;
      },
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Profit",
      dataIndex: "totalProfit",
      key: "totalProfit",
      render: (value) => {
        if (!value || value === 0) return "$0.00";
        const profit = parseFloat(value);
        return (
          <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
            ${profit.toFixed(2)}
          </span>
        );
      },
      sorter: false,
      align: "right",
      width: 120,
    },
  ];

  // Return the same columns for all groupBy cases
  return dataColumns;
};
  // Common columns for all report types
  const commonColumns = [
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      render: (value) => (value || 0).toLocaleString(),
      sorter: false,
      align: "right",
      width: 100,
    },
    {
      title: "Conversions",
      dataIndex: "conversions",
      key: "conversions",
      render: (value) => (value || 0).toLocaleString(),
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value, record) => {
        if (!value || value === 0) return "$0.00";
        const currency = record.currency || "$";
        return `${currency}${parseFloat(value).toFixed(2)}`;
      },
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Payout",
      dataIndex: "payout",
      key: "payout",
      render: (value, record) => {
        if (!value || value === 0) return "$0.00";
        const currency = record.currency || "$";
        return `${currency}${parseFloat(value).toFixed(2)}`;
      },
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Profit",
      dataIndex: "profit",
      key: "profit",
      render: (value, record) => {
        if (!value || value === 0) return "$0.00";
        const currency = record.currency || "$";
        const profit = parseFloat(value);
        return (
          <span style={{ color: profit >= 0 ? 'green' : 'red' }}>
            {currency}{profit.toFixed(2)}
          </span>
        );
      },
      sorter: false,
      align: "right",
      width: 120,
    },
    {
      title: "Conversion Rate",
      dataIndex: "conversionRate",
      key: "conversionRate",
      render: (value) => {
        if (!value || value === 0) return "0.00%";
        return `${parseFloat(value).toFixed(2)}%`;
      },
      sorter: false,
      align: "right",
      width: 130,
    },
    {
      title: "EPC",
      dataIndex: "epc",
      key: "epc",
      render: (value, record) => {
        if (!value || value === 0) return "$0.00";
        const currency = record.currency || "$";
        return `${currency}${parseFloat(value).toFixed(4)}`;
      },
      sorter: false,
      align: "right",
      width: 100,
    },
  ];

  const columns = [...getColumns()];

  // Prepare initial filter values based on name prop
  const getInitialFilterValues = () => {
    const initialFilters = {
      groupByOptions: {
        [currentGroupBy]: true,
      },
      reportOptions: {
        clicks: true,
        conversions: true,
        revenue: true,
        payout: true,
        profit: true,
        conversionRate: true,
        epc: true,
      },
    };
    return initialFilters;
  };

  useEffect(() => {
    // Set initial filter values based on name prop
    setAppliedFilters(getInitialFilterValues());
    fetchCampaigns();
    fetchMainReports(1, 10);
  }, [name]);





  
  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>{name} Reports</Title>
        <p style={{ color: "#666", marginTop: "8px" }}>
          Viewing reports grouped by: <strong>{currentGroupBy}</strong>
        </p>
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

      {/* Filter modal component */}
      <ConversionReportFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={{
          ...appliedFilters,
          ...getInitialFilterValues(),
        }}
      />

      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Select Campaign:</strong>
            </div>
            <Select
              placeholder="All Campaigns"
              style={{ width: "100%" }}
              value={selectedCampaign}
              onChange={handleCampaignChange}
              loading={loading}
              showSearch
              allowClear
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
                  icon={<FilterOutlined />}
                  onClick={() => setIsFilterVisible(true)}
                  type="primary"
                >
                  Advanced Filters
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={reportsLoading}
                >
                  Refresh
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  disabled={pagination.total === 0}
                  onClick={handleExportAll}
                  loading={reportsLoading}
                >
                  Export All CSV
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={reportData}
        rowKey={(record) =>
          `${record.id || record.campaignId || record.publisherId || Math.random()}-${
            record.date || Math.random()
          }`
        }
        style={{ fontSize: "12px", margin: 0, padding: 0 }}
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
    </div>
  );
};

export default ConversionReportsPage;