import React from 'react'; // useState is no longer needed for trackingType
import { Card, Input, Button, message, Space, Select } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

// 1. Accept `trackingType` and `onTrackingTypeChange` as props
const ConversionTracking = ({ 
  value = '', 
  onChange,
  trackingType, // The value for the dropdown, passed from the parent
  onTrackingTypeChange, // The function to call when the dropdown changes
  options=[]
}) => {
  // 2. The internal state for trackingType has been removed.

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      message.success('Copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy.');
    }
  };

  return (
    <Card
      title={
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <Space align="center">
            <Select
              // 3. Bind the Select component to the props
              value={trackingType}
              onChange={onTrackingTypeChange}
              style={{ width: 120 }}
            >
              {/* 2. Map over the options prop to create the dropdown items */}
              {options.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
            <span>Conversion Tracking Script</span>
          </Space>
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopy}
            disabled={!value}
            size="small"
          >
            Copy
          </Button>
        </Space>
      }
      bordered={false}
    >
      <TextArea
        rows={12}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Paste your conversion tracking script here..."
        style={{ fontFamily: 'monospace', fontSize: 14 }}
      />
    </Card>
  );
};

export default ConversionTracking;