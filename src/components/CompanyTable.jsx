// src/components/CompanyTable.jsx
import React, { useMemo } from 'react';
import {
  Table,
  Tag,
  Space,
  Typography,
  Button,
  Avatar,
  Tooltip,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  MailOutlined,
  GlobalOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// Constants
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Approval',
    color: '#faad14',
    icon: <ExclamationCircleOutlined />,
  },
  approved: {
    label: 'Approved',
    color: '#52c41a',
    icon: <CheckCircleOutlined />,
  },
  rejected: {
    label: 'Rejected',
    color: '#ff4d4f',
    icon: <CloseCircleOutlined />,
  },
};

const PAGE_SIZE = 10;

const CompanyTable = ({
  data = [],
  total = 0,
  currentPage = 1,
  status = 'pending',
  loading = false,
  onPageChange,
  onApprove,
  onReject,
}) => {
  // Memoized table columns
  const columns = useMemo(
    () => [
      {
        title: '#',
        key: 'rowNumber',
        width: 60,
        render: (_text, _record, index) => (
          <Text type="secondary">{(currentPage - 1) * PAGE_SIZE + index + 1}</Text>
        ),
      },
      {
        title: 'Company Details',
        key: 'company',
        render: record => (
          <Space size="middle">
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                backgroundColor: STATUS_CONFIG[status]?.color,
                flexShrink: 0,
              }}
            >
              {record.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: '16px' }}>
                {record.name}
              </Text>
              <Space size="small">
                <GlobalOutlined style={{ color: '#1890ff' }} />
                <Text
                  type="secondary"
                  copyable={{
                    text: `${record.subdomain}.yourapp.com`,
                    tooltips: ['Copy URL', 'Copied!'],
                  }}
                  style={{ fontSize: '12px' }}
                >
                  {record.subdomain}.yourapp.com
                </Text>
              </Space>
              <Space size="small">
                <MailOutlined style={{ color: '#52c41a' }} />
                <Text copyable={{ tooltips: ['Copy Email', 'Copied!'] }} style={{ fontSize: '12px' }}>
                  {record.admin_email}
                </Text>
              </Space>
            </Space>
          </Space>
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Status',
        key: 'status',
        width: 120,
        render: () => {
          const config = STATUS_CONFIG[status];
          return (
            <Tag color={config?.color} icon={config?.icon} style={{ fontWeight: 'bold' }}>
              {config?.label}
            </Tag>
          );
        },
      },
      {
        title: 'Registration Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: timestamp => (
          <Space direction="vertical" size={0}>
            <Space size="small">
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <Text style={{ fontSize: '12px' }}>{new Date(timestamp).toLocaleDateString('en-IN')}</Text>
            </Space>
            <Text type="secondary" style={{ fontSize: '11px' }}>
              {new Date(timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Space>
        ),
        sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        responsive: ['md'],
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 180,
        render: record => {
          if (status === 'pending') {
            return (
              <Space>
                <Tooltip title="Approve this company">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => onApprove?.(record.id, record.name)}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                  >
                    Approve
                  </Button>
                </Tooltip>
                <Tooltip title="Reject this company">
                  <Button danger icon={<CloseCircleOutlined />} onClick={() => onReject?.(record.id, record.name)}>
                    Reject
                  </Button>
                </Tooltip>
              </Space>
            );
          }
          return (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              No actions available
            </Text>
          );
        },
      },
    ],
    [status, currentPage, onApprove, onReject]
  );

  const config = STATUS_CONFIG[status];

  return (
    <Table
      rowKey="id"
      dataSource={data}
      columns={columns}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: PAGE_SIZE,
        total,
        onChange: onPageChange,
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} companies`,
      }}
      className="company-table"
      size="middle"
      locale={{
        emptyText: (
          <div style={{ padding: 40 }}>
            <Text type="secondary">No {config?.label.toLowerCase()} companies found</Text>
          </div>
        ),
      }}
      scroll={{ x: 800 }}
    />
  );
};

export default CompanyTable;
