// src/components/advertiser/AdvertiserTable.jsx
import React from "react";
import { Table, Button, Space, Popconfirm, Dropdown, Menu } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

const AdvertiserTable = ({ 
  advertisers, 
  columns, 
  loading, 
  rowSelection, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusChange 
}) => {
  
  const getStatusMenuItems = (record) => {
    const currentStatus = record.status;
    const statusOptions = [
      { key: 'Active', label: 'Active', icon: <CheckCircleOutlined />, color: 'green' },
      { key: 'Inactive', label: 'Inactive', icon: <CloseCircleOutlined />, color: 'red' },
      { key: 'Pending', label: 'Pending', icon: <ExclamationCircleOutlined />, color: 'orange' },
      { key: 'Suspended', label: 'Suspended', icon: <PauseCircleOutlined />, color: 'purple' },
      { key: 'Disabled', label: 'Disabled', icon: <StopOutlined />, color: 'gray' },
      { key: 'Rejected', label: 'Rejected', icon: <CloseCircleOutlined />, color: 'red' },
      { key: 'Banned', label: 'Banned', icon: <StopOutlined />, color: 'red' }
    ];

    return statusOptions
      .filter(option => option.key !== currentStatus)
      .map(option => ({
        key: option.key,
        label: (
          <span style={{ color: option.color }}>
            {option.icon} {option.label}
          </span>
        ),
        onClick: () => onStatusChange(record.id, option.key)
      }));
  };

  const actionColumn = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 120,
    render: (_, record) => {
      const statusMenu = (
        <Menu items={getStatusMenuItems(record)} />
      );

      return (
        <Space size="small">
          <Dropdown
            overlay={statusMenu}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="link"
              icon={<MoreOutlined />}
              size="small"
              style={{ padding: '4px 8px' }}
            />
          </Dropdown>
        </Space>
      );
    },
  };

  const tableColumns = [...columns, actionColumn];

  return (
    <div className="table-container">
      <Table
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={advertisers}
        loading={loading}
        scroll={{ x: 1400, y: 'calc(100vh - 280px)' }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          className: "table-pagination",
        }}
        className="advertiser-table"
        rowClassName={() => "advertiser-row"}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: '16px', background: '#fafafa' }}>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => onView(record)}
                  size="small"
                >
                  View Details
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                  size="small"
                >
                  Edit Advertiser
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this advertiser?"
                  description="This action cannot be undone."
                  onConfirm={() => onDelete(record.id)}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          ),
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <Button
                type="link"
                size="small"
                onClick={e => onExpand(record, e)}
                style={{ padding: 0 }}
              >
                Hide Actions
              </Button>
            ) : (
              <Button
                type="link"
                size="small"
                onClick={e => onExpand(record, e)}
                style={{ padding: 0 }}
              >
                Show Actions
              </Button>
            ),
        }}
      />
    </div>
  );
};

export default AdvertiserTable;