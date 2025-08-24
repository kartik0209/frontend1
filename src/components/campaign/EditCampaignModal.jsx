import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  message
} from 'antd';
import apiClient from '../../services/apiServices';
import { conversionTrackingOptions ,statusOptions ,objectiveOptions,osOptions,visibilityOptions,currencyOptions,revenueModelOptions,deviceOptions} from '../../data/formOptions';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditCampaignModal = ({ visible, onCancel, campaign, onSave }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible && campaign) {
      form.setFieldsValue({
        title: campaign.title,
        description: campaign.description,
        status: campaign.status,
        visibility: campaign.visibility,
        objective: campaign.objective,
        currency: campaign.currency,
        payout: campaign.payout,
        revenue: campaign.revenue,
        revenueModel: campaign.revenueModel,
        conversionTracking: campaign.conversionTracking,
        devices: campaign.devices,
        operatingSystem: campaign.operatingSystem,
        geoCoverage: campaign.geoCoverage,
        allowedTrafficChannels: campaign.allowedTrafficChannels,
        campaignStartDate: campaign.campaignStartDate ? dayjs(campaign.campaignStartDate) : null,
        campaignEndDate: campaign.campaignEndDate ? dayjs(campaign.campaignEndDate) : null,
        timezone: campaign.timezone,
        startHour: campaign.startHour,
        endHour: campaign.endHour,
        preview_url: campaign.preview_url,
        trackingUrl: campaign.trackingUrl,
        defaultCampaignUrl: campaign.defaultCampaignUrl,
        note: campaign.note,
      });
    }
  }, [visible, campaign, form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      const formattedValues = {
        ...values,
        campaignStartDate: values.campaignStartDate ? values.campaignStartDate.format('YYYY-MM-DD') : null,
        campaignEndDate: values.campaignEndDate ? values.campaignEndDate.format('YYYY-MM-DD') : null,
      };

      const response = await apiClient.put(`/admin/campaign/${campaign.id}`, formattedValues);
      
      if (response.data?.success) {
        message.success('Campaign updated successfully');
        onSave(response.data.data || { ...campaign, ...formattedValues });
        onCancel();
      } else {
        message.error(response.data?.message || 'Failed to update campaign');
      }
    } catch (error) {
      if (error.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to update campaign: ' + (error.message || 'An error occurred'));
      }
    } finally {
      setSaving(false);
    }
  };



  return (
    <Modal
      title={`Edit Campaign - ${campaign?.title}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Campaign Title"
              rules={[{ required: true, message: 'Please enter campaign title' }]}
            >
              <Input placeholder="Enter campaign title" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select status">
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter campaign description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="visibility" label="Visibility">
              <Select placeholder="Select visibility">
                {visibilityOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="objective" label="Objective">
              <Select placeholder="Select objective">
                {objectiveOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="currency" label="Currency">
              <Select placeholder="Select currency">
                {currencyOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="payout" label="Payout">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="revenue" label="Revenue">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="revenueModel" label="Revenue Model">
              <Select placeholder="Select model">
                {revenueModelOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="conversionTracking" label="Conversion Tracking">
              <Select placeholder="Select a tracking method">
                {conversionTrackingOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="devices" label="Devices">
              <Select mode="multiple" placeholder="Select devices">
                {deviceOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="operatingSystem" label="Operating Systems">
              <Select mode="multiple" placeholder="Select OS">
                {osOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="campaignStartDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="campaignEndDate" label="End Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="startHour" label="Start Hour">
              <InputNumber min={0} max={23} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="endHour" label="End Hour">
              <InputNumber min={0} max={23} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="timezone" label="Timezone">
              <Input placeholder="e.g., UTC, EST, PST" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="preview_url" label="Preview URL">
          <Input placeholder="Enter preview URL" />
        </Form.Item>

        <Form.Item name="trackingUrl" label="Tracking URL">
          <Input placeholder="Enter tracking URL" />
        </Form.Item>

        <Form.Item name="defaultCampaignUrl" label="Default Campaign URL">
          <Input placeholder="Enter default campaign URL" />
        </Form.Item>

        <Form.Item name="note" label="Notes">
          <TextArea rows={3} placeholder="Enter any notes" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCampaignModal;