import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Spin,
  Alert,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Card,
  Descriptions,
  Tag,
  Avatar,
  message,
  Empty,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  LinkOutlined,
  PlusOutlined,
  BankOutlined,
  SettingOutlined,
  TeamOutlined,
  GlobalOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;
const { Option } = Select;

const PublisherDetailsPage = () => {
  const { id } = useParams();
  const pageContentRef = useRef(null);
  
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const primaryColor = '#0a1a4e';

  useEffect(() => {
    const fetchPublisherDetails = async () => {
      if (!id) {
        setError("No publisher ID provided.");
        setLoading(false);
        return;
      };
      
      setLoading(true);
      setError(null);
      
      try {
        // The full response object (e.g., from Axios) is returned here.
        const response = await apiClient.get(`/common/publisher/${id}`);
        // The actual API payload is in the 'data' property.
        const responseData = response.data;

        if (responseData && responseData.success) {
          // The publisher object is in the 'data' property of our API payload.
          setPublisher(responseData.data);
        } else {
          // The error message is in the 'message' property of our API payload.
          throw new Error(responseData.message || "Publisher not found.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching publisher details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublisherDetails();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'green', 'Pending': 'orange', 'Inactive': 'default',
      'Suspended': 'purple', 'Disabled': 'red', 'Rejected': 'red', 'Banned': 'red'
    };
    return statusColors[status] || 'default';
  };

  const handleClone = () => message.success('Publisher cloned successfully');
  const handleActivate = () => message.success('Publisher activated successfully');

  const showEditModal = () => {
    setEditingPublisher({ ...publisher });
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingPublisher) return;
    setUpdateLoading(true);
    try {
      const body = { ...editingPublisher, tags: editingPublisher.tags?.split(',').map(tag => tag.trim()) };
      const response = await apiClient.put(`/common/publisher/${id}`, body);
      if (response.success) {
        message.success(response.message);
        setPublisher(editingPublisher);
        setIsModalVisible(false);
      } else {
        throw new Error(response.message || 'Failed to update publisher.');
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPublisher(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setEditingPublisher(prev => ({ ...prev, status: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditingPublisher(prev => ({...prev, [name]: checked}));
  };
  
  const handleDownloadPDF = () => {
    const input = pageContentRef.current;
    html2canvas(input, { scale: 2 }) // Increase scale for better quality
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        // Check if content exceeds page height, and add new pages if necessary
        let position = 0;
        if (height > pdfHeight) {
            let remainingHeight = canvasHeight;
            while(remainingHeight > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, width, 0);
                remainingHeight -= pdfHeight * (canvasWidth / width);
                if (remainingHeight > 0) {
                    pdf.addPage();
                    position = -pdfHeight * (canvasWidth / width) * (pdf.internal.getNumberOfPages() - 1);
                }
            }
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        }
        
        pdf.save(`publisher-details-${publisher.id}.pdf`);
        message.success("PDF downloaded successfully!");
      })
      .catch(err => {
        message.error("Failed to download PDF.");
        console.error(err);
      });
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" tip="Loading Publisher Details..." /></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '24px' }} />;
  if (!publisher) return <Alert message="No publisher data available." type="warning" showIcon style={{ margin: '24px' }} />;

  return (
    <>
      <div style={{ padding: "24px", background: "#f0f2f5", minHeight: '100vh' }} ref={pageContentRef}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Space align="center" size="large">
              <Link to="/publishers" style={{ color: 'rgba(0,0,0,.85)' }}><ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer' }} /></Link>
              <Title level={4} style={{ marginBottom: 0 }}>Publishers &gt; ID: {publisher.id}</Title>
            </Space>
          </Col>
          <Col>
            <Button style={{backgroundColor: primaryColor, color: 'white'}} icon={<DownloadOutlined />} onClick={handleDownloadPDF}>Download PDF</Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card bordered={false} style={{ height: '100%' }} bodyStyle={{ padding: 0 }}>
              <div style={{ background: 'linear-gradient(135deg, #050a2c, #0a1a4e)', padding: '24px', display: 'flex', alignItems: 'center', borderRadius: '8px 8px 0 0' }}>
                <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: '24px',background:"transparent" }} />
                <div style={{ flex: 1 }}><Title level={4} style={{ color: 'white', margin: 0 }}>{publisher.name}</Title></div>
                {/* <Space>
                  <Button type="default" icon={<CopyOutlined />} onClick={handleClone}>Clone</Button>
                  <Button type="default" icon={<CheckCircleOutlined />} onClick={handleActivate}>Active</Button>
                  <Button type="default" icon={<EditOutlined />} onClick={showEditModal}>Edit</Button>
                </Space> */}
              </div>
              <div style={{ padding: '24px' }}>
                <Descriptions column={1} bordered size="small" labelStyle={{ width: '35%' }}>
                    <Descriptions.Item label="ID">{publisher.id}</Descriptions.Item>
                    <Descriptions.Item label="Email"><a href={`mailto:${publisher.email}`}>{publisher.email}</a></Descriptions.Item>
                    <Descriptions.Item label="Phone">{publisher.phone}</Descriptions.Item>
                    <Descriptions.Item label="Company">{publisher.company}</Descriptions.Item>
                    <Descriptions.Item label="Status"><Tag color={getStatusColor(publisher.status)} style={{ fontWeight: 'bold' }}>{publisher.status?.toUpperCase()}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Created">{new Date(publisher.created_at).toLocaleString('en-US')}</Descriptions.Item>
                    <Descriptions.Item label="Hash ID"><Text code copyable={{ text: publisher.hash_id }}>{publisher.hash_id}</Text></Descriptions.Item>
                    <Descriptions.Item label="Company Name">{publisher.companyName}</Descriptions.Item>
                    <Descriptions.Item label="Company Address">{publisher.companyAddress}</Descriptions.Item>
                    <Descriptions.Item label="Entity Type"><Tag color="blue">{publisher.entity_type}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Country">{publisher.country}</Descriptions.Item>
                    <Descriptions.Item label="City">{publisher.city}</Descriptions.Item>
                    <Descriptions.Item label="Region/State">{publisher.state}</Descriptions.Item>
                    <Descriptions.Item label="Zip Code">{publisher.zip_code}</Descriptions.Item>
                    <Descriptions.Item label="IM Type">{publisher.im_type}</Descriptions.Item>
                    <Descriptions.Item label="IM Username"><Text code>{publisher.im_username}</Text></Descriptions.Item>
                    <Descriptions.Item label="Promotion Method">{publisher.promotion_method}</Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Tracking Link" bordered={false} headStyle={{ backgroundColor: '#fafafa' }} extra={<Space><Button style={{backgroundColor: "transparent", color: 'black', border:"none"}} icon={<BarChartOutlined />}>Performance Report</Button><Button style={{backgroundColor: "transparent", color: 'black', border:"none"}} icon={<LinkOutlined />}>Manage Links</Button></Space>}><div style={{ padding: '20px 0' }}><Text type="secondary">Enable the Publisher to Generate its Tracking Link</Text></div></Card>
              <Card title="Settings" bordered={false} headStyle={{ backgroundColor: '#fafafa' }} extra={<Button style={{backgroundColor: "transparent", color: 'black', border:"none"}} icon={<EditOutlined />} onClick={showEditModal}>Edit</Button>}><Row gutter={[16, 16]}><Col span={24}><Text type="secondary">Currency: {publisher.currency} | Email Notifications: {publisher.notify ? 'Yes' : 'No'} | Locale: {publisher.locale}</Text></Col></Row><Divider /><Row><Col span={24}><div><Text type="secondary" style={{ fontSize: '12px' }}>BANK:</Text><div><Button type="link" icon={<BankOutlined />} style={{ padding: 0, fontWeight: 'bold' }}>Details</Button></div></div></Col></Row></Card>
              <Card title="Account Users" bordered={false} headStyle={{ backgroundColor: '#fafafa' }} extra={<Button style={{backgroundColor: "transparent", color: 'black', border:"none"}} icon={<PlusOutlined />} size="small">Add</Button>}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No Subaccounts created for the Publisher</Text>} /></Card>
              <Card title="Private Tracking Domain" bordered={false} headStyle={{ backgroundColor: '#fafafa' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary">No private tracking domain found</Text>} /></Card>
            </Space>
          </Col>
        </Row>
      </div>

      {editingPublisher && (
        <Modal
          title="Edit Publisher"
          visible={isModalVisible}
          onOk={handleUpdate}
          onCancel={handleCancel}
          confirmLoading={updateLoading}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>Cancel</Button>,
            <Button key="submit" type="primary" loading={updateLoading} onClick={handleUpdate} style={{backgroundColor: primaryColor}}>Update</Button>,
          ]}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}><Form.Item label="Name"><Input name="name" value={editingPublisher.name} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Username"><Input name="username" value={editingPublisher.username} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Email"><Input name="email" value={editingPublisher.email} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Password"><Input.Password name="password" placeholder="Leave blank to keep unchanged" onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Status"><Select name="status" value={editingPublisher.status} onChange={handleSelectChange}><Option value="Active">Active</Option><Option value="Pending">Pending</Option><Option value="Disabled">Disabled</Option><Option value="Rejected">Rejected</Option><Option value="Banned">Banned</Option></Select></Form.Item></Col>
              <Col span={12}><Form.Item label="Phone"><Input name="phone" value={editingPublisher.phone} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Company Name"><Input name="companyName" value={editingPublisher.companyName} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Company Address"><Input name="companyAddress" value={editingPublisher.companyAddress} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="Country"><Input name="country" value={editingPublisher.country} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="State/Region"><Input name="state" value={editingPublisher.state} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="City"><Input name="city" value={editingPublisher.city} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="Zip Code"><Input name="zip_code" value={editingPublisher.zip_code} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="Entity Type"><Input name="entity_type" value={editingPublisher.entity_type} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={8}><Form.Item label="Currency"><Input name="currency" value={editingPublisher.currency} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="IM Type"><Input name="im_type" value={editingPublisher.im_type} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="IM Username"><Input name="im_username" value={editingPublisher.im_username} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Promotion Method"><Input name="promotion_method" value={editingPublisher.promotion_method} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={12}><Form.Item label="Tags (comma-separated)"><Input name="tags" value={Array.isArray(editingPublisher.tags) ? editingPublisher.tags.join(', ') : editingPublisher.tags} onChange={handleInputChange} /></Form.Item></Col>
              <Col span={24}><Form.Item><Checkbox name="notify" checked={editingPublisher.notify} onChange={handleCheckboxChange}>Email Notifications</Checkbox></Form.Item></Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default PublisherDetailsPage;
