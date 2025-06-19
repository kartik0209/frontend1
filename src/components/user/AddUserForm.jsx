import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Row,
  Col,
  Checkbox,
  Divider
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  TeamOutlined,
  SkypeOutlined
} from '@ant-design/icons';

const { Option } = Select;

const AddUserForm = ({ 
  onSubmit, 
  onCancel, 
  loading = false, 
  initialValues = {},
  showAdditionalFields = true 
}) => {
  const [form] = Form.useForm();
  const [notifyByEmail, setNotifyByEmail] = useState(true);

  const handleSubmit = async (values) => {
    try {
      const formData = {
        name: values.name,
        email: values.email,
        role: values.role,
        number: values.number, // Changed from phone to number to match API
        status: values.status,
        notify: notifyByEmail.toString(), // Convert boolean to string as API expects
        ...(values.password && { password: values.password }), // Only include password if provided
        ...(values.skype && { skype: values.skype }), // Only include skype if provided
      };
      
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Failed to submit form');
    }
  };

  const handleReset = () => {
    form.resetFields();
    setNotifyByEmail(true);
    if (onCancel) {
      onCancel();
    }
  };

  // Role options - matching your API structure
  const roleOptions = [
    { value: 'advertiser', label: 'Advertiser', color: '#87d068' },
    { value: 'publisher', label: 'Publisher', color: '#108ee9' },
  ];

  // Status options - matching your API (Active/Inactive)
  const statusOptions = [
    { value: 'Active', label: 'Active', color: '#52c41a' },
    { value: 'Inactive', label: 'Inactive', color: '#d9d9d9' },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        status: 'Active', // Changed to match API expectation
        role: 'publisher',
        ...initialValues
      }}
      requiredMark={false}
      size="large"
    >
      
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter full name' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 50, message: 'Name cannot exceed 50 characters' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="Enter full name" 
              showCount
              maxLength={50}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="Enter email address" 
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
            tooltip="Select the appropriate role for this user"
          >
            <Select 
              placeholder="Select role"
              optionLabelProp="label"
            >
              {roleOptions.map(role => (
                <Option key={role.value} value={role.value} label={role.label}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TeamOutlined style={{ marginRight: 8, color: role.color }} />
                    {role.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="Account Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select 
              placeholder="Select status"
              optionLabelProp="label"
            >
              {statusOptions.map(status => (
                <Option key={status.value} value={status.value} label={status.label}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                      style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        backgroundColor: status.color,
                        marginRight: 8 
                      }} 
                    />
                    {status.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Security Information */}
      <Divider orientation="left">Security Information</Divider>
      
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="password"
            label="Password (Optional)"
            tooltip="Leave empty to send password setup email to user"
            rules={[
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />}
              placeholder="At least 8 characters" 
              visibilityToggle
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Contact Information */}
      {showAdditionalFields && (
        <>
          <Divider orientation="left">Contact Information</Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="number" // Changed from "phone" to "number" to match API
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number" 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="skype"
                label="Skype ID (Optional)"
              >
                <Input 
                  prefix={<SkypeOutlined />}
                  placeholder="Your Skype ID" 
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {/* Notification Settings */}
      <Divider orientation="left">Notification Settings</Divider>
      
      <Form.Item>
        <Checkbox 
          checked={notifyByEmail}
          onChange={(e) => setNotifyByEmail(e.target.checked)}
        >
          Notify this user by email about account creation
        </Checkbox>
      </Form.Item>

      {/* Action Buttons */}
      <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
        <Space size="middle" style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button 
            onClick={handleReset}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddUserForm;