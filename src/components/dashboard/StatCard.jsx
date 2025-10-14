// src/components/dashboard/StatCard.jsx
import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const StatCard = ({ icon, title, color, today, yesterday, mtd }) => {
  return (
    <Card className="stat-card" bordered={false}>
      <div className="stat-header">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
        <Title level={5} className="stat-title">{title}</Title>
      </div>

      <div className="stat-values">
        <div className="stat-item">
          <Text className="stat-label">Today</Text>
          <Title level={3} className="stat-number" style={{ color: color }}>
            {today}
          </Title>
        </div>

        <div className="stat-item">
          <Text className="stat-label">Yesterday</Text>
          <Title level={3} className="stat-number" style={{ color: color }}>
            {yesterday}
          </Title>
        </div>

        <div className="stat-item">
          <Text className="stat-label">MTD</Text>
          <Title level={3} className="stat-number" style={{ color: color }}>
            {mtd}
          </Title>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;