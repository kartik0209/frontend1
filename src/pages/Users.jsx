import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../store/usersSlice";
import { debounce } from "../utils/helpers";
import AddUserForm from "../components/user/AddUserForm";
import UserViewModal from "../components/user/UserViewModal";
import SuccessModal from "../components/model/SuccessModal";
import FailModal from "../components/model/FailModal";
import ConfirmModal from "../components/model/ConfirmModal";
import "../styles/Users.scss";

const { Title, Text } = Typography;

const Users = () => {
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});

  // Modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUserForView, setSelectedUserForView] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState({});
  const [failModalOpen, setFailModalOpen] = useState(false);
  const [failModalData, setFailModalData] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Handle form submission (create/update user)
  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editMode && selectedUser) {
        await dispatch(
          updateUser({ id: selectedUser.id, values })
        ).unwrap();

        setSuccessModalData({
          title: "User Updated Successfully",
          message: `${values.name || selectedUser.name
            } has been updated successfully.`,
        });
      } else {
        await dispatch(createUser(values)).unwrap();

        setSuccessModalData({
          title: "User Created Successfully",
          message: `${values.name} has been added to the system successfully.`,
        });
      }

      setSuccessModalOpen(true);
      handleCloseDrawer();
    } catch (error) {
      console.error("Error saving user:", error);
      setFailModalData({
        title: `Failed to ${editMode ? "Update" : "Create"} User`,
        message:
          error.response?.data?.message ||
          `Unable to ${editMode ? "update" : "create"} user. Please try again.`,
      });
      setFailModalOpen(true);
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

  // Handle view user - Updated to use modal
  const handleViewUser = (user) => {
    setSelectedUserForView(user);
    setViewModalVisible(true);
  };

  // Handle delete user - Updated to use confirm modal
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setConfirmModalOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();

      setSuccessModalData({
        title: "User Deleted Successfully",
        message: `${userToDelete.name} has been removed from the system.`,
      });
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setFailModalData({
        title: "Failed to Delete User",
        message:
          error.response?.data?.message ||
          "Unable to delete user. Please try again.",
      });
      setFailModalOpen(true);
    } finally {
      setConfirmModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (user, newStatus) => {
    const userId = user.id;
    setStatusLoading((prev) => ({ ...prev, [userId]: true }));
    console.log(`Toggling status for user ${userId} to ${newStatus}`);

    try {
      await dispatch(
        updateUserStatus({ id: userId, status: newStatus })
      ).unwrap();

      setSuccessModalData({
        title: "Status Updated Successfully",
        message: `${user.name} has been ${newStatus === "Active" ? "activated" : "deactivated"
          } successfully.`,
      });
      setSuccessModalOpen(true);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
      setFailModalData({
        title: "Failed to Update Status",
        message:
          error.response?.data?.message ||
          "Unable to update user status. Please try again.",
      });
      setFailModalOpen(true);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [filteredUsers, setFilteredUsers] = useState([]);

  const doUserSearch = (value, list) => {
    if (!value.trim()) {
      setFilteredUsers(list || []);
      return;
    }

    const searchValue = value.toLowerCase();
    const result = Array.isArray(list)
      ? list.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(searchValue)) ||
          (user.email &&
            user.email.toLowerCase().includes(searchValue)) ||
          (user.role &&
            typeof user.role === "string" &&
            user.role.toLowerCase().includes(searchValue))
      )
      : [];

    setFilteredUsers(result);
  };

  const debouncedUserSearch = useMemo(
    () =>
      debounce((value, list) => {
        doUserSearch(value, list);
      }, 400),
    []
  );

  useEffect(() => {
    setFilteredUsers(users || []);
  }, [users]);

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
        const statusString =
          status && typeof status === "string" ? status : "Unknown";
        const isActive = statusString === "Active" || statusString === "active";

        return (
          <div className="status-column">
            <Tag
              color={isActive ? "success" : "default"}
              className="status-tag"
            >
              {statusString.toUpperCase()}
            </Tag>
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
      <Card className="users-content-card">
        {/* Search + Add User in one row */}
        <Row
          justify="space-between"
          align="middle"
          gutter={[16, 16]} // spacing between columns
          className="search-add-row"
        >
          <Col xs={24} sm={18} md={18} lg={14} xl={18}>
            <Input
              placeholder="Search users by name, email, or role..."
              prefix={<SearchOutlined className="search-icon" />}
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                debouncedUserSearch(value, users);
              }}
              size="large"
              allowClear
              className="search-input"

            />
          </Col>

          <Col xs={24} sm={6} md={6} lg={6} xl={6} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="large"
              onClick={handleAddUser}
              className="add-user-button"
              block={window.innerWidth < 576} // makes full width on small screens
            >
              Add User
            </Button>
          </Col>
        </Row>

        {/* Users Table */}
        <div className="table-wrapper" style={{ marginTop: "20px" }}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
            }}
            scroll={{ x: "max-content" }}
            className="users-table"
            rowClassName="users-table-row"
          />
        </div>
      </Card>

      {/* Add/Edit Drawer */}
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
        destroyOnClose
        maskClosable={false}
        className="user-drawer"
      >
        <AddUserForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          loading={submitting}
          initialValues={editMode ? selectedUser : {}}
          showAdditionalFields
        />
      </Drawer>

      {/* View, Success, Fail, and Confirm Modals */}
      <UserViewModal
        visible={viewModalVisible}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedUserForView(null);
        }}
        userData={selectedUserForView}
      />

      <SuccessModal
        open={successModalOpen}
        title={successModalData.title}
        message={successModalData.message}
        onClose={() => setSuccessModalOpen(false)}
        autoClose
        autoCloseDelay={4000}
      />

      <FailModal
        open={failModalOpen}
        title={failModalData.title}
        message={failModalData.message}
        onOk={() => setFailModalOpen(false)}
        showCancel={false}
      />

      <ConfirmModal
        open={confirmModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone and will remove all associated data.`}
        onConfirm={confirmDeleteUser}
        onCancel={() => {
          setConfirmModalOpen(false);
          setUserToDelete(null);
        }}
        confirmText="Delete User"
        cancelText="Cancel"
        danger
      />
    </div>

  );
};

export default Users;
