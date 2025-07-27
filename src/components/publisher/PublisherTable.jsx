import React from "react";
import { Table, Button, Popconfirm, Dropdown, Menu } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
  StopOutlined,
} from "@ant-design/icons";

const PublisherTable = ({
  publishers,
  columns,
  loading,
  rowSelection,
  onEdit,
  onDelete,
  onView,
  onDetail, // Renamed from 'ondetails' for consistency with CampaignTable
  onStatusChange,
}) => {
  const getStatusMenuItems = (record) => {
    const currentStatus = record.status;
    const statusOptions = [
      { key: "Active", label: "Active", icon: <CheckCircleOutlined />, color: "green" },
      { key: "Pending", label: "Pending", icon: <ExclamationCircleOutlined />, color: "orange" },
      { key: "Disabled", label: "Disabled", icon: <StopOutlined />, color: "gray" },
      { key: "Rejected", label: "Rejected", icon: <CloseCircleOutlined />, color: "red" },
      { key: "Banned", label: "Banned", icon: <StopOutlined />, color: "red" },
    ];

    return statusOptions
      .filter((option) => option.key !== currentStatus)
      .map((option) => ({
        key: option.key,
        label: (
          <span style={{ color: option.color }}>
            {option.icon} {option.label}
          </span>
        ),
        // Add event handling to stop propagation
        onClick: (event) => {
          event.domEvent && event.domEvent.stopPropagation();
          onStatusChange(record.id, option.key);
        },
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
        // Add event handling to stop propagation
        onClick: (event) => {
          event.domEvent.stopPropagation();
          onView(record);
        },
      },
      {
        key: "edit",
        label: (
          <span>
            <EditOutlined /> Edit Publisher
          </span>
        ),
        // Add event handling to stop propagation
        onClick: (event) => {
          event.domEvent.stopPropagation();
          onEdit(record);
        },
      },
      statusSubmenu,
      {
        type: "divider",
      },
      {
        key: "delete",
        label: (
          <Popconfirm
            title="Are you sure you want to delete this publisher?"
            description="This action cannot be undone."
            // Stop propagation on confirm to be safe, though internal handling is main
            onConfirm={(e) => {
              e.stopPropagation();
              onDelete(record.id);
            }}
            onCancel={(e) => e.stopPropagation()}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            {/* Clicks on this span are handled by Popconfirm */}
            <span style={{ color: "red" }} onClick={(e) => e.stopPropagation()}>
              <DeleteOutlined /> Delete Publisher
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
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            style={{
              padding: "4px 8px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            // Stop the row's onClick from firing when the action button is clicked
            onClick={(e) => e.stopPropagation()}
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
        dataSource={publishers}
        loading={loading}
        scroll={{ x: 1800 }}
        // Add the onRow prop to make rows clickable
        onRow={(record) => {
          return {
            onClick: () => {
              onDetail(record); // Use the onDetail function passed from the parent
            },
            style: { cursor: "pointer" }, // Change cursor to indicate it's clickable
          };
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          className: "table-pagination",
        }}
        className="publisher-table"
        rowClassName={() => "publisher-row"}
        rowKey="id"
      />
    </div>
  );
};

export default PublisherTable;