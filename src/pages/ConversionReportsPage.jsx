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
  DatePicker,
} from "antd";
import {
  ReloadOutlined,
  DownloadOutlined,
  FilterOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../services/apiServices";
import ConversionReportFilter from "../components/campaign/ConversionRepotFilter";
import "../styles/ConversionReportsPage.scss";

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const ConversionReportsPage = ({ name }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [selectedPublishers, setSelectedPublishers] = useState([]);
  const [selectedAdvertisers, setSelectedAdvertisers] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [dateRangeType, setDateRangeType] = useState("today"); // New state for dropdown selection
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
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

  // Date range presets
  const getDateRangeByType = (type) => {
    switch (type) {
      case "today":
        return [dayjs().startOf("day"), dayjs().endOf("day")];
      case "yesterday":
        return [
          dayjs().subtract(1, "day").startOf("day"),
          dayjs().subtract(1, "day").endOf("day"),
        ];
      case "last7days":
        return [
          dayjs().subtract(6, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
      case "last30days":
        return [
          dayjs().subtract(29, "day").startOf("day"),
          dayjs().endOf("day"),
        ];
      case "thismonth":
        return [dayjs().startOf("month"), dayjs().endOf("month")];
      case "lastmonth":
        return [
          dayjs().subtract(1, "month").startOf("month"),
          dayjs().subtract(1, "month").endOf("month"),
        ];
      case "custom":
        return dateRange;
      default:
        return [dayjs().startOf("day"), dayjs().endOf("day")];
    }
  };

  // Determine groupBy based on name prop
  const getGroupByFromName = (name) => {
    if (!name) return "campaign";

    const nameLower = name.toLowerCase();
    if (nameLower.includes("campaign")) return "campaign";
    if (nameLower.includes("publisher")) return "publisher";
    if (nameLower.includes("advertiser")) return "advertiser";
    if (nameLower.includes("daily") || nameLower.includes("day")) return "day";
    return "campaign"; // default
  };

  const currentGroupBy = getGroupByFromName(name);

  // Helper function to build the query string from applied filters
  const buildFilterQuery = (filters, customDateRange = null) => {
    const params = new URLSearchParams();

    // Handle date range
    const activeDateRange = customDateRange || dateRange;
    if (activeDateRange && activeDateRange[0] && activeDateRange[1]) {
      params.append(
        "startDate",
        dayjs(activeDateRange[0]).format("YYYY-MM-DD")
      );
      params.append("endDate", dayjs(activeDateRange[1]).format("YYYY-MM-DD"));
    }

    if (!filters || !filters.basicFilters) return params.toString();

    const { basicFilters } = filters;

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
      } else {
        throw new Error(response.data?.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load campaigns";
      setError(errorMessage);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/common/publisher/list", {});

      if (response.data && response.data.success) {
        setPublishers(response.data.data || response.data.publishers || []);
      } else {
        throw new Error(response.data?.message || "Failed to fetch publishers");
      }
    } catch (error) {
      console.error("Error fetching publishers:", error);
      setPublishers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/common/advertiser/list", {});

      if (response.data.data && response.data.success) {
        setAdvertisers(response.data.data || response.data.advertisers || []);
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch advertisers"
        );
      }
    } catch (error) {
      console.error("Error fetching advertisers:", error);
      setAdvertisers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMainReports = async (
    page = 1,
    pageSize = 10,
    filters = appliedFilters,
    campaignIds = selectedCampaigns,
    publisherIds = selectedPublishers,
    advertiserIds = selectedAdvertisers,
    customDateRange = null
  ) => {
    setReportsLoading(true);
    setError(null);
    const filterQuery = buildFilterQuery(filters, customDateRange);

    try {
      let url = `/admin/report/main-report?page=${page}&pageSize=${pageSize}&groupBy=${currentGroupBy}`;

      if (campaignIds && campaignIds.length > 0) {
        url += `&campaign=${campaignIds.join(",")}`;
      }

      if (publisherIds && publisherIds.length > 0) {
        url += `&publisher=${publisherIds.join(",")}`;
      }

      if (advertiserIds && advertiserIds.length > 0) {
        url += `&advertiser=${advertiserIds.join(",")}`;
      }

      if (filterQuery) {
        url += `&${filterQuery}`;
      }

      const response = await apiClient.get(url);

      if (response.data?.success) {
        const reports = response.data.data?.reports || response.data.data || [];
        const total =
          response.data.total || response.data.totalCount || reports.length;

        setReportData(Array.isArray(reports) ? reports : []);
        console.log("Fetched reports:", true);

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
    const updatedFilters = {
      ...filters,
      groupByOptions: {
        ...filters.groupByOptions,
        [currentGroupBy]: true,
      },
    };

    setAppliedFilters(updatedFilters);
    fetchMainReports(1, pagination.pageSize, updatedFilters);
  };

  const handleCampaignChange = (campaignIds) => {
    setSelectedCampaigns(campaignIds);
    fetchMainReports(
      1,
      pagination.pageSize,
      appliedFilters,
      campaignIds,
      selectedPublishers,
      selectedAdvertisers
    );
  };

  const handlePublisherChange = (publisherIds) => {
    setSelectedPublishers(publisherIds);
    fetchMainReports(
      1,
      pagination.pageSize,
      appliedFilters,
      selectedCampaigns,
      publisherIds,
      selectedAdvertisers
    );
  };

  const handleAdvertiserChange = (advertiserIds) => {
    setSelectedAdvertisers(advertiserIds);
    fetchMainReports(
      1,
      pagination.pageSize,
      appliedFilters,
      selectedCampaigns,
      selectedPublishers,
      advertiserIds
    );
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      fetchMainReports(
        1,
        pagination.pageSize,
        appliedFilters,
        selectedCampaigns,
        selectedPublishers,
        selectedAdvertisers,
        dates
      );
    }
  };

  const handleDateRangeTypeChange = (type) => {
    setDateRangeType(type);

    if (type === "custom") {
      setShowCustomDatePicker(true);
    } else {
      setShowCustomDatePicker(false);
      const range = getDateRangeByType(type);
      setDateRange(range);

      fetchMainReports(
        1,
        pagination.pageSize,
        appliedFilters,
        selectedCampaigns,
        selectedPublishers,
        selectedAdvertisers,
        range
      );
    }
  };

  const handleTableChange = (paginationInfo) => {
    const { current, pageSize } = paginationInfo;
    fetchMainReports(
      current,
      pageSize,
      appliedFilters,
      selectedCampaigns,
      selectedPublishers,
      selectedAdvertisers
    );
  };

  const handleRefresh = async () => {
    try {
      await fetchMainReports(
        pagination.current,
        pagination.pageSize,
        appliedFilters,
        selectedCampaigns,
        selectedPublishers,
        selectedAdvertisers
      );
      await fetchCampaigns();
      await fetchPublishers();
      await fetchAdvertisers();
      message.success("Data refreshed successfully!");
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

        if (selectedCampaigns && selectedCampaigns.length > 0) {
          url += `&campaign=${selectedCampaigns.join(",")}`;
        }

        if (selectedPublishers && selectedPublishers.length > 0) {
          url += `&publisher=${selectedPublishers.join(",")}`;
        }

        if (selectedAdvertisers && selectedAdvertisers.length > 0) {
          url += `&advertiser=${selectedAdvertisers.join(",")}`;
        }

        if (filterQuery) {
          url += `&${filterQuery}`;
        }

        const response = await apiClient.get(url);

        if (response.data?.success) {
          const pageData =
            response.data.data?.reports || response.data.data || [];
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
          `${currentGroupBy}_reports_${dayjs().format("YYYY-MM-DD")}.csv`
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
    const dataColumns = [
      getGroupByFromName(name) === "day"
        ? {
            title: "Day",
            dataIndex: "Day",
            key: "Day",
            width: 120,
          }
        : getGroupByFromName(name) === "campaign"
        ? {
            title: "Campaign",
            dataIndex: "campaign",
            key: "campaign",
            width: 120,
            render: (value, record) => value || record.campaign || "N/A",
          }
        : getGroupByFromName(name) === "publisher"
        ? {
            title: "Publisher",
            dataIndex: "publisher",
            key: "publisher",
            width: 120,
          }
        : getGroupByFromName(name) === "advertiser"
        ? {
            title: "Advertiser",
            dataIndex: "advertiser",
            key: "advertiser",
            width: 120,
          }
        : {
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
            <span style={{ color: profit >= 0 ? "green" : "red" }}>
              ${profit.toFixed(2)}
            </span>
          );
        },
        sorter: false,
        align: "right",
        width: 120,
      },
    ];

    return dataColumns;
  };

  const columns = [...getColumns()];

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
    setAppliedFilters(getInitialFilterValues());
    fetchCampaigns();
    fetchPublishers();
    fetchAdvertisers();

    // Set initial date range to "today"
    const initialRange = getDateRangeByType("today");
    setDateRange(initialRange);
    setDateRangeType("today");

    fetchMainReports(1, 10);
  }, [name]);

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

      <ConversionReportFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={{
          ...appliedFilters,
          ...getInitialFilterValues(),
        }}
      />

      <Card
        style={{
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          {/* Date Range Picker */}
          <Col xs={24} sm={12} md={8} lg={5}>
            <div style={{ marginBottom: "8px" }}>
              <CalendarOutlined style={{ marginRight: "8px" }} />
              <strong>Date Range:</strong>
            </div>
            <Select
              style={{ width: "100%" }}
              value={dateRangeType}
              onChange={handleDateRangeTypeChange}
            >
              <Option value="today">Today</Option>
              <Option value="yesterday">Yesterday</Option>
              <Option value="last7days">Last 7 Days</Option>
              <Option value="last30days">Last 30 Days</Option>
              <Option value="thismonth">This Month</Option>
              <Option value="lastmonth">Last Month</Option>
              <Option value="custom">Custom</Option>
            </Select>

            {showCustomDatePicker && (
              <RangePicker
                style={{ width: "100%", marginTop: "8px" }}
                value={dateRange}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                allowClear={false}
                placeholder={["Start Date", "End Date"]}
              />
            )}
          </Col>

          {/* Campaign Dropdown */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Campaign:</strong>
            </div>
            <Select
              mode="multiple"
              placeholder="All Campaigns"
              style={{ width: "100%" }}
              value={selectedCampaigns}
              onChange={handleCampaignChange}
              loading={loading}
              showSearch
              allowClear
              maxTagCount="responsive"
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

          {/* Publisher Dropdown */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Publisher:</strong>
            </div>
            <Select
              mode="multiple"
              placeholder="All Publishers"
              style={{ width: "100%" }}
              value={selectedPublishers}
              onChange={handlePublisherChange}
              loading={loading}
              showSearch
              allowClear
              maxTagCount="responsive"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {publishers.map((publisher) => (
                <Option key={publisher.id} value={publisher.id}>
                  {publisher.name || publisher.title}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Advertiser Dropdown */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Advertiser:</strong>
            </div>
            <Select
              mode="multiple"
              placeholder="All Advertisers"
              style={{ width: "100%" }}
              value={selectedAdvertisers}
              onChange={handleAdvertiserChange}
              loading={loading}
              showSearch
              allowClear
              maxTagCount="responsive"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {advertisers.map((advertiser) => (
                <Option key={advertiser.id} value={advertiser.id}>
                  {advertiser.name || advertiser.title}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Action Buttons */}
          <Col xs={24} sm={24} md={24} lg={24}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={reportsLoading}
                shape="circle"
                size="large"
                title="Refresh"
                style={{
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                disabled={pagination.total === 0}
                onClick={handleExportAll}
                loading={reportsLoading}
                shape="circle"
                size="large"
                title="Export All CSV"
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: "24px" , padding: "0 14px" }}  >
           <Table
          columns={columns}
          dataSource={reportData}
          rowKey={(record) =>
            `${
              record.id ||
              record.campaignId ||
              record.publisherId ||
              Math.random()
            }-${record.date || Math.random()}`
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
        </Row>
      </Card>

 

      <Button
        icon={<FilterOutlined />}
        onClick={() => setIsFilterVisible(true)}
        type="primary"
        shape="circle"
        size="large"
        title="Advanced Filters"
        className="filter-button"
        style={{
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );
};

export default ConversionReportsPage;
