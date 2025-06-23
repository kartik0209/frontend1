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
} from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import apiClient from '../services/apiServices';
import '../styles/CompanyList.scss'; // Import your styles

const { Text, Title, Paragraph } = Typography;
const { Search } = Input;

const CompanyListPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch function—optionally with search parameter
  const fetchCompanies = (searchQuery = '') => {
    setLoading(true);
    setNotFound(false);

    // Build the endpoint, including ?search= if provided
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
        }
      })
      .catch((err) => {
        console.error('Error fetching company list:', err);
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          message.error('Failed to load company list. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Initial load
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Columns, including a generated row ID
  const columns = [
    {
      title: 'ID',
      key: 'rowIndex',
      width: 60,
      render: (_text, _record, index) => index + 1,
      sorter: (a, b) => companies.indexOf(a) - companies.indexOf(b),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" copyable>
            {record.subdomain}.afftrex.com
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Admin Email',
      dataIndex: 'admin_email',
      key: 'admin_email',
      render: (email) => <Text copyable>{email}</Text>,
      responsive: ['md'],
    },
    {
      title: 'Subdomain',
      dataIndex: 'subdomain',
      key: 'subdomain',
      render: (subdomain) => (
        <Tag color="blue" style={{ textTransform: 'lowercase' }}>
          {subdomain}
        </Tag>
      ),
      sorter: (a, b) => a.subdomain.localeCompare(b.subdomain),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'approved') color = 'green';
        else if (status === 'pending') color = 'orange';
        else if (status === 'rejected') color = 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (ts) =>
        new Date(ts).toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
        }),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      responsive: ['lg'],
    },
  ];

  return (
    <div className="company-list-page">
      {/* Header with title, subtitle, and search input */}
      <div className="company-list-page__header">
        <div className="company-list-page__header-info">
          <Title className="company-list-page__title">Company List</Title>
          <Paragraph className="company-list-page__subtitle">
            All registered companies and their statuses
          </Paragraph>
        </div>
            <div className="company-list-page__header-search">
          <Input
            className="company-list-page__search-input"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            onPressEnter={() => fetchCompanies(searchTerm)}
            size="large"
          />
          <Button
            className="company-list-page__search-button"
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => fetchCompanies(searchTerm)}
            size="large"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Table container */}
      <div className="company-list-page__table-container">
        {loading ? (
          <div className="company-list-page__spinner">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          </div>
        ) : notFound ? (
          <Alert
            className="company-list-page__alert"
            type="warning"
            message="Endpoint Not Found (404)"
            description="Could not find `/admin/company/list` on the server. Please verify your backend route."
            showIcon
          />
        ) : (
          <Table
            rowKey={(record, index) => index}
            dataSource={companies}
            columns={columns}
            pagination={{ pageSize: 10 }}
            bordered
            size="middle"
            locale={{ emptyText: 'No companies available' }}
          />
        )}
      </div>
    </div>
  );
};

export default CompanyListPage;
