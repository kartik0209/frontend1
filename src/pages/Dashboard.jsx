// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Spin, Button, Typography, message } from 'antd';
import {
  EyeOutlined,

  CheckCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import StatCard from '../components/dashboard/StatCard';
import apiClient from '../services/apiServices';
import '../styles/Dashboard.scss';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [dashboardData, setDashboardData] = useState({
    chartData: [],
    clicks: { today: 0, yesterday: 0, mtd: 0 },
    conversions: { today: 0, yesterday: 0, mtd: 0 },
    impressions: { today: 0, yesterday: 0, mtd: 0 },
    revenue: { today: 0, yesterday: 0, mtd: 0 },
    payout: { today: 0, yesterday: 0, mtd: 0 },
    profit: { today: 0, yesterday: 0, mtd: 0 },
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fromDate = dateRange[0].format('YYYY-MM-DD');
      const toDate = dateRange[1].format('YYYY-MM-DD');

      const response = await apiClient.get(
        `/dashboard?from=${fromDate}&to=${toDate}`
      );

      if (response.data && response.data.success) {
        const data = response.data.data || [];
        processData(data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load dashboard data';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data) => {
    // Separate chart data from summary data
    const chartData = data.filter(item => item.date);
    const clicksData = data.find(item => item.clicks && !item.date);
    const conversionsData = data.find(item => item.conversions && !item.date);

    // Calculate revenue and payout from chart data if not in summary
    const revenueTotal = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const payoutTotal = chartData.reduce((sum, item) => sum + (item.payout || 0), 0);
    const profitTotal = chartData.reduce((sum, item) => sum + (item.profit || 0), 0);

    setDashboardData({
      chartData,
      clicks: clicksData?.clicks || { today: 0, yesterday: 0, mtd: 0 },
      conversions: conversionsData?.conversions || { today: 0, yesterday: 0, mtd: 0 },
      impressions: { today: 0, yesterday: 0, mtd: 0 },
      revenue: { today: 0, yesterday: 0, mtd: revenueTotal },
      payout: { today: 0, yesterday: 0, mtd: payoutTotal },
      profit: { today: 0, yesterday: 0, mtd: profitTotal },
    });
  };

  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  if (error && !dashboardData.chartData.length) {
    return (
      <div className="dashboard-container">
        <Spin spinning={loading} size="large">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <Button type="primary" onClick={loadDashboardData}>
              Retry
            </Button>
          </div>
        </Spin>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Spin spinning={loading} size="large">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-left">
            <Title level={3} className="page-title">PERFORMANCE REPORT</Title>
          </div>
          <div className="header-right">
            <RangePicker
              value={dateRange}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              className="date-range-picker"
              allowClear={false}
            />
          </div>
        </div>

        {/* Performance Chart */}
        <Card className="chart-card" bordered={false}>
          <div className="chart-header">
            <Title level={4}>Performance Report</Title>
            <Button
              icon={<SettingOutlined />}
              type="text"
              className="chart-settings-btn"
            />
          </div>
          <PerformanceChart data={dashboardData.chartData} />
        </Card>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={24} md={8} lg={8}>
            <StatCard
           
              title="CLICKS"
              color="#1890ff"
              today={formatNumber(dashboardData.clicks.today)}
              yesterday={formatNumber(dashboardData.clicks.yesterday)}
              mtd={formatNumber(dashboardData.clicks.mtd)}
            />
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <StatCard
              icon={<CheckCircleOutlined />}
              title="CONVERSIONS"
              color="#52c41a"
              today={dashboardData.conversions.today}
              yesterday={dashboardData.conversions.yesterday}
              mtd={dashboardData.conversions.mtd}
            />
          </Col>

          <Col xs={24} sm={24} md={8} lg={8}>
            <StatCard
              icon={<EyeOutlined />}
              title="IMPRESSIONS"
              color="#faad14"
              today={dashboardData.impressions.today}
              yesterday={dashboardData.impressions.yesterday}
              mtd={dashboardData.impressions.mtd}
            />
          </Col>
        </Row>

        {/* Customize Widgets Button */}
       
      </Spin>
    </div>
  );
};

export default Dashboard;