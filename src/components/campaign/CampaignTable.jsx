import React from "react";
import { Table, Button, Popconfirm, Dropdown, Menu } from "antd";
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
  SwapOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

const CampaignTable = ({ 
  campaigns, 
  columns, 
  loading, 
  rowSelection,
  onEdit,
  onDetail,
  onDelete,
  onView,
  onStatusChange,
}) => {
  const getStatusMenuItems = (record) => {
    const currentStatus = record.status;
    const statusOptions = [
      {
        key: "Active",
        label: "Active",
        icon: <CheckCircleOutlined />,
        color: "green",
      },
      {
        key: "Paused",
        label: "Paused",
        icon: <PauseCircleOutlined />,
        color: "orange",
      },
      {
        key: "Expired",
        label: "Expired",
        icon: <ExclamationCircleOutlined />,
        color: "gray",
      },
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
      onClick: (event) => {
  event.domEvent.stopPropagation();
  console.log("VIEW RECORD:", record);
  onView(record); 
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
            title="Are you sure you want to delete this campaign?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <span style={{ color: "red" }}>
              <DeleteOutlined /> Delete Campaign
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
              borderRadius: "6px"
            }}
            onClick={e => e.stopPropagation()}
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
        dataSource={campaigns}
        loading={loading}
        scroll={{ x: 1800 }}
          onRow={(record) => {
          return {
            onClick: () => {
              onDetail(record); // Use the onView function passed from the parent
            },
            style: { cursor: "pointer" , fontSize:"12px"}, // Change cursor to indicate it's clickable
          };
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          className: "table-pagination",
          
        }}
        className="campaign-table"
        rowClassName={() => "campaign-row"}
        rowKey="id"
      />
    </div>
  );
};

export default CampaignTable;