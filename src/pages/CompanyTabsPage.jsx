import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  Card, 
  Button, 
  Spin, 
  Alert, 
  Empty, 
  Tag, 
  Typography, 
  Space,
  Divider,
  Table,
  Avatar,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import { 
  MailOutlined, 
  CheckOutlined,
  CloseOutlined,
  GlobalOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import '../styles/CompanyTabsPage.scss'; // Assuming you have a CSS file for styles

const { Title, Text } = Typography;

const CompanyTabsPage = () => {
  const [activeTab, setActiveTab] = useState('approved');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
    total: 0
  });
  const [actionLoading, setActionLoading] = useState({});

  const fetchCompanies = async (status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(`/admin/company/list?status=${status}`);
      console.log('Fetched companies:', response.data);
      
      const data = response.data?.data || response.data?.companies || response.data || [];
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch companies');
      console.error('Error fetching companies:', err);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch all statuses to get counts
      const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
        apiClient.get('/admin/company/list?status=approved'),
        apiClient.get('/admin/company/list?status=pending'),
        apiClient.get('/admin/company/list?status=rejected')
      ]);

      const approvedCount = (approvedRes.data?.data || []).length;
      const pendingCount = (pendingRes.data?.data || []).length;
      const rejectedCount = (rejectedRes.data?.data || []).length;

      setStats({
        approved: approvedCount,
        pending: pendingCount,
        rejected: rejectedCount,
        total: approvedCount + pendingCount + rejectedCount
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchCompanies(activeTab);
    fetchStats();
  }, [activeTab]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleApprove = async (companyId, companyName) => {
    setActionLoading(prev => ({ ...prev, [`approve_${companyId}`]: true }));
    
    try {
      await apiClient.put(`/admin/company/approve/${companyId}`);
      message.success(`${companyName} approved successfully`);
      fetchCompanies(activeTab);
      fetchStats(); // Refresh stats
    } catch (err) {
      message.error('Failed to approve company');
      console.error('Error approving company:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve_${companyId}`]: false }));
    }
  };

  const handleReject = async (companyId, companyName) => {
    setActionLoading(prev => ({ ...prev, [`reject_${companyId}`]: true }));
    
    try {
      await apiClient.put(`/admin/company/reject/${companyId}`);
      message.success(`${companyName} rejected successfully`);
      fetchCompanies(activeTab);
      fetchStats(); // Refresh stats
    } catch (err) {
      message.error('Failed to reject company');
      console.error('Error rejecting company:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject_${companyId}`]: false }));
    }
  };

  const getStatusTag = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return <Tag color="success" className="status-tag">Approved</Tag>;
      case 'pending':
        return <Tag color="warning" className="status-tag">Pending</Tag>;
      case 'rejected':
        return <Tag color="error" className="status-tag">Rejected</Tag>;
      default:
        return <Tag color="default" className="status-tag">{status || 'Unknown'}</Tag>;
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        title: 'Company',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        fixed: 'left',
        render: (name, record) => (
          <div className="company-cell">
            <Avatar 
              src={record.logo} 
              size={40}
              className="company-avatar"
            >
              {name ? name.charAt(0).toUpperCase() : 'C'}
            </Avatar>
            <div className="company-info">
              <div className="company-name">{name || 'Unnamed Company'}</div>
              <Text type="secondary" className="company-id">
                ID: {record.id}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Admin Email',
        dataIndex: 'admin_email',
        key: 'admin_email',
        width: 250,
        render: (email) => (
          <div className="email-cell">
            <MailOutlined className="email-icon" />
            <Text copyable={{ text: email }} className="email-text">
              {email}
            </Text>
          </div>
        ),
      },
      {
        title: 'Subdomain',
        dataIndex: 'subdomain',
        key: 'subdomain',
        width: 150,
        render: (subdomain) => (
          <div className="subdomain-cell">
            <GlobalOutlined className="subdomain-icon" />
            <Text code className="subdomain-text">{subdomain}</Text>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status) => getStatusTag(status),
      },
      {
        title: 'Created Date',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 130,
        render: (date) => (
          <div className="date-cell">
            {date ? new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : '-'}
          </div>
        ),
      },
    ];

    const actionsColumn = {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => {
        if (activeTab === 'pending') {
          return (
            <div className="action-buttons">
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={actionLoading[`approve_${record.id}`]}
                onClick={() => handleApprove(record.id, record.name)}
                className="approve-btn"
              >
                Approve
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                loading={actionLoading[`reject_${record.id}`]}
                onClick={() => handleReject(record.id, record.name)}
                className="reject-btn"
              >
                Reject
              </Button>
            </div>
          );
        } else if (activeTab === 'approved') {
          return (
            <Button
              danger
              icon={<CloseOutlined />}
              size="small"
              loading={actionLoading[`reject_${record.id}`]}
              onClick={() => handleReject(record.id, record.name)}
              className="reject-btn"
            >
              Reject
            </Button>
          );
        } else if (activeTab === 'rejected') {
          return (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              loading={actionLoading[`approve_${record.id}`]}
              onClick={() => handleApprove(record.id, record.name)}
              className="approve-btn"
            >
              Approve
            </Button>
          );
        }
        return null;
      },
    };

    return [...baseColumns, actionsColumn];
  };

  const renderStatsCards = () => (
    <Row gutter={[16, 16]} className="stats-cards">
      <Col xs={12} sm={6} md={6} lg={6}>
        <Card className="stat-card total-card">
          <Statistic
            title="Total Companies"
            value={stats.total}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={6}>
        <Card className="stat-card approved-card">
          <Statistic
            title="Approved"
            value={stats.approved}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={6}>
        <Card className="stat-card pending-card">
          <Statistic
            title="Pending"
            value={stats.pending}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6} md={6} lg={6}>
        <Card className="stat-card rejected-card">
          <Statistic
            title="Rejected"
            value={stats.rejected}
            prefix={<ExclamationCircleOutlined />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderContent = () => {
    if (error) {
      return (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="error-alert"
        />
      );
    }

    return (
      <div className="table-container">
        <Table
          columns={getTableColumns()}
          dataSource={companies}
          loading={loading}
          rowKey="id"
          pagination={{
            total: companies.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} companies`,
            className: 'custom-pagination'
          }}
          locale={{
            emptyText: (
              <Empty
                description={`No companies with ${activeTab} status found`}
                className="empty-state"
              />
            ),
          }}
          scroll={{ x: 1000 }}
          className="companies-table"
        />
      </div>
    );
  };

  const getTabLabel = (status, count) => (
    <span className="tab-label">
      {status.charAt(0).toUpperCase() + status.slice(1)}
      <span className="tab-count">({count})</span>
    </span>
  );

  const tabItems = [
    {
      key: 'approved',
      label: getTabLabel('approved', stats.approved),
      children: renderContent(),
    },
    {
      key: 'pending',
      label: getTabLabel('pending', stats.pending),
      children: renderContent(),
    },
    {
      key: 'rejected',
      label: getTabLabel('rejected', stats.rejected),
      children: renderContent(),
    },
  ];

  return (
    <div className="company-tabs-page">
      <div className="page-container">
        <Card className="main-card">
          <div className="page-header">
            <Title level={2} className="page-title">
              Company Management
            </Title>
            <Text type="secondary" className="page-description">
              Manage and review company applications
            </Text>
          </div>

          {renderStatsCards()}

          <Divider className="section-divider" />

          <div className="tabs-container">
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              size="large"
              items={tabItems}
              className="company-tabs"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompanyTabsPage;