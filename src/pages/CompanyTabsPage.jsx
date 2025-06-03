// src/pages/CompanyTabsPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Table,
  Tag,
  Space,
  Typography,
  Spin,
  Alert,
  message,
  Button,
  Modal,
} from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import apiClient from '../services/apiServices';
import ApproveConfirmModal from '../components/ApproveConfirmModal';
import '../styles/CompanyTabsPage.scss'; // Assuming you have a CSS file for styles

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const STATUS_KEYS = ['pending', 'approved', 'rejected'];
const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const CompanyTabsPage = () => {
  // State per tab: { data: [], total: 0, loading: false, page: 1, notFound: false }
  const initialTabState = {
    data: [],
    total: 0,
    loading: false,
    page: 1,
    notFound: false,
  };

  const [tabsData, setTabsData] = useState({
    pending: { ...initialTabState },
    approved: { ...initialTabState },
    rejected: { ...initialTabState },
  });
  const [activeTab, setActiveTab] = useState('pending');

  // Modal state for approval confirmation
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');

  // Fetch function for a given status and page
  const fetchCompaniesByStatus = (status, page = 1) => {
    setTabsData((prev) => ({
      ...prev,
      [status]: { ...prev[status], loading: true, notFound: false },
    }));

    const endpoint = `/admin/company/list?status=${status}&page=${page}&order=ASC`;
    apiClient
      .get(endpoint)
      .then((res) => {
        const json = res.data;
        if (json.success && Array.isArray(json.data)) {
          const totalCount = json.totalCount ?? json.data.length;
          setTabsData((prev) => ({
            ...prev,
            [status]: {
              ...prev[status],
              data: json.data,
              total: totalCount,
              loading: false,
              page,
            },
          }));
        } else {
          message.error('Unexpected data format from server.');
          setTabsData((prev) => ({
            ...prev,
            [status]: { ...prev[status], loading: false },
          }));
        }
      })
      .catch((err) => {
        console.error(`Error fetching ${status} companies:`, err);
        if (err.response?.status === 404) {
          setTabsData((prev) => ({
            ...prev,
            [status]: { ...prev[status], notFound: true, loading: false },
          }));
        } else {
          message.error('Failed to load company list.');
          setTabsData((prev) => ({
            ...prev,
            [status]: { ...prev[status], loading: false },
          }));
        }
      });
  };

  // Initial load for “pending”
  useEffect(() => {
    fetchCompaniesByStatus('pending', 1);
  }, []);

  // Handler when switching tabs
  const handleTabChange = (key) => {
    setActiveTab(key);
    // If that tab has no data yet, fetch page 1
    if (tabsData[key].data.length === 0 && !tabsData[key].loading) {
      fetchCompaniesByStatus(key, 1);
    }
  };

  // Open confirmation modal
  const openApproveModal = (companyId, companyName) => {
    setSelectedCompanyId(companyId);
    setSelectedCompanyName(companyName);
    setModalVisible(true);
  };

  // Called when user confirms in the modal
  const handleConfirmApprove = () => {
    apiClient
      .put(`/admin/company/approve/${selectedCompanyId}`)
      .then((res) => {
        console.log(
          `Company ${selectedCompanyId} approved response:`,
          res.data
        );
        if (res.data.success) {
          // Show a centered success modal
          Modal.success({
            title: 'Company Approved',
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            content: (
              <Text>
                "{selectedCompanyName}" has been approved successfully.
              </Text>
            ),
            centered: true,
            onOk() {
              // Refresh Pending tab (page 1)
              fetchCompaniesByStatus('pending', 1);
            },
          });
        } else {
          message.error('Server responded with failure.');
        }
      })
      .catch((err) => {
        console.error(
          `Error approving company ${selectedCompanyId}:`,
          err
        );
        message.error('Failed to approve company. Please try again.');
      })
      .finally(() => {
        setModalVisible(false);
      });
  };

  // Close the confirmation modal
  const handleCancelApprove = () => {
    setModalVisible(false);
    setSelectedCompanyId(null);
    setSelectedCompanyName('');
  };

  // Table columns
  const columns = [
    {
      title: 'No.',
      key: 'rowNumber',
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" copyable>
            {record.subdomain}.yourapp.com
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
    // “Action” column only for Pending
    {
      title: 'Action',
      key: 'action',
      render: (_text, record) => {
        if (activeTab === 'pending') {
          return (
            <Button
              type="primary"
              onClick={() => openApproveModal(record.id, record.name)}
            >
              Approve
            </Button>
          );
        }
        return null;
      },
      width: 120,
    },
  ];

  // Pagination handler
  const handlePageChange = (newPage) => {
    fetchCompaniesByStatus(activeTab, newPage);
    setTabsData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], page: newPage },
    }));
  };

  return (
    <div className="company-tabs-page">
      {/* Header */}
      <div className="company-tabs-page__header">
        <Title className="company-tabs-page__title">Company List</Title>
        <Paragraph className="company-tabs-page__subtitle">
          Manage companies by status
        </Paragraph>
      </div>

      {/* Tabs Container */}
      <div className="company-tabs-page__tabs-container">
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          {STATUS_KEYS.map((statusKey) => {
            const { data, total, loading, page, notFound } =
              tabsData[statusKey];

            return (
              <TabPane tab={STATUS_LABELS[statusKey]} key={statusKey}>
                {loading ? (
                  <div className="company-tabs-page__spinner">
                    <Spin
                      indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                    />
                  </div>
                ) : notFound ? (
                  <Alert
                    className="company-tabs-page__alert"
                    type="warning"
                    message="Endpoint Not Found (404)"
                    description={`Could not find /admin/company/list?status=${statusKey}. Please verify your backend route.`}
                    showIcon
                  />
                ) : (
                  <Table
                    className="company-tabs-page__table"
                    rowKey="id"
                    dataSource={data}
                    columns={columns}
                    pagination={{
                      current: page,
                      pageSize: 10,
                      total,
                      onChange: handlePageChange,
                    }}
                    bordered
                    size="middle"
                    locale={{ emptyText: 'No companies to display' }}
                  />
                )}
              </TabPane>
            );
          })}
        </Tabs>
      </div>

      {/* Confirmation Modal */}
      <ApproveConfirmModal
        visible={modalVisible}
        companyName={selectedCompanyName}
        onConfirm={handleConfirmApprove}
        onCancel={handleCancelApprove}
      />
    </div>
  );
};

export default CompanyTabsPage;

