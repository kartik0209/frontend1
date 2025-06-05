// src/components/CompanyStatsCards.jsx
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import '../styles/CompanyStatsCards.scss'; // We'll add some custom CSS here

const CompanyStatsCards = ({ stats }) => {
  return (
    <Row gutter={[16, 16]} className="stats-cards">
      {/* Total Companies (blue border) */}
      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card total-card">
          <Statistic
            title="Total Companies"
            value={stats.total}
            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>

      {/* Approved (green border) */}
      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card approved-card">
          <Statistic
            title="Approved"
            value={stats.approved}
            prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>

      {/* Pending (orange border) */}
      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card pending-card">
          <Statistic
            title="Pending"
            value={stats.pending}
            prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>

      {/* Rejected (red border) */}
      <Col xs={24} sm={12} md={6}>
        <Card className="stat-card rejected-card">
          <Statistic
            title="Rejected"
            value={stats.rejected}
            prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default CompanyStatsCards;
