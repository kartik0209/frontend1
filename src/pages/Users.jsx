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
  Modal,
} from "antd";
import {
  SearchOutlined,
  UserAddOutlined,
  EditOutlined,
  UserOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import apiClient from "../services/apiServices";
import AddUserForm from "../components/AddUserForm";
import "../styles/Users.scss";

const { Title, Text } = Typography;
const { confirm } = Modal;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/admin/company/company-users");
      // Ensure we always set an array
      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
      } else if (userData && Array.isArray(userData.users)) {
        setUsers(userData.users);
      } else if (userData && Array.isArray(userData.data)) {
        setUsers(userData.data);
      } else {
        setUsers([]);
        console.warn(
          "API response does not contain a valid users array:",
          userData
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
      setUsers([]); // Set empty array on error
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
          `/admin/company/users/${selectedUser.id}`,
          values
        );
        message.success("User updated successfully");
      } else {
        // Create new user
        const response = await apiClient.post(
          "/admin/company/createEmployee",
          values
        );
        message.success("User created successfully");
      }

      handleCloseDrawer();
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error saving user:", error);
      message.error(`Failed to ${editMode ? "update" : "create"} user`);
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
  const handleDeleteUser = (user) => {
    confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await apiClient.delete(`/admin/company/users/${user.id}`);
          message.success("User deleted successfully");
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Failed to delete user");
        }
      },
    });
  };

  // Handle view user details
  const handleViewUser = (user) => {
    Modal.info({
      title: "User Details",
      width: 600,
      content: (
        <div style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <strong>Name:</strong>
            </Col>
            <Col span={16}>{user.name}</Col>

            <Col span={8}>
              <strong>Email:</strong>
            </Col>
            <Col span={16}>{user.email}</Col>

            <Col span={8}>
              <strong>Role:</strong>
            </Col>
            <Col span={16}>
              <Tag color="blue">{user.role?.toUpperCase()}</Tag>
            </Col>

            <Col span={8}>
              <strong>Status:</strong>
            </Col>
            <Col span={16}>
              <Tag color={user.status === "active" ? "success" : "default"}>
                {user.status?.toUpperCase()}
              </Tag>
            </Col>

            <Col span={8}>
              <strong>Department:</strong>
            </Col>
            <Col span={16}>{user.department || "N/A"}</Col>

            <Col span={8}>
              <strong>Phone:</strong>
            </Col>
            <Col span={16}>{user.phone || "N/A"}</Col>

            <Col span={8}>
              <strong>Join Date:</strong>
            </Col>
            <Col span={16}>
              {user.joinDate
                ? new Date(user.joinDate).toLocaleDateString()
                : "N/A"}
            </Col>
          </Row>
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
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Table columns configuration
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="user-info">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff", marginRight: 12 }}
          >
            {text?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div>
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
      render: (role) => {
        const roleColors = {
          admin: "red",
          sub_admin: "blue",
          advertiser: "green",
          publisher: "cyan",
          manager: "orange",
          employee: "purple",
        };
        return (
          <Tag color={roleColors[role?.toLowerCase()] || "default"}>
            {role?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => department || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusColors = {
          active: "success",
          inactive: "default",
          pending: "warning",
          suspended: "error",
        };
        return (
          <Tag color={statusColors[status?.toLowerCase()] || "default"}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record)}
            className="action-btn view"
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            className="action-btn edit"
            title="Edit User"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
            className="action-btn delete"
            danger
            title="Delete User"
          />
        </Space>
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
              className="add-user-btn"
            >
              Add User
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="users-content-card">
        <div className="users-toolbar">
          <Input
            placeholder="Search users by name, email, or department..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            size="large"
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          className="users-table"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add/Edit User Drawer */}
      <Drawer
        title={editMode ? "Edit User" : "Add New User"}
        width={500}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose={true}
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
