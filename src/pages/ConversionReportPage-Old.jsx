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
  CalendarOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs";
import apiClient from "../services/apiServices";
import ConversionReportFilter from "../components/campaign/ConversionRepotFilter"; // Import the filter component
import { useNavigate } from "react-router-dom";
import "../styles/CampaignManagement.scss";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

const ConversionReportsPageOld = ({ name }) => {
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
  const [searchText, setSearchText] = useState("");
  // State for filter modal visibility and applied filters
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const handleQuickSearch = (e) => {
    setSearchText(e.target.value);
  };

  const [publishers, setPublishers] = useState([]);
const [advertisers, setAdvertisers] = useState([]);
const [selectedPublishers, setSelectedPublishers] = useState([]);
const [selectedAdvertisers, setSelectedAdvertisers] = useState([]);
  // Helper function to build the query string from applied filters
  const [dateRange, setDateRange] = useState(null);
const [dateRangeType, setDateRangeType] = useState("last30days");
const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);


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

    if (response.data && response.data.success) {
      setAdvertisers(response.data.data || response.data.advertisers || []);
    } else {
      throw new Error(response.data?.message || "Failed to fetch advertisers");
    }
  } catch (error) {
    console.error("Error fetching advertisers:", error);
    setAdvertisers([]);
  } finally {
    setLoading(false);
  }
};


const handlePublisherChange = (publisherIds) => {
  setSelectedPublishers(publisherIds);
  // Reset to page 1 when filter changes
  const filterQuery = buildPublisherAdvertiserQuery(publisherIds, selectedAdvertisers);
  fetchAllReports(1, pagination.pageSize, filterQuery);
};

const handleAdvertiserChange = (advertiserIds) => {
  setSelectedAdvertisers(advertiserIds);
  // Reset to page 1 when filter changes
  const filterQuery = buildPublisherAdvertiserQuery(selectedPublishers, advertiserIds);
  fetchAllReports(1, pagination.pageSize, filterQuery);
};

// CHANGE 4: Add helper function to build query with publisher/advertiser filters
const buildPublisherAdvertiserQuery = (publisherIds, advertiserIds) => {
  const params = new URLSearchParams();
  
  if (publisherIds && publisherIds.length > 0) {
    params.append("publisher", publisherIds.join(","));
  }
  
  if (advertiserIds && advertiserIds.length > 0) {
    params.append("advertiser", advertiserIds.join(","));
  }
  
  return params.toString();
};














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

const fetchAllReports = async (
  page = 1,
  pageSize = 10,
  additionalFilters = "",
  customDateRange = null
) => {
  setReportsLoading(true);
  setError(null);
  const filterQuery = buildFilterQuery(appliedFilters, customDateRange);
  const allFilters = [filterQuery, additionalFilters].filter(Boolean).join("&");

  try {
    const url = `/admin/report/conversion-trackings?page=${page}&pageSize=${pageSize}${
      allFilters ? `&${allFilters}` : ""
    }`;

    const response = await apiClient.get(url);

    if (response.data?.success) {
      const reports = response.data.data.pixelTrackings || [];
      const total =
        response.data.data.total || response.data.totalCount || reports.length;

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

  const fetchCampaignReports = async (
    campaignId,
    page = 1,
    pageSize = 10,
    filters = appliedFilters
  ) => {
    if (!campaignId) return;

    setReportsLoading(true);
    setError(null);
    const filterQuery = buildFilterQuery(filters);

    try {
      const response = await apiClient.get(
        `/admin/report/conversion-trackings?page=${page}&pageSize=${pageSize}&campaignId=${campaignId}&${filterQuery}`
      );

      if (response.data?.success) {
        const reports = response.data.data.pixelTrackings || [];
        const total =
          response.data.data.total ||
          response.data.totalCount ||
          reports.length;

        setReportData(reports);
        setPagination((prev) => ({
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


const handleDateRangeChange = (dates) => {
  setDateRange(dates);
  if (dates) {
    fetchAllReports(
      1,
      pagination.pageSize,
      buildPublisherAdvertiserQuery(selectedPublishers, selectedAdvertisers),
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

    fetchAllReports(
      1,
      pagination.pageSize,
      buildPublisherAdvertiserQuery(selectedPublishers, selectedAdvertisers),
      range
    );
  }
};




  // Handler for applying filters from the modal
  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    // Re-fetch data with the new filters, resetting to page 1
    if (selectedCampaign) {
      fetchCampaignReports(selectedCampaign, 1, pagination.pageSize, filters);
    } else {
      fetchAllReports(1, pagination.pageSize, filters);
    }
  };

  const handleCampaignChange = (campaignId) => {
    setSelectedCampaign(campaignId);
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
        await fetchCampaignReports(
          selectedCampaign,
          pagination.current,
          pagination.pageSize
        );
      } else {
        await fetchAllReports(pagination.current, pagination.pageSize);
      }
      await fetchCampaigns();
      await fetchPublishers();
      await fetchAdvertisers();
      message.success("Data refreshed successfully");
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
          ? `/admin/report/conversion-trackings?page=${currentPage}&pageSize=${pageSize}&campaignId=${selectedCampaign}`
          : `/admin/report/conversion-trackings?page=${currentPage}&pageSize=${pageSize}`;

        const response = await apiClient.get(url);

        if (response.data?.success) {
          const pageData = response.data.data || [];
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
          `conversion_reports_${
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

  // Replace your columns definition with this dynamic version

const getTableColumns = () => {
  const baseColumns = [
    {
      title: "Date",
      dataIndex: "clickTime",
      key: "clickTime",
      render: (clickTime) =>
        clickTime ? dayjs(clickTime).format("DD MMM YYYY") : "N/A",
      sorter: (a, b) => new Date(a.clickTime || 0) - new Date(b.clickTime || 0),
      width: 120,
      style: { fontSize: "12px" },
    },
    {
      title: "Campaign",
      dataIndex: "campaignTracking",
      key: "campaign",
      render: (campaignTracking) => {
        if (!campaignTracking?.campaign) return <Tag color="gray">N/A</Tag>;

        const { id, title } = campaignTracking.campaign;

        return (
          <a
            href={`/campaign/${id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/campaign/${id}`);
            }}
            style={{
              color: "#1890ff",
              fontWeight: 500,
              fontSize: "13px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {title || `Campaign ${id}`}
          </a>
        );
      },
      sorter: (a, b) => {
        const aVal = (a.campaignTracking?.campaign?.title || "")
          .toString()
          .toLowerCase();
        const bVal = (b.campaignTracking?.campaign?.title || "")
          .toString()
          .toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 150,
      style: { fontSize: "12px" },
    },
  ];

  // Add Publisher column if publisher filter is selected
  if (selectedPublishers && selectedPublishers.length > 0) {
    baseColumns.push({
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
      render: (publisher, record) => {
        // Try to get publisher from record.publisher or record.campaignTracking
        const pubData = publisher || record.campaignTracking?.publisher;
        
        if (!pubData) return <Tag color="gray">N/A</Tag>;

        return (
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate(`/publisher/${pubData.id}`);
            }}
            style={{
              color: "#1890ff",
              fontWeight: 500,
              fontSize: "13px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {pubData.name || `Publisher ${pubData.id}`}
          </a>
        );
      },
      sorter: (a, b) => {
        const aVal = (a.publisher?.name || a.campaignTracking?.publisher?.name || "")
          .toString()
          .toLowerCase();
        const bVal = (b.publisher?.name || b.campaignTracking?.publisher?.name || "")
          .toString()
          .toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 120,
      style: { fontSize: "12px" },
    });
  }

  // Add Advertiser column if advertiser filter is selected
  if (selectedAdvertisers && selectedAdvertisers.length > 0) {
    baseColumns.push({
      title: "Advertiser",
      dataIndex: "advertiser",
      key: "advertiser",
      render: (advertiser, record) => {
        // Try to get advertiser from record.advertiser or record.campaignTracking
        const advData = advertiser || record.campaignTracking?.advertiser;
        
        if (!advData) return <Tag color="gray">N/A</Tag>;

        return (
          <a
            onClick={(e) => {
              e.preventDefault();
              navigate(`/advertiser/${advData.id}`);
            }}
            style={{
              color: "#1890ff",
              fontWeight: 500,
              fontSize: "13px",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {advData.name || `Advertiser ${advData.id}`}
          </a>
        );
      },
      sorter: (a, b) => {
        const aVal = (a.advertiser?.name || a.campaignTracking?.advertiser?.name || "")
          .toString()
          .toLowerCase();
        const bVal = (b.advertiser?.name || b.campaignTracking?.advertiser?.name || "")
          .toString()
          .toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 120,
      style: { fontSize: "12px" },
    });
  }

  // Add remaining columns
  baseColumns.push(
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      render: (value) => value || "N/A",
      sorter: (a, b) => {
        const aVal = (a.trackingId || "").toString().toLowerCase();
        const bVal = (b.trackingId || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 100,
      style: { fontSize: "12px" },
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text || "N/A",
      sorter: (a, b) => {
        const aVal = (a.transactionId || "").toString().toLowerCase();
        const bVal = (b.transactionId || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 150,
      style: { fontSize: "12px" },
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
      style: { fontSize: "12px" },
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
      render: (text) => text || "N/A",
      sorter: (a, b) => {
        const aVal = (a.currency || "").toString().toLowerCase();
        const bVal = (b.currency || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 100,
      style: { fontSize: "12px" },
    },
    {
      title: "Click Count",
      dataIndex: "clickCount",
      key: "clickCount",
      render: (value) => (value || 0).toLocaleString(),
      sorter: (a, b) =>
        (parseInt(a.clickCount) || 0) - (parseInt(b.clickCount) || 0),
      align: "right",
      width: 100,
      style: { fontSize: "12px" },
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
      sorter: (a, b) => {
        const aVal = (a.sessionId || "").toString().toLowerCase();
        const bVal = (b.sessionId || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 130,
      style: { fontSize: "12px" },
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
      sorter: (a, b) => {
        const aVal = (a.pageUrl || "").toString().toLowerCase();
        const bVal = (b.pageUrl || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 200,
      style: { fontSize: "12px" },
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
      sorter: (a, b) => {
        const aVal = (a.pixelType || "").toString().toLowerCase();
        const bVal = (b.pixelType || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 100,
      style: { fontSize: "12px" },
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
      sorter: (a, b) => {
        const aVal = (a.eventType || "").toString().toLowerCase();
        const bVal = (b.eventType || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 110,
      style: { fontSize: "12px" },
    },
    {
      title: "Conversion Time",
      dataIndex: "conversionTime",
      key: "conversionTime",
      render: (conversionTime) =>
        conversionTime
          ? dayjs(conversionTime).format("DD MMM YYYY HH:mm")
          : "N/A",
      sorter: (a, b) =>
        new Date(a.conversionTime || 0) - new Date(b.conversionTime || 0),
      width: 140,
      style: { fontSize: "12px" },
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
      style: { fontSize: "12px" },
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
      sorter: (a, b) => {
        const aVal = (a.conversionStatus || "").toString().toLowerCase();
        const bVal = (b.conversionStatus || "").toString().toLowerCase();
        return aVal.localeCompare(bVal);
      },
      width: 130,
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
    }
  );

  return baseColumns;
};

const columns = getTableColumns();

useEffect(() => {
  fetchCampaigns();
  fetchPublishers();
  fetchAdvertisers();

  // Set initial date range to "last30days"
  const initialRange = getDateRangeByType("last30days");
  setDateRange(initialRange);
  setDateRangeType("last30days");

  fetchAllReports(1, 10, "", initialRange);
}, []);

  // ============================================
  // CHANGES FOR ConversionReportsPageOld.jsx
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

      <ConversionReportFilter
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={{
          ...appliedFilters,
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
  gutter={[12, 12]}
  align="middle"
  style={{
    marginBottom: "16px",
    flexWrap: "nowrap", // keeps everything in one line unless screen is too small
    overflowX: "auto", // allows horizontal scroll if needed
  }}
>
  {/* Campaign Dropdown */}
  <Col flex="1 1 220px">
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
      optionLabelProp="label"
    >
      {campaigns.map((campaign) => (
        <Option
          key={campaign.id}
          value={campaign.id}
          label={`${campaign.id} - ${campaign.name || campaign.title}`}
        >
          {`${campaign.id} - ${campaign.name || campaign.title}`}
        </Option>
      ))}
    </Select>
  </Col>

  {/* Publisher Dropdown */}
  <Col flex="1 1 220px">
    <div style={{ marginBottom: "4px", fontSize: "12px" }}>
      <strong>Publisher</strong>
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
      size="small"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {publishers.map((publisher) => (
        <Option key={publisher.id} value={publisher.id}>
          {`${publisher.id} - ${publisher.name || publisher.title}`}
        </Option>
      ))}
    </Select>
  </Col>

  {/* Advertiser Dropdown */}
  <Col flex="1 1 220px">
    <div style={{ marginBottom: "4px", fontSize: "12px" }}>
      <strong>Advertiser</strong>
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
      size="small"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {advertisers.map((advertiser) => (
        <Option key={advertiser.id} value={advertiser.id}>
          {`${advertiser.id} - ${advertiser.name || advertiser.title}`}
        </Option>
      ))}
    </Select>
  </Col>

  {/* Date Range */}
<Col flex="1 1 220px">
  <div style={{ marginBottom: "4px", fontSize: "12px" }}>
    <strong><CalendarOutlined style={{ marginRight: 6 }} /> Date Range</strong>
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

{showCustomDatePicker && (
  <Col flex="1 1 280px">
    <div style={{ marginBottom: "4px", fontSize: "12px" }}>
      <strong>Custom Date Range</strong>
    </div>
    <RangePicker
      style={{ width: "100%" }}
      value={dateRange}
      onChange={handleDateRangeChange}
      format="DD MMM YYYY"
      size="small"
    />
  </Col>
)}

  {/* Action Buttons */}
  <Col flex="0 0 auto">
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: "8px",
        height: "100%",
        paddingBottom: "2px",
        minWidth: "120px",
      }}
    >
      <Button
        icon={<ReloadOutlined />}
        onClick={handleRefresh}
        loading={reportsLoading}
        size="small"
        title="Refresh"
        style={{marginTop: '20px'}}
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

        <Row style={{ marginTop: "24px", padding: "0 14px" }}>
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

  // 3. ALL OTHER CODE REMAINS THE SAME - No changes to:
  // - All state variables (keep as is)
  // - buildFilterQuery function
  // - fetchCampaigns function
  // - fetchAllReports function
  // - fetchCampaignReports function
  // - handleApplyFilters function
  // - handleCampaignChange function
  // - handleTableChange function
  // - handleRefresh function
  // - handleExportAll function
  // - columns definition
  // - useEffect
};

export default ConversionReportsPageOld;
