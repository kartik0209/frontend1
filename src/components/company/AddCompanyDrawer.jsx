import React, { useState } from 'react';
import {
  Drawer,
  Form,
  Button,
  Input,
  Select,
  Upload,
  Space,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import apiClient from '../../services/apiServices';

const { Option } = Select;

// Helper function to extract the file list from the Ant Design upload event
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const AddCompanyDrawer = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // This state is now primarily for getting the raw file object for FormData
  const [rawFile, setRawFile] = useState(null);

  const handleFormSubmit = async (values) => {
    // The logo is now part of `values` from the form, but we need the raw file for FormData
    if (!rawFile) {
      message.error('Please upload a company logo.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('admin_email', values.admin_email);
    formData.append('subdomain', values.subdomain);
    formData.append('subscription_type', values.subscription_type);
    formData.append('logo', rawFile); // Use the stored raw file object

    try {
      const response = await apiClient.post(
        '/company/auth/register',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        message.success('Company registered successfully!');
        form.resetFields();
        setRawFile(null);
        onSuccess();
      } else {
        throw new Error(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      if (isJpgOrPng && isLt2M) {
        setRawFile(file); // Store the raw file for submission
      }
      // We return false to prevent antd from trying to upload it automatically.
      // The form will handle the file list state.
      return false;
    },
    onRemove: () => {
        setRawFile(null);
    },
    maxCount: 1,
  };

  return (
    <Drawer
      title="Create a New Company"
      width={480}
      onClose={onClose}
      open={open}
      // FIX: Use `styles.body` instead of the deprecated `bodyStyle`
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => form.submit()}
            type="primary"
            loading={loading}
               style={{backgroundColor: '#0a1a4e', color: '#fff'}}
          >
            Submit
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        requiredMark
      >
        <Form.Item
          name="name"
          label="Company Name"
          rules={[{ required: true, message: 'Please enter company name' }]}
        >
          <Input placeholder="e.g., Innovate Inc." />
        </Form.Item>

        <Form.Item
          name="admin_email"
          label="Admin Email"
          rules={[
            { required: true, message: 'Please enter admin email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="e.g., admin@innovate.com" />
        </Form.Item>

        <Form.Item
          name="subdomain"
          label="Subdomain"
          rules={[
            { required: true, message: 'Please enter a subdomain' },
            {
              pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Subdomain can only contain lowercase letters, numbers, and hyphens.',
            },
          ]}
        >
          <Input addonAfter=".afftrex.com" placeholder="e.g., innovate" />
        </Form.Item>

        <Form.Item
          name="subscription_type"
          label="Subscription Type"
          rules={[{ required: true, message: 'Please select a subscription' }]}
        >
          <Select placeholder="Select a subscription type">
            <Option value="free">Free</Option>
            <Option value="paid">Paid</Option>
          </Select>
        </Form.Item>

        {/* FIX: The Form.Item now correctly handles the file list state */}
        <Form.Item
          name="logo"
          label="Company Logo"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: 'Please upload a logo' }]}
        >
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddCompanyDrawer;