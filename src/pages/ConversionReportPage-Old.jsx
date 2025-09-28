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
  FilterOutlined, // Import FilterOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import apiClient from "../services/apiServices";
import ConversionReportFilter from "../components/campaign/ConversionRepotFilter"; // Import the filter component

const { Option } = Select;
const { Title } = Typography;

const ConversionReportsPageOld = ({name}) => {
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

  // Helper function to build the query string from applied filters
  const buildFilterQuery = (filters) => {
    const params = new URLSearchParams();
    if (!filters || !filters.basicFilters) return params.toString();

    const { basicFilters } = filters;

    if (basicFilters.dateRange && basicFilters.dateRange[0] && basicFilters.dateRange[1]) {
      params.append('startDate', dayjs(basicFilters.dateRange[0]).startOf('day').toISOString());
      params.append('endDate', dayjs(basicFilters.dateRange[1]).endOf('day').toISOString());
    }
    if (basicFilters.pixelType) params.append('pixelType', basicFilters.pixelType);
    if (basicFilters.eventType) params.append('eventType', basicFilters.eventType);
    if (basicFilters.conversionStatus) params.append('conversionStatus', basicFilters.conversionStatus);
    if (basicFilters.transactionId) params.append('transactionId', basicFilters.transactionId);
    if (basicFilters.trackingId) params.append('trackingId', basicFilters.trackingId);
    if (basicFilters.minAmount) params.append('minAmount', basicFilters.minAmount);
    if (basicFilters.maxAmount) params.append('maxAmount', basicFilters.maxAmount);
    
    // You could expand this to include searchFilters, etc. if your API supports them
    // Example: if (filters.searchFilters?.campaign) params.append('campaignName', filters.searchFilters.campaign);

    return params.toString();
  };

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

  const fetchAllReports = async (page = 1, pageSize = 10, filters = appliedFilters) => {
    setReportsLoading(true);
    setError(null);
    const filterQuery = buildFilterQuery(filters);
    try {
      const response = await apiClient.get(`/admin/report/conversion-trackings?page=${page}&pageSize=${pageSize}&${filterQuery}`);
      
      if (response.data?.success) {
        const reports = response.data.data.pixelTrackings || [];
        const total = response.data.data.total || response.data.totalCount || reports.length;
        
       setReportData(Array.isArray(reports) ? reports : []);

        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: total,
        }));
        
        if (page === 1) { // Only show success message on initial load/filter, not on pagination
          message.success(`${reports.length} reports loaded successfully!`);
        }
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

  const fetchCampaignReports = async (campaignId, page = 1, pageSize = 10, filters = appliedFilters) => {
    if (!campaignId) return;
    
    setReportsLoading(true);
    setError(null);
    const filterQuery = buildFilterQuery(filters);

    try {
      const response = await apiClient.get(`/admin/report/conversion-trackings?page=${page}&pageSize=${pageSize}&campaignId=${campaignId}&${filterQuery}`);
      
      if (response.data?.success) {
        const reports = response.data.data.pixelTrackings || [];
        const total = response.data.data.total || response.data.totalCount || reports.length;
        
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

        if (page === 1) {
          message.success(`${reports.length} reports loaded successfully!`);
        }
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
      dataIndex: "clickTime",
      key: "clickTime",
      render: (clickTime) =>
        clickTime ? dayjs(clickTime).format("DD MMM YYYY") : "N/A",
      sorter: false,
      width: 120,
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
      render: (value) => value || "N/A",
      sorter: false,
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
      sorter: false,
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
      sorter: false,
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
        const color = {
          iframe: "blue",
          image: "green",
          sdk: "purple",
        }[type.toLowerCase()] || "default";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
      width: 100,
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (type) => {
        if (!type) return <Tag color="gray">N/A</Tag>;
        const color = {
          conversion: "gold",
          lead: "blue",
          signup: "green",
        }[type.toLowerCase()] || "default";
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      },
      width: 110,
    },
    {
      title: "Conversion Time",
      dataIndex: "conversionTime",
      key: "conversionTime",
      render: (conversionTime) =>
        conversionTime
          ? dayjs(conversionTime).format("DD MMM YYYY HH:mm")
          : "N/A",
      sorter: false,
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
      sorter: false,
      align: "right",
      width: 130,
    },
    {
      title: "Conversion Status",
      dataIndex: "conversionStatus",
      key: "conversionStatus",
      render: (status) => {
        if (!status) return <Tag color="gray">N/A</Tag>;
        const color = {
          pending: "orange",
          approved: "green",
          rejected: "red",
        }[status.toLowerCase()] || "default";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      width: 130,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format("DD MMM YYYY HH:mm") : "N/A",
      sorter: false,
      width: 140,
    },
  ];

  useEffect(() => {
    fetchCampaigns();
    fetchAllReports(1, 10);
  }, []);



  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>{name} Reports</Title>
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
        initialValues={appliedFilters}
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
    `${record.id || record.transactionId || Math.random()}-${
      record.trackingId || Math.random()
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
></Table>
    </div>
  );
};


export default ConversionReportsPageOld; 