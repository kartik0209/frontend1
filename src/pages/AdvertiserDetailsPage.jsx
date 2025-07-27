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
  Radio,

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
  KeyOutlined,
  DeleteOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import apiClient from '../services/apiServices';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea: AntTextArea } = Input;

const AdvertiserDetailsPage = () => {
  const { TextArea } = Input;
  const { id } = useParams();
  const pageContentRef = useRef(null);
  
  const [advertiser, setAdvertiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAdvertiser, setEditingAdvertiser] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [postbackUrl, setPostbackUrl] = useState('');
  const [validationText, setValidationText] = useState('');
  const [pixelType, setPixelType] = useState('image');
  const [pixelCode, setPixelCode] = useState('');
  const [pixelAppendField, setPixelAppendField] = useState('');
  const [pixelAppendValue, setPixelAppendValue] = useState('');

  const primaryColor = '#0a1a4e';

  useEffect(() => {
    const fetchAdvertiserDetails = async () => {
      if (!id) {
        setError("No advertiser ID provided.");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get(`/common/advertiser/${id}`);
        const responseData = response.data;

        if (responseData && responseData.success) {
          setAdvertiser(responseData.data);
          // Initialize form fields with existing data
          setPostbackUrl(responseData.data.postback_url || '');
          setValidationText(responseData.data.validation || '');
          setPixelCode(responseData.data.pixel_code || '');
        } else {
          throw new Error(responseData.message || "Advertiser not found.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching advertiser details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdvertiserDetails();
  }, [id]);

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'green', 'Pending': 'orange', 'Inactive': 'default',
      'Suspended': 'purple', 'Disabled': 'red', 'Rejected': 'red', 'Banned': 'red'
    };
    return statusColors[status] || 'default';
  };

  const handleClone = () => message.success('Advertiser cloned successfully');
  const handleActivate = () => message.success('Advertiser activated successfully');

  const showEditModal = () => {
    setEditingAdvertiser({ ...advertiser });
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingAdvertiser) return;
    setUpdateLoading(true);
    try {
      const body = { 
        ...editingAdvertiser, 
        tags: editingAdvertiser.tags?.split(',').map(tag => tag.trim()) 
      };
      const response = await apiClient.put(`/common/advertiser/${id}`, body);
      if (response.data.success) {
        message.success('Advertiser updated successfully');
        setAdvertiser(editingAdvertiser);
        setIsModalVisible(false);
      } else {
        throw new Error(response.data.message || 'Failed to update advertiser.');
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
    setEditingAdvertiser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value) => {
    setEditingAdvertiser(prev => ({ ...prev, status: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditingAdvertiser(prev => ({...prev, [name]: checked}));
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await apiClient.post(`/common/advertiser/${id}/generate-api-key`);
      if (response.data.success) {
        message.success('API Key generated successfully');
        setAdvertiser(prev => ({ ...prev, api_key: response.data.api_key }));
      }
    } catch (err) {
      message.error('Failed to generate API key');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      const response = await apiClient.post(`/common/advertiser/${id}/notes`, {
        note: noteText
      });
      if (response.data.success) {
        message.success('Note added successfully');
        setNoteText('');
        // Refresh advertiser data to get updated notes
      }
    } catch (err) {
      message.error('Failed to add note');
    }
  };

  const handleValidatePostback = () => {
    if (!postbackUrl.trim()) {
      message.warning('Please enter a postback URL');
      return;
    }
    message.success('Postback validation initiated');
  };

  const handleAddPixelAppend = () => {
    if (!pixelAppendField.trim() || !pixelAppendValue.trim()) {
      message.warning('Please enter both field name and value');
      return;
    }
    message.success('Pixel parameter added successfully');
    setPixelAppendField('');
    setPixelAppendValue('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  };
  
  const handleDownloadPDF = () => {
    const input = pageContentRef.current;
    html2canvas(input, { scale: 2 })
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
        
        pdf.save(`advertiser-details-${advertiser.id}.pdf`);
        message.success("PDF downloaded successfully!");
      })
      .catch(err => {
        message.error("Failed to download PDF.");
        console.error(err);
      });
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" tip="Loading Advertiser Details..." /></div>;
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ margin: '24px' }} />;
  if (!advertiser) return <Alert message="No advertiser data available." type="warning" showIcon style={{ margin: '24px' }} />;

  return (
    <>
      <div style={{ padding: "24px", background: "#f0f2f5", minHeight: '100vh' }} ref={pageContentRef}>
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Space align="center" size="large">
              <Link to="/advertisers" style={{ color: 'rgba(0,0,0,.85)' }}>
                <ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
              </Link>
              <Title level={4} style={{ marginBottom: 0 }}>
                Advertisers &gt; {advertiser.id}
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
                icon={<DownloadOutlined />} 
                onClick={handleDownloadPDF}
              >
                Download PDF
              </Button>
              <Button style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} icon={<EditOutlined />} onClick={showEditModal}>
                Actions
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Main Info Card */}
              <Card bordered={false} style={{ height: '100%' }} bodyStyle={{ padding: 0 }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #050a2c, #0a1a4e)', 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  borderRadius: '8px 8px 0 0' 
                }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                  <div style={{ flex: 1 }}>
                    <Title level={4} style={{ color: 'white', margin: 0 }}>
                      {advertiser.full_name || advertiser.name}
                    </Title>
                  </div>
                  <Space>
                    <Button 
                      style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} 
                      icon={<CopyOutlined />} 
                      onClick={handleClone}
                    >
                      Clone
                    </Button>
                    <Button 
                      style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} 
                      icon={<CheckCircleOutlined />} 
                      onClick={handleActivate}
                    >
                      Active
                    </Button>
                    <Button 
                      style={{backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} 
                      icon={<EditOutlined />} 
                      onClick={showEditModal}
                    >
                      Edit
                    </Button>
                  </Space>
                </div>
                <div style={{ padding: '24px' }}>
                  <Descriptions column={1} bordered size="small" labelStyle={{ width: '35%' }}>
                    <Descriptions.Item label="ID">{advertiser.id}</Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <a href={`mailto:${advertiser.email}`}>{advertiser.email}</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">{advertiser.phone || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Company">{advertiser.company || advertiser.company_name || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(advertiser.status)} style={{ fontWeight: 'bold' }}>
                        {advertiser.status?.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created">
                      {new Date(advertiser.created_at).toLocaleString('en-US')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Hash ID">
                      <Text code copyable={{ text: advertiser.hash_id }}>
                        {advertiser.hash_id || advertiser.reference_id || 'N/A'}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Entity Type">
                      <Tag color="blue">{advertiser.entity_type || 'N/A'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Country">{advertiser.country || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="City">{advertiser.city || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Website URL">
                      {advertiser.website_url ? (
                        <a href={advertiser.website_url} target="_blank" rel="noopener noreferrer">
                          {advertiser.website_url}
                        </a>
                      ) : 'N/A'}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Card>

              {/* API Key Generation Card */}
              <Card 
                title="Generate API Key" 
                bordered={false} 
                headStyle={{ backgroundColor: '#fafafa' }}
                extra={<Text type="secondary">You're ready to start developing with Tracker Advertiser API</Text>}
              >
                <div style={{ padding: '20px 0' }}>
                  {advertiser.api_key ? (
                    <div>
                      <Text type="secondary">API Key:</Text>
                      <div style={{ marginTop: '8px' }}>
                        <Text code copyable={{ text: advertiser.api_key }}>
                          {advertiser.api_key}
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Text type="secondary">API key for this advertiser is not generated</Text>
                      <div style={{ marginTop: '16px' }}>
                        <Button 
                          style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
                          icon={<KeyOutlined />} 
                          onClick={handleGenerateApiKey}
                        >
                          Generate API Key
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Notes Card */}
              <Card title="Notes" bordered={false} headStyle={{ backgroundColor: '#fafafa' }}>
                <div style={{ marginBottom: '16px' }}>
                  <TextArea
                    rows={4}
                    placeholder="Enter note message"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                </div>
                <Button 
                  style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
                  onClick={handleAddNote}
                >
                  Add note
                </Button>
              </Card>
            </Space>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Settings Card */}
              <Card 
                title="Settings" 
                bordered={false} 
                headStyle={{ backgroundColor: '#fafafa' }}
                extra={<Button style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} icon={<EditOutlined />} onClick={showEditModal}>Edit</Button>}
              >
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">
                      Email Notifications: {advertiser.notify ? 'Enabled' : 'Disabled'} | 
                      Redirect Type: {advertiser.redirect_type || 'Default'} | 
                      Currency: {advertiser.currency || 'USD'}
                    </Text>
                  </Col>
                </Row>
              </Card>

              {/* Advertiser PostBack Card */}
              <Card 
                title="Advertiser PostBack" 
                bordered={false} 
                headStyle={{ backgroundColor: '#fafafa' }}
                extra={<Button type="link" style={{ color: primaryColor }}>Debug Postback</Button>}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Security Token:</Text>
                  <Text code style={{ marginLeft: '8px' }}>
                    {advertiser.security_token || 'aeff036d2a33869d3'}
                  </Text>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <TextArea
                    rows={3}
                    placeholder="Enter postback URL"
                    value={postbackUrl}
                    onChange={(e) => setPostbackUrl(e.target.value)}
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Validation</Text>
                  <TextArea
                    rows={4}
                    placeholder="Enter validation parameters"
                    value={validationText}
                    onChange={(e) => setValidationText(e.target.value)}
                  />
                </div>
                <Button 
                  style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
                  onClick={handleValidatePostback}
                >
                  Validate
                </Button>
              </Card>

              {/* Global Pixel Card */}
              <Card 
                title="Global Pixel" 
                bordered={false} 
                headStyle={{ backgroundColor: '#fafafa' }}
                extra={<Button type="link" style={{ color: primaryColor }}>Pixel Logs</Button>}
              >
                <div style={{ marginBottom: '16px' }}>
                  <Radio.Group 
                    value={pixelType} 
                    onChange={(e) => setPixelType(e.target.value)}
                    style={{ marginBottom: '16px' }}
                  >
                    <Radio.Button value="image">Image</Radio.Button>
                    <Radio.Button value="iframe">Iframe</Radio.Button>
                  </Radio.Group>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <TextArea
                    rows={3}
                    value={pixelCode}
                    onChange={(e) => setPixelCode(e.target.value)}
                    placeholder="<img src='https://example.com/pixel' />"
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    Append to Global Pixel
                  </Text>
                  <Row gutter={8}>
                    <Col span={10}>
                      <Input
                        placeholder="Field name (e.g., av)"
                        value={pixelAppendField}
                        onChange={(e) => setPixelAppendField(e.target.value)}
                      />
                    </Col>
                    <Col span={10}>
                      <Input
                        placeholder="Value"
                        value={pixelAppendValue}
                        onChange={(e) => setPixelAppendValue(e.target.value)}
                      />
                    </Col>
                    <Col span={4}>
                      <Button 
                        style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
                        icon={<PlusOutlined />} 
                        onClick={handleAddPixelAppend}
                      />
                    </Col>
                  </Row>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Edit Modal */}
      {editingAdvertiser && (
        <Modal
          title="Edit Advertiser"
          visible={isModalVisible}
          onOk={handleUpdate}
          onCancel={handleCancel}
          confirmLoading={updateLoading}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>Cancel</Button>,
            <Button 
              key="submit" 
              style={{backgroundColor: primaryColor, color: 'white', border: 'none'}} 
              loading={updateLoading} 
              onClick={handleUpdate}
            >
              Update
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Full Name">
                  <Input 
                    name="full_name" 
                    value={editingAdvertiser.full_name} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  <Input 
                    name="email" 
                    value={editingAdvertiser.email} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone">
                  <Input 
                    name="phone" 
                    value={editingAdvertiser.phone} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Status">
                  <Select 
                    name="status" 
                    value={editingAdvertiser.status} 
                    onChange={handleSelectChange}
                  >
                    <Option value="Active">Active</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Suspended">Suspended</Option>
                    <Option value="Disabled">Disabled</Option>
                    <Option value="Rejected">Rejected</Option>
                    <Option value="Banned">Banned</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Company Name">
                  <Input 
                    name="company_name" 
                    value={editingAdvertiser.company_name} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Website URL">
                  <Input 
                    name="website_url" 
                    value={editingAdvertiser.website_url} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Country">
                  <Input 
                    name="country" 
                    value={editingAdvertiser.country} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="City">
                  <Input 
                    name="city" 
                    value={editingAdvertiser.city} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Currency">
                  <Input 
                    name="currency" 
                    value={editingAdvertiser.currency} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Entity Type">
                  <Input 
                    name="entity_type" 
                    value={editingAdvertiser.entity_type} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Account Manager">
                  <Input 
                    name="account_manager" 
                    value={editingAdvertiser.account_manager} 
                    onChange={handleInputChange} 
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Notes">
                  <TextArea 
                    name="notes" 
                    value={editingAdvertiser.notes} 
                    onChange={handleInputChange}
                    rows={3}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Checkbox 
                    name="notify" 
                    checked={editingAdvertiser.notify} 
                    onChange={handleCheckboxChange}
                  >
                    Email Notifications
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default AdvertiserDetailsPage;