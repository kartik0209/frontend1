// src/pages/CompanyTabsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Tabs,
  Typography,
  Alert,
  message,
  Modal,
  Card,
  Statistic,
  Row,
  Col,
  Space,
  Badge,
  Button,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import ApproveConfirmModal from '../components/ApproveConfirmModal';
import CompanyTable from '../components/CompanyTable';
import '../styles/CompanyTabsPage.scss';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

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

const CompanyTabsPage = () => {
  // Consolidated state
  const [state, setState] = useState({
    activeTab: 'pending',
    tabsData: {
      pending: { data: [], total: 0, loading: false, page: 1 },
      approved: { data: [], total: 0, loading: false, page: 1 },
      rejected: { data: [], total: 0, loading: false, page: 1 },
    },
    modal: {
      visible: false,
      companyId: null,
      companyName: '',
      loading: false,
    },
    error: null,
  });

  // Optimized API call with proper error handling
  const fetchCompaniesByStatus = useCallback(async (status, page = 1) => {
    setState(prev => ({
      ...prev,
      tabsData: {
        ...prev.tabsData,
        [status]: { ...prev.tabsData[status], loading: true },
      },
      error: null,
    }));

    try {
      const response = await apiClient.get(`/admin/company/list`, {
        params: { status, page, limit: PAGE_SIZE, order: 'DESC' },
      });

      const { data, success, totalCount = 0, message: apiMessage } = response.data;

      if (success && Array.isArray(data)) {
        setState(prev => ({
          ...prev,
          tabsData: {
            ...prev.tabsData,
            [status]: {
              data,
              total: totalCount,
              loading: false,
              page,
            },
          },
        }));
      } else {
        throw new Error(apiMessage || 'Invalid response format');
      }
    } catch (error) {
      console.error(`Error fetching ${status} companies:`, error);
      
      const errorMessage = error.response?.status === 404 
        ? 'API endpoint not found' 
        : error.message || 'Failed to load companies';

      setState(prev => ({
        ...prev,
        tabsData: {
          ...prev.tabsData,
          [status]: { ...prev.tabsData[status], loading: false },
        },
        error: errorMessage,
      }));

      message.error(errorMessage);
    }
  }, []);

  // Function to refresh data after company status change
  const refreshAfterStatusChange = useCallback(() => {
    // Refresh pending tab (always needed)
    fetchCompaniesByStatus('pending', 1);
    
    // Refresh approved tab if it has been loaded
    if (state.tabsData.approved.data.length > 0 || state.activeTab === 'approved') {
      fetchCompaniesByStatus('approved', 1);
    }
    
    // Refresh rejected tab if it has been loaded  
    if (state.tabsData.rejected.data.length > 0 || state.activeTab === 'rejected') {
      fetchCompaniesByStatus('rejected', 1);
    }
  }, [fetchCompaniesByStatus, state.tabsData, state.activeTab]);

  // Initial load
  useEffect(() => {
    fetchCompaniesByStatus('pending', 1);
  }, [fetchCompaniesByStatus]);

  // Tab change handler with lazy loading
  const handleTabChange = useCallback((key) => {
    setState(prev => ({ ...prev, activeTab: key }));
    
    // Lazy load data if not already loaded
    if (state.tabsData[key].data.length === 0 && !state.tabsData[key].loading) {
      fetchCompaniesByStatus(key, 1);
    }
  }, [state.tabsData, fetchCompaniesByStatus]);

  // Approval handlers
  const handleApproveClick = useCallback((companyId, companyName) => {
    setState(prev => ({
      ...prev,
      modal: {
        visible: true,
        companyId,
        companyName,
        loading: false,
      },
    }));
  }, []);

  const handleConfirmApprove = useCallback(async () => {
    const { companyId, companyName } = state.modal;
    
    setState(prev => ({
      ...prev,
      modal: { ...prev.modal, loading: true },
    }));

    try {
      const response = await apiClient.put(`/admin/company/approve/${companyId}`);
      
      if (response.data.success) {
        // Close modal first
        setState(prev => ({
          ...prev,
          modal: { visible: false, companyId: null, companyName: '', loading: false },
        }));

        // Refresh data immediately
        refreshAfterStatusChange();

        // Show success notification
        message.success({
          content: `"${companyName}" has been approved successfully!`,
          duration: 3,
          style: { marginTop: '20vh' },
        });

        // Optional: Show detailed success modal
        Modal.success({
          title: 'Company Approved Successfully',
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
          content: (
            <Space direction="vertical">
              <Text>
                <strong>"{companyName}"</strong> has been approved and can now access the system.
              </Text>
            </Space>
          ),
          centered: true,
          // Remove the onOk callback since we already refreshed data
        });
      } else {
        throw new Error(response.data.message || 'Approval failed');
      }
    } catch (error) {
      console.error('Error approving company:', error);
      message.error(error.message || 'Failed to approve company. Please try again.');
      
      setState(prev => ({
        ...prev,
        modal: { ...prev.modal, loading: false },
      }));
    }
  }, [state.modal, refreshAfterStatusChange]);

  const handleCancelApprove = useCallback(() => {
    setState(prev => ({
      ...prev,
      modal: { visible: false, companyId: null, companyName: '', loading: false },
    }));
  }, []);

  const handleReject = useCallback(async (companyId, companyName) => {
    Modal.confirm({
      title: 'Reject Company Registration',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <Text>
          Are you sure you want to reject <strong>"{companyName}"</strong>? 
          This action cannot be undone.
        </Text>
      ),
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          const response = await apiClient.put(`/admin/company/reject/${companyId}`);
          
          if (response.data.success) {
            // Refresh data immediately
            refreshAfterStatusChange();
            
            message.success(`"${companyName}" has been rejected successfully.`);
          } else {
            throw new Error(response.data.message || 'Rejection failed');
          }
        } catch (error) {
          console.error('Error rejecting company:', error);
          message.error('Failed to reject company. Please try again.');
        }
      },
    });
  }, [refreshAfterStatusChange]);

  // Pagination handler
  const handlePageChange = useCallback((newPage, status) => {
    fetchCompaniesByStatus(status || state.activeTab, newPage);
  }, [state.activeTab, fetchCompaniesByStatus]);

  // Statistics for dashboard cards
  const statistics = useMemo(() => {
    return Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      key,
      title: config.label,
      value: state.tabsData[key].total,
      color: config.color,
      icon: config.icon,
    }));
  }, [state.tabsData]);

  return (
    <div className="company-tabs-page">
      {/* Enhanced Header with Statistics */}
      <Card className="company-tabs-page__header-card" bordered={false}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={0}>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                Company Management
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                Manage admin registration requests and company approvals
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={16}>
              {statistics.map(({ key, title, value, color, icon }) => (
                <Col span={8} key={key}>
                  <Card size="small" className="stat-card">
                    <Statistic
                      title={title}
                      value={value}
                      valueStyle={{ color, fontSize: '20px', fontWeight: 'bold' }}
                      prefix={icon}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Enhanced Tabs Container */}
      <Card className="company-tabs-page__content-card" bordered={false}>
        <Tabs 
          activeKey={state.activeTab} 
          onChange={handleTabChange}
          size="large"
          tabBarStyle={{ marginBottom: '24px' }}
        >
          {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => {
            const { data, total, loading, page } = state.tabsData[statusKey];

            return (
              <TabPane 
                tab={
                  <Space>
                    {config.icon}
                    <span>{config.label}</span>
                    <Badge 
                      count={total} 
                      style={{ backgroundColor: config.color }}
                      overflowCount={999}
                    />
                  </Space>
                } 
                key={statusKey}
              >
                {state.error ? (
                  <Alert
                    type="error"
                    message="Failed to Load Data"
                    description={state.error}
                    showIcon
                    action={
                      <Button 
                        size="small" 
                        type="primary"
                        onClick={() => fetchCompaniesByStatus(statusKey, page)}
                      >
                        Retry
                      </Button>
                    }
                  />
                ) : (
                  <CompanyTable
                    data={data}
                    total={total}
                    currentPage={page}
                    status={statusKey}
                    loading={loading}
                    onPageChange={(newPage) => handlePageChange(newPage, statusKey)}
                    onApprove={handleApproveClick}
                    onReject={handleReject}
                  />
                )}
              </TabPane>
            );
          })}
        </Tabs>
      </Card>

      {/* Enhanced Confirmation Modal */}
      <ApproveConfirmModal
        open={state.modal.visible}
        companyName={state.modal.companyName}
        onConfirm={handleConfirmApprove}
        onCancel={handleCancelApprove}
        loading={state.modal.loading}
      />
    </div>
  );
};

export default CompanyTabsPage;