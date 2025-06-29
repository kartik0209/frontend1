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
  ExclamationCircleOutlined,
  SwapOutlined
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
   ,
      { key: 'Pending', label: 'Pending', icon: <ExclamationCircleOutlined />, color: 'orange' },
     
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

  const getActionMenuItems = (record) => {
    const statusSubmenu = {
      key: "status-change",
      label: (
        <span>
          <SwapOutlined /> Change Status
        </span>
      ),
      children: getStatusMenuItems(record),
    };

    return [
      {
        key: "view",
        label: (
          <span>
            <EyeOutlined /> View Details
          </span>
        ),
        onClick: () => onView(record),
      },
      {
        key: "edit",
        label: (
          <span>
            <EditOutlined /> Edit Advertiser
          </span>
        ),
        onClick: () => onEdit(record),
      },
      statusSubmenu,
      {
        type: "divider",
      },
      {
        key: "delete",
        label: (
          <Popconfirm
            title="Are you sure you want to delete this advertiser?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <span style={{ color: "red" }}>
              <DeleteOutlined /> Delete Advertiser
            </span>
          </Popconfirm>
        ),
      },
    ];
  };

  const actionColumn = {
    title: "Actions",
    key: "actions",
    fixed: "right",
    width: 80,
    render: (_, record) => {
      const actionMenu = <Menu items={getActionMenuItems(record)} />;

      return (
        <Dropdown
          overlay={actionMenu}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            style={{ 
              padding: '4px 8px',
              border: "1px solid #d9d9d9",
              borderRadius: "6px"
            }}
          />
        </Dropdown>
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
        scroll={{ x: 1400 }}
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
      />
    </div>
  );
};

export default AdvertiserTable;