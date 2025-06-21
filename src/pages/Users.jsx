// src/pages/Users.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Avatar,
  Tag,
  Card,
  Typography,
  Drawer,
  message,
  Row,
  Col,
  Dropdown,
  Tooltip,
  Switch,
  Modal,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  UserOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import apiClient from "../services/apiServices";
import AddUserForm from "../components/user/AddUserForm";
import "../styles/Users.scss";

const { Title, Text } = Typography;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/user/company-users");
      console.log("Fetched users response:", response);
      
      // Handle the API response structure based on your provided data
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
        console.warn("API response does not contain a valid users array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create/update user)
  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editMode && selectedUser) {
        // Update existing user
        const response = await apiClient.put(
          `/admin/user/${selectedUser.id}`,
          values
        );
        console.log("User updated response:", response);
        message.success("User updated successfully");
      } else {
        // Create new user
        const response = await apiClient.post(
          "/admin/user/createEmployee",
          values
        );
        console.log("User created response:", response);

        // Check if the response indicates success
        if (response.data && response.data.success) {
          message.success(response.data.message || "User created successfully");
        } else {
          message.success("User created successfully");
        }
      }

      handleCloseDrawer();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      const errorMessage =
        error.response?.data?.message ||
        `Failed to ${editMode ? "update" : "create"} user`;
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle drawer close
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedUser(null);
    setEditMode(false);
  };

  // Handle add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setEditMode(false);
    setDrawerVisible(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditMode(true);
    setDrawerVisible(true);
  };

  // Handle delete user
  const handleDeleteUser =  async(user) => {
  
    try {
     const res= await apiClient.delete(`/admin/user/${user.id}`);
     console.log("Delete user response:", res);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete user";
      message.error(errorMessage);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (user, newStatus) => {
    const userId = user.id;
    setStatusLoading((prev) => ({ ...prev, [userId]: true }));
    console.log(`Toggling status for user ${userId} to ${newStatus}`);

    try {
      const res = await apiClient.put(`/admin/user/${userId}/status`, {
        status: newStatus,
      });
      console.log("Status update response:", res);

      message.success(
        `User ${
          newStatus === "Active" ? "activated" : "deactivated"
        } successfully`
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update user status";
      message.error(errorMessage);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Handle view user details
  const handleViewUser = (user) => {
    const formatDate = (dateString) => {
      if (!dateString) return "Never";
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    Modal.info({
      title: 'User Details',
      width: 500,
      content: (
        <div className="user-details-modal">
          <div className="user-avatar-section">
            <Avatar size={64} icon={<UserOutlined />} className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </div>
          <div className="user-info-section">
            <div className="info-item">
              <span className="info-label">Name:</span> 
              <span className="info-value">{user.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span> 
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span> 
              <Tag color="blue">{user.role?.toUpperCase()}</Tag>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span> 
              <Tag color={user.status === 'Active' ? 'success' : 'default'}>
                {user.status?.toUpperCase()}
              </Tag>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span> 
              <span className="info-value">{formatDate(user.created_at)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Login:</span> 
              <span className="info-value">{formatDate(user.last_login)}</span>
            </div>
          </div>
        </div>
      ),
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.role &&
            typeof user.role === "string" &&
            user.role.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Create action menu for each user
  const getActionMenu = (record) => {
    const items = [
      {
        key: "view",
        label: (
          <Space>
            <EyeOutlined />
            View Details
          </Space>
        ),
        onClick: () => handleViewUser(record),
      },
      {
        key: "edit",
        label: (
          <Space>
            <EditOutlined />
            Edit User
          </Space>
        ),
        onClick: () => handleEditUser(record),
      },
      {
        key: "status",
        label: (
          <Space>
            <PoweroffOutlined />
            {record.status === "Active" ? "Deactivate" : "Activate"}
          </Space>
        ),
        onClick: () => {
          const newStatus = record.status === "Active" ? "Inactive" : "Active";
          handleStatusToggle(record, newStatus);
        },
      },
      {
        type: "divider",
      },
      {
        key: "delete",
        label: (
          <Space style={{ color: "#ff4d4f" }}>
            <DeleteOutlined />
            Delete User
          </Space>
        ),
        onClick: () => handleDeleteUser(record),
        danger: true,
      },
    ];

    return { items };
  };

  // Format date for table display
  const formatTableDate = (dateString) => {
    if (!dateString) return <Text type="secondary">Never</Text>;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 280,
      render: (text, record) => (
        <div className="user-info">
          <Avatar
            size={44}
            icon={<UserOutlined />}
            className="user-avatar-table"
          >
            {text?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="user-details">
            <div className="user-name">{text}</div>
            <Text type="secondary" className="user-email">
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role) => {
        const roleColors = {
          admin: "red",
          sub_admin: "blue",
          advertiser: "green",
          publisher: "cyan",
          manager: "orange",
          employee: "purple",
        };

        const roleString = role && typeof role === "string" ? role : "unknown";
        const roleLower = roleString.toLowerCase();

        return (
          <Tag color={roleColors[roleLower] || "default"} className="role-tag">
            {roleString.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status, record) => {
        const statusString = status && typeof status === "string" ? status : "Unknown";
        const isActive = statusString === "Active" || statusString === "active";

        return (
          <div className="status-column">
            <Tag 
              color={isActive ? "success" : "default"} 
              className="status-tag"
            >
              {statusString.toUpperCase()}
            </Tag>
            <Tooltip title={`${isActive ? "Deactivate" : "Activate"} user`}>
              <Switch
                size="small"
                checked={isActive}
                loading={statusLoading[record.id]}
                onChange={(checked) =>
                  handleStatusToggle(record, checked ? "Active" : "Inactive")
                }
                className="status-switch"
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date) => formatTableDate(date),
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      width: 140,
      render: (date) => formatTableDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={getActionMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="actions-button"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="users-page">
      <Card className="users-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="page-title">
              Users Management
            </Title>
            <Text type="secondary" className="page-subtitle">
              Manage all users in your system ({filteredUsers.length} total)
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="large"
              onClick={handleAddUser}
              className="add-user-button"
            >
              Add User
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="users-content-card">
        <div className="search-section">
          <Input
            placeholder="Search users by name, email, or role..."
            prefix={<SearchOutlined className="search-icon" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            allowClear
            className="search-input"
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
            className: "table-pagination",
          }}
          scroll={{ x: 1000 }}
          className="users-table"
          rowClassName="users-table-row"
        />
      </Card>

      {/* Add/Edit User Drawer */}
      <Drawer
        title={
          <div className="drawer-title">
            <UserOutlined />
            {editMode ? "Edit User" : "Add New User"}
          </div>
        }
        width={520}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose={true}
        maskClosable={false}
        className="user-drawer"
      >
        <AddUserForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          loading={submitting}
          initialValues={editMode ? selectedUser : {}}
          showAdditionalFields={true}
        />
      </Drawer>
    </div>
  );
};

export default Users;