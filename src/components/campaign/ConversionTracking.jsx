import React, { useState } from 'react';
import { Card, Input, Button, message, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const { TextArea } = Input;

/**
 * ConversionTracking with Copy to Clipboard
 * @param {object} props 
 * @param {string} props.value - The initial value to show in the text box
 * @param {function} props.onChange - Callback when text is changed
 */
const ConversionTracking = ({ value = '', onChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      message.success('Copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy.');
    }
  };

  return (
    <Card
      title={
        <Space style={{ justifyContent: 'space-between', width: '100%' }}>
          <span>Conversion Tracking Script</span>
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
