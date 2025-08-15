import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Typography,
  Spin,
  message,
  Alert,
  Input,
  Button,
  Avatar,
} from 'antd';
import {
  LoadingOutlined,
  SearchOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import AddCompanyDrawer from '../components/company/AddCompanyDrawer';
import '../styles/CompanyList.scss';

const { Text, Title, Paragraph } = Typography;
const { Search } = Input; // Destructure the Search component from Input

const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchCompanies = (searchQuery = '') => {
    setLoading(true);
    setNotFound(false);
    const endpoint = searchQuery
      ? `/admin/company/list?search=${encodeURIComponent(searchQuery)}`
      : '/admin/company/list';

    apiClient
      .get(endpoint)
      .then((res) => {
        const json = res.data;
        if (json.success && Array.isArray(json.data)) {
          setCompanies(json.data);
        } else {
          message.error('Unexpected data format from server.');
          setCompanies([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching company list:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          message.error('Failed to load company list. Please try again.');
        }
        setCompanies([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleRegistrationSuccess = () => {
    setDrawerVisible(false);
    fetchCompanies();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    {
      title: 'Company',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 220,
      render: (name, record) => (
        <Space>
          <Avatar src={record.logo} icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{name}</Text>
            <Text type="secondary" copyable>
              {record.subdomain}.afftrex.com
            </Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Admin Email',
      dataIndex: 'admin_email',
      key: 'admin_email',
      width: 250,
      render: (email) => <Text copyable>{email}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const color =
          {
            approved: 'green',
            pending: 'orange',
            rejected: 'red',
          }[status] || 'default';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription_type',
      key: 'subscription_type',
      width: 120,
      render: (type) => <Tag color="blue">{type?.toUpperCase()}</Tag>,
    },
    {
      title: 'Remaining Days',
      dataIndex: 'subscription_remain_day',
      key: 'subscription_remain_day',
      align: 'center',
      width: 150,
      sorter: (a, b) =>
        a.subscription_remain_day - b.subscription_remain_day,
      render: (days) => <Text strong>{days}</Text>,
    },
    {
      title: 'Start Date',
      dataIndex: 'subscription_start_date',
      key: 'subscription_start_date',
      width: 150,
      render: formatDate,
      sorter: (a, b) =>
        new Date(a.subscription_start_date) -
        new Date(b.subscription_start_date),
    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: formatDate,
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
  ];

  return (
    <>
      <div className="company-list-page">
        <div className="company-list-page__header">
          <div className="company-list-page__header-info">
            <Title className="company-list-page__title">Company List</Title>
            <Paragraph className="company-list-page__subtitle">
              All registered companies and their statuses
            </Paragraph>
          </div>
          {/* ## Updated Header Actions Section ## */}
          <div className="company-list-page__header-actions">
            <Space>
              <Search
                placeholder="Search by name or email"
                onSearch={fetchCompanies}
                allowClear
                size="large"
                style={{ width: 320 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                style={{backgroundColor: '#0a1a4e', color: '#fff'}}
                onClick={() => setDrawerVisible(true)}
              >
                Add Company
              </Button>
            </Space>
          </div>
        </div>

        <div className="company-list-page__table-container">
          {loading ? (
            <div className="company-list-page__spinner">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : (
            <Table
              rowKey="id"
              dataSource={companies}
              columns={columns}
              pagination={{ pageSize: 10, showSizeChanger: true }}
              bordered
              size="middle"
              scroll={{ x: 1300 }}
              locale={{ emptyText: 'No companies available' }}
            />
          )}
        </div>
      </div>
      <AddCompanyDrawer
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
};

export default CompanyListPage;