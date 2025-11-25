import React from 'react';
import { Tag } from 'antd';

export const columnOptions = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "companyName", label: "Company Name" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "reference_id", label: "Reference ID" },
  { key: "manager_id", label: "Managers" },
  { key: "website_url", label: "Website URL" },
  { key: "country", label: "Country" },
  { key: "entity_type", label: "Entity Type" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
  { key: "notify", label: "Notifications" },
  { key: "created_at", label: "Created Date" },
  { key: "updated_at", label: "Last Updated" },
];

const getStatusColor = (status) => {
  const statusColors = {
    Active: 'green',
    Pending: 'orange',
    Suspended: 'purple',
    Disabled: 'red',
    Rejected: 'red',
    Banned: 'red',
    Inactive: 'default',
  };
  return statusColors[status] || 'default';
};

export const baseColumns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    sorter: true,
    fixed: "left",
  },
// Update the Name column in baseColumns array
{
  title: "Name",
  dataIndex: "name",
  key: "name",
  width: 250, // Increased width to accommodate copy button
  sorter: true,
  ellipsis: true,
  render: (name, record) =>
    React.createElement('div', { style: { lineHeight: '1.4' } }, [
      React.createElement('div', { 
        key: 'name',
        style: { 
          fontWeight: '500', 
          color: '#1890ff',
          marginBottom: '2px'
        }
      }, name || 'N/A'),
      React.createElement('div', { 
        key: 'email-container',
        style: { 
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }
      }, [
        React.createElement('span', { 
          key: 'email-text',
          style: { 
            fontSize: '12px', 
            color: '#8c8c8c',
            fontWeight: '400'
          }
        }, record.email || 'No email'),
        record.email ? React.createElement('button', {
          key: 'copy-btn',
          style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '3px',
            fontSize: '10px',
            color: '#1890ff',
            opacity: '0.7'
          },
          onClick: (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(record.email).then(() => {
              // Optional: Show toast notification
              console.log('Email copied:', record.email);
            });
          },
          onMouseEnter: (e) => {
            e.target.style.opacity = '1';
            e.target.style.backgroundColor = '#f0f0f0';
          },
          onMouseLeave: (e) => {
            e.target.style.opacity = '0.7';
            e.target.style.backgroundColor = 'transparent';
          },
          title: 'Copy email'
        }, '📋') : null
      ])
    ])
},
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 200,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
    width: 180,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    width: 140,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    sorter: true,
    filters: [
      { text: "Active", value: "Active" },
      { text: "Pending", value: "Pending" },
      { text: "Inactive", value: "Inactive" },
      { text: "Suspended", value: "Suspended" },
      { text: "Disabled", value: "Disabled" },
      { text: "Rejected", value: "Rejected" },
      { text: "Banned", value: "Banned" },
    ],
    render: (status) =>
      React.createElement(Tag, { color: getStatusColor(status) }, status),
  },
  {
    title: "Reference ID",
    dataIndex: "reference_id",
    key: "reference_id",
    width: 150,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Managers",
    dataIndex: "manager_id",
    key: "manager_id",
    width: 180,
    sorter: true,
    ellipsis: true,
  },
  {
    title: "Website URL",
    dataIndex: "website_url",
    key: "website_url",
    width: 200,
    ellipsis: true,
    render: (url) =>
      url
        ? React.createElement(
            'a',
            { href: url, target: '_blank', rel: 'noopener noreferrer' },
            url
          )
        : 'N/A',
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
    width: 100,
    sorter: true,
    filters: [
      { text: "USD", value: "USD" },
      { text: "EUR", value: "EUR" },
      { text: "GBP", value: "GBP" },
      { text: "JPY", value: "JPY" },
      { text: "CAD", value: "CAD" },
      { text: "AUD", value: "AUD" },
      { text: "INR", value: "INR" },
    ],
  },
  {
    title: "Entity Type",
    dataIndex: "entity_type",
    key: "entity_type",
    width: 140,
    sorter: true,
    filters: [
      { text: "Agency", value: "Agency" },
      { text: "Direct Advertiser", value: "Direct Advertiser" },
      { text: "Network", value: "Network" },
      { text: "Individual", value: "Individual" },
    ],
  },
  {
    title: "Notes",
    dataIndex: "notes",
    key: "notes",
    width: 200,
    ellipsis: true,
  },
  {
    title: "Notifications",
    dataIndex: "notify",
    key: "notify",
    width: 120,
    sorter: true,
    filters: [
      { text: "Enabled", value: true },
      { text: "Disabled", value: false },
    ],
    render: (notify) =>
      React.createElement(Tag, { color: notify ? 'green' : 'red' }, notify ? 'Enabled' : 'Disabled'),
  },
  // {
  //   title: "Created Date",
  //   dataIndex: "created_at",
  //   key: "created_at",
  //   width: 120,
  //   sorter: true,
  //   render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
  // },
  // {
  //   title: "Last Updated",
  //   dataIndex: "updated_at",
  //   key: "updated_at",
  //   width: 120,
  //   sorter: true,
  //   render: (date) => (date ? new Date(date).toLocaleDateString() : 'N/A'),
  // },
];
