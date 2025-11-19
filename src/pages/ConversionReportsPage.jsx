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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

    // Add groupBy parameters
    if (filters && filters.groupByOptions) {
      const selectedGroupBy = Object.keys(filters.groupByOptions).filter(
        (key) => filters.groupByOptions[key]
      );

      // If user selected groupBy options, use them; otherwise fallback to currentGroupBy
      if (selectedGroupBy.length > 0) {
        params.append("groupBy", selectedGroupBy.join(","));
      } else {
        params.append("groupBy", currentGroupBy);
      }
    } else {
      // Fallback if no filters object
      params.append("groupBy", currentGroupBy);
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
    console.log("Fetching reports with filters:", publisherIds);

    try {
      let url = `/admin/report/main-report?page=${page}&pageSize=${pageSize}`;

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
      selectedAdvertisers,
      dateRange
    );
  };

  console.log("publishers selected:", selectedPublishers);

  const handlePublisherChange = (publisherIds) => {
    console.log("handlePublisherChange called with:", publisherIds);
    setSelectedPublishers(publisherIds);

    fetchMainReports(
      1,
      pagination.pageSize,
      appliedFilters,
      selectedCampaigns,
      publisherIds,
      selectedAdvertisers,
      dateRange
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
      advertiserIds,
      dateRange
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

  const handleTableChange = (paginationInfo, filters, sorter) => {
    const { current, pageSize } = paginationInfo;
    fetchMainReports(
      current,
      pageSize,
      appliedFilters,
      selectedCampaigns,
      selectedPublishers,
      selectedAdvertisers,
      dateRange
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
        selectedAdvertisers,
        dateRange
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
        let url = `/admin/report/main-report?page=${currentPage}&pageSize=${pageSize}`;

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
  // Replace your getColumns function with this dynamic version

  const getColumns = () => {
    const dataColumns = [];

    // Detect which fields exist in the first report item
    const firstRecord =
      reportData && reportData.length > 0 ? reportData[0] : {};
    const hasFields = {
      campaign: "campaign" in firstRecord || "campaignId" in firstRecord,
      publisher: "publisher" in firstRecord || "publisherId" in firstRecord,
      advertiser: "advertiser" in firstRecord || "advertiserId" in firstRecord,
      day: "Day" in firstRecord,
    };

    // Add Day column if present
    if (hasFields.day) {
      dataColumns.push({
        title: "Day",
        dataIndex: "Day",
        key: "Day",
        width: 120,
        style: { fontSize: "12px" },
        sorter: (a, b) => new Date(a.Day) - new Date(b.Day),
      });
    }

    // Add Campaign column if present
    if (hasFields.campaign) {
      dataColumns.push({
        title: "Campaign",
        dataIndex: "campaign",
        key: "campaign",
        width: 150,
        style: { fontSize: "12px" },
        render: (value, record) => {
          if (!value && !record.campaignId) return <Tag color="gray">N/A</Tag>;

          const campaignName = value || "Unknown Campaign";
          const campaignId = record.campaignId || record.campaign?.id;

          if (!campaignId) {
            return <span style={{ fontSize: "12px" }}>{campaignName}</span>;
          }

          return (
            <span
              onClick={() => navigate(`/campaign/${campaignId}`)}
              style={{
                color: "#1890ff",
                fontWeight: 500,
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {campaignId} - {campaignName}
            </span>
          );
        },
        sorter: (a, b) => {
          const aVal = (a.campaign || "").toString().toLowerCase();
          const bVal = (b.campaign || "").toString().toLowerCase();
          return aVal.localeCompare(bVal);
        },
      });
    }

    // Add Publisher column if present
    if (hasFields.publisher) {
      dataColumns.push({
        title: "Publisher",
        dataIndex: "publisher",
        key: "publisher",
        width: 150,
        style: { fontSize: "12px" },
        render: (publisher, record) => {
          if (!publisher && !record.publisherId)
            return <Tag color="gray">N/A</Tag>;

          const publisherName = publisher || "Unknown Publisher";
          const publisherId = record.publisherId || publisher?.id;

          if (!publisherId) {
            return <span style={{ fontSize: "12px" }}>{publisherName}</span>;
          }

          return (
            <span
              onClick={() => navigate(`/publisher/${publisherId}`)}
              style={{
                color: "#1890ff",
                fontWeight: 500,
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {publisherId} - {publisherName}
            </span>
          );
        },
        sorter: (a, b) => {
          const aVal = (a.publisher || "").toString().toLowerCase();
          const bVal = (b.publisher || "").toString().toLowerCase();
          return aVal.localeCompare(bVal);
        },
      });
    }

    // Add Advertiser column if present
    if (hasFields.advertiser) {
      dataColumns.push({
        title: "Advertiser",
        dataIndex: "advertiser",
        key: "advertiser",
        width: 150,
        style: { fontSize: "12px" },
        render: (advertiser, record) => {
          if (!advertiser && !record.advertiserId)
            return <Tag color="gray">N/A</Tag>;

          const advertiserName = advertiser || "Unknown Advertiser";
          const advertiserId = record.advertiserId || advertiser?.id;

          if (!advertiserId) {
            return <span style={{ fontSize: "12px" }}>{advertiserName}</span>;
          }

          return (
            <span
              onClick={() => navigate(`/advertiser/${advertiserId}`)}
              style={{
                color: "#1890ff",
                fontWeight: 500,
                fontSize: "12px",
                cursor: "pointer",
                display: "inline-block",
              }}
            >
              {advertiserId} - {advertiserName}
            </span>
          );
        },
        sorter: (a, b) => {
          const aVal = (a.advertiser || "").toString().toLowerCase();
          const bVal = (b.advertiser || "").toString().toLowerCase();
          return aVal.localeCompare(bVal);
        },
      });
    }

    // Add metric columns (always shown)
    dataColumns.push(
      {
        title: "Clicks",
        dataIndex: "grossClicks",
        key: "grossClicks",
        render: (value) => (parseInt(value) || 0).toLocaleString(),
        align: "right",
        width: 100,
        style: { fontSize: "12px" },
        sorter: (a, b) =>
          (parseInt(a.grossClicks) || 0) - (parseInt(b.grossClicks) || 0),
      },
    {
  title: "Conversions",
  dataIndex: "totalConversions",
  key: "totalConversions",
  render: (value, record) => {
    const conversions = parseInt(value) || 0;

    // Build query params for navigation
    const params = new URLSearchParams();

    // Add date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      params.append(
        "startDate",
        dayjs(dateRange[0]).format("YYYY-MM-DD")
      );
      params.append("endDate", dayjs(dateRange[1]).format("YYYY-MM-DD"));
    }

    // Add selected campaigns
    if (selectedCampaigns && selectedCampaigns.length > 0) {
      params.append("campaign", selectedCampaigns.join(","));
    }

    // Add selected publishers
    if (selectedPublishers && selectedPublishers.length > 0) {
      params.append("publisher", selectedPublishers.join(","));
    }

    // Add selected advertisers
    if (selectedAdvertisers && selectedAdvertisers.length > 0) {
      params.append("advertiser", selectedAdvertisers.join(","));
    }

    // Add row-specific IDs if available
    if (record.campaignId) {
      params.append("rowCampaignId", record.campaignId);
    }
    if (record.publisherId) {
      params.append("rowPublisherId", record.publisherId);
    }
    if (record.advertiserId) {
      params.append("rowAdvertiserId", record.advertiserId);
    }

    const queryString = params.toString();

    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/reports/conversion-old?${queryString}`);
        }}
        style={{
          color: "#1890ff",
          cursor: "pointer",
          textDecoration: "underline",
          fontSize: "12px",
        }}
      >
        {conversions.toLocaleString()}
      </span>
    );
  },
  align: "right",
  width: 120,
  style: { fontSize: "12px" },
  sorter: (a, b) =>
    (parseInt(a.totalConversions) || 0) -
    (parseInt(b.totalConversions) || 0),
},
      {
        title: "Revenue",
        dataIndex: "totalRevenue",
        key: "totalRevenue",
        render: (value) => {
          if (!value || value === 0) return "$0.00";
          return `${parseFloat(value).toFixed(2)}`;
        },
        align: "right",
        width: 120,
        style: { fontSize: "12px" },
        sorter: (a, b) =>
          (parseFloat(a.totalRevenue) || 0) - (parseFloat(b.totalRevenue) || 0),
      },
      {
        title: "Payout",
        dataIndex: "totalPayout",
        key: "totalPayout",
        render: (value) => {
          if (!value || value === 0) return "$0.00";
          return `${parseFloat(value).toFixed(2)}`;
        },
        align: "right",
        width: 120,
        style: { fontSize: "12px" },
        sorter: (a, b) =>
          (parseFloat(a.totalPayout) || 0) - (parseFloat(b.totalPayout) || 0),
      },
      {
        title: "Profit",
        dataIndex: "totalProfit",
        key: "totalProfit",
        render: (value) => {
          if (!value || value === 0) return "$0.00";
          const profit = parseFloat(value);
          return (
            <span
              style={{ color: profit >= 0 ? "green" : "red", fontSize: "12px" }}
            >
              {profit.toFixed(2)}
            </span>
          );
        },
        align: "right",
        width: 120,
        style: { fontSize: "12px" },
        sorter: (a, b) =>
          (parseFloat(a.totalProfit) || 0) - (parseFloat(b.totalProfit) || 0),
      }
    );

    return dataColumns;
  };

  // Then update your columns variable
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
    setSelectedCampaigns([]);
    setSelectedPublishers([]);
    setSelectedAdvertisers([]);
    setDateRangeType("today");
    setShowCustomDatePicker(false);
    setError(null);

    const initialFilters = {
      groupByOptions: {
        [getGroupByFromName(name)]: true,
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
      basicFilters: {
        pixelType: null,
        eventType: null,
        conversionStatus: null,
        transactionId: "",
        trackingId: "",
        minAmount: null,
        maxAmount: null,
      },
      searchFilters: {},
      additionalFilters: {},
      otherOptions: {},
    };

    setAppliedFilters(initialFilters);

    // Fetch fresh data
    fetchCampaigns();
    fetchPublishers();
    fetchAdvertisers();

    // Set initial date range to "last30days"
    const initialRange = getDateRangeByType("today");
    setDateRange(initialRange);

    // Fetch reports with fresh filters
    fetchMainReports(1, 10, initialFilters, [], [], [], initialRange);
  }, [name]);

  return (
    <div style={{ padding: "14px" }}>
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
        <Row
          align="middle"
          gutter={[8, 8]}
          style={{
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {/* Campaign Dropdown */}
          <Col flex="1 1 180px">
            <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: 2 }}>
              Campaign
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
              size="small"
              optionLabelProp="label"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {campaigns.map((c) => (
                <Option key={c.id} value={c.id} label={`${c.id} - ${c.title}`}>
                  {`${c.id} - ${c.title}`}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Publisher Dropdown */}
          <Col flex="1 1 180px">
            <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: 2 }}>
              Publisher
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
              size="small"
            >
              {publishers.map((p) => (
                <Option key={p.id} value={p.id}>
                  {`${p.id} - ${p.name}`}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Advertiser Dropdown */}
          <Col flex="1 1 180px">
            <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: 2 }}>
              Advertiser
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
              size="small"
            >
              {advertisers.map((a) => (
                <Option key={a.id} value={a.id}>
                  {`${a.id} - ${a.name}`}
                </Option>
              ))}
            </Select>
          </Col>

          {/* Date Range */}
          <Col flex="1 1 180px">
            <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: 2 }}>
              <CalendarOutlined style={{ marginRight: 6 }} /> Date Range
            </div>
            <Select
              style={{ width: "100%" }}
              value={dateRangeType}
              onChange={handleDateRangeTypeChange}
              size="small"
            >
              <Option value="today">Today</Option>
              <Option value="yesterday">Yesterday</Option>
              <Option value="last7days">Last 7 Days</Option>
              <Option value="last30days">Last 30 Days</Option>
              <Option value="thismonth">This Month</Option>
              <Option value="lastmonth">Last Month</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </Col>

          {/* Buttons (Tight Right Side) */}
          <Col flex="none">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                paddingTop: "20px",
              }}
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={reportsLoading}
                size="small"
              />
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportAll}
                disabled={pagination.total === 0}
                loading={reportsLoading}
                size="small"
                style={{
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              />
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: "24px", padding: "0 14px" }}>
          <div
            style={{
              width: "90vw",
              maxWidth: "1400px",
              overflowX: "auto",
              margin: "0 auto",
            }}
          >
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
                pageSizeOptions: ["10", "20", "50", "100", "200", "400"],
              }}
              scroll={{ x: "max-content" }}
              loading={reportsLoading}
              locale={{
                emptyText: "No reports data available",
              }}
              size="small"
              bordered
              onChange={handleTableChange}
              style={{
                width: "100%",
                fontSize: "12px",
              }}
            />
          </div>
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
