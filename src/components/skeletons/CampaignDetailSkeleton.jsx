import React from 'react';
import {
  Row,
  Col,
  Card,
  Skeleton,
  Space,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  LinkOutlined,
  BlockOutlined,
  FileTextOutlined,
  EditOutlined,
  DownloadOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import '../../styles/CampaignDetailSkeleton.scss';

const CampaignDetailSkeleton = () => {
  return (
    <div className="campaign-detail-skeleton">
      {/* Header Section */}
      <Row justify="space-between" align="middle" className="skeleton-header">
        <Col>
          <Space align="center" size="large">
            <ArrowLeftOutlined className="skeleton-back-icon" />
            <Skeleton.Input style={{ width: 200, height: 32 }} active />
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Campaign Details Card */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <Skeleton.Avatar shape="square" size="small" />
                <Skeleton.Input style={{ width: 150 }} active />
              </Space>
            }
            bordered={false}
            headStyle={{ backgroundColor: '#fafafa' }}
            className="skeleton-card"
            extra={
              <Space>
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
                <Skeleton.Button size="small" active />
              </Space>
            }
          >
            <div className="skeleton-descriptions">
              {Array.from({ length: 18 }, (_, index) => (
                <div key={index} className="skeleton-description-item">
                  <div className="skeleton-label">
                    <Skeleton.Input style={{ width: 120, height: 16 }} active />
                  </div>
                  <div className="skeleton-content">
                    <Skeleton.Input 
                      style={{ 
                        width: Math.random() * 100 + 150, 
                        height: 16 
                      }} 
                      active 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Right Column - Tracking Link and Publisher Access */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Tracking Link Card Skeleton */}
            <Card
              title={
                <Space>
                  <LinkOutlined />
                  <span>Tracking Link</span>
                </Space>
              }
              bordered={false}
              headStyle={{ backgroundColor: '#fafafa' }}
              className="skeleton-card"
              extra={
                <Space>
                  <Skeleton.Button size="small" active />
                  <Skeleton.Button size="small" active />
                </Space>
              }
            >
              <div className="skeleton-tracking-content">
                {/* Publisher Selection */}
                <div className="skeleton-section">
                  <Skeleton.Input style={{ width: 120, height: 16, marginBottom: 8 }} active />
                  <Skeleton.Input style={{ width: '100%', height: 32 }} active />
                  <Skeleton.Input style={{ width: '80%', height: 14, marginTop: 8 }} active />
                </div>

                <Divider />

                {/* Generated Link Section */}
                <div className="skeleton-section">
                  <Skeleton.Input style={{ width: 100, height: 20, marginBottom: 12 }} active />
                  <Skeleton.Input style={{ width: '100%', height: 80, marginBottom: 12 }} active />
                  <Space>
                    <Skeleton.Button active />
                    <Skeleton.Button size="small" active />
                  </Space>
                </div>

                <Divider />

                {/* Link Options */}
                <div className="skeleton-section">
                  <Skeleton.Input style={{ width: 80, height: 20, marginBottom: 16 }} active />
                  <Row gutter={[16, 16]}>
                    {Array.from({ length: 6 }, (_, index) => (
                      <Col span={12} key={index}>
                        <Space>
                          <Skeleton.Avatar shape="square" size={16} />
                          <Skeleton.Input style={{ width: 120, height: 16 }} active />
                        </Space>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Card>

            {/* Publisher Access Card Skeleton */}
            <Card
              title="Approve Publishers"
              bordered={false}
              headStyle={{ backgroundColor: '#fafafa' }}
              className="skeleton-card"
              extra={<Skeleton.Button icon={<SaveOutlined />} active />}
            >
              <div className="skeleton-transfer">
                <Row gutter={24}>
                  <Col span={11}>
                    <div className="skeleton-transfer-list">
                      <div className="skeleton-transfer-header">
                        <Skeleton.Input style={{ width: 80, height: 20 }} active />
                      </div>
                      <div className="skeleton-transfer-body">
                        {Array.from({ length: 8 }, (_, index) => (
                          <div key={index} className="skeleton-transfer-item">
                            <Space>
                              <Skeleton.Avatar shape="square" size={16} />
                              <Skeleton.Input style={{ width: 150, height: 16 }} active />
                            </Space>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col span={2}>
                    <div className="skeleton-transfer-operations">
                      <Skeleton.Button size="small" active />
                      <Skeleton.Button size="small" active />
                    </div>
                  </Col>
                  <Col span={11}>
                    <div className="skeleton-transfer-list">
                      <div className="skeleton-transfer-header">
                        <Skeleton.Input style={{ width: 80, height: 20 }} active />
                      </div>
                      <div className="skeleton-transfer-body">
                        {Array.from({ length: 3 }, (_, index) => (
                          <div key={index} className="skeleton-transfer-item">
                            <Space>
                              <Skeleton.Avatar shape="square" size={16} />
                              <Skeleton.Input style={{ width: 150, height: 16 }} active />
                            </Space>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Bottom Row - Block Publishers and Notes */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Block Publishers Card Skeleton */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BlockOutlined />
                Block Publishers
              </Space>
            }
            bordered={false}
            headStyle={{ backgroundColor: '#fafafa' }}
            className="skeleton-card"
          >
            <div className="skeleton-section">
              <Skeleton.Input style={{ width: 120, height: 16, marginBottom: 8 }} active />
              <Skeleton.Input style={{ width: '100%', height: 32, marginBottom: 16 }} active />
              <Skeleton.Input style={{ width: '90%', height: 14, marginBottom: 16 }} active />
              
              {/* Blocked Publishers Tags */}
              <Skeleton.Input style={{ width: 140, height: 16, marginBottom: 8 }} active />
              <div className="skeleton-tags">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton.Button key={index} size="small" style={{ marginRight: 8, marginBottom: 8 }} active />
                ))}
              </div>
              
              <Skeleton.Button style={{ marginTop: 16 }} active />
            </div>
          </Card>
        </Col>

        {/* Notes Card Skeleton */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <FileTextOutlined />
                Notes
              </Space>
            }
            bordered={false}
            headStyle={{ backgroundColor: '#fafafa' }}
            className="skeleton-card"
          >
            <div className="skeleton-section">
              {/* Toolbar */}
              <div className="skeleton-toolbar">
                <Space size="small" wrap>
                  {Array.from({ length: 15 }, (_, index) => (
                    <Skeleton.Button key={index} size="small" style={{ width: 32, height: 24 }} active />
                  ))}
                  <Skeleton.Input style={{ width: 100, height: 24 }} active />
                  <Skeleton.Input style={{ width: 60, height: 24 }} active />
                </Space>
              </div>

              {/* Text Area */}
              <Skeleton.Input style={{ width: '100%', height: 160, marginTop: 0 }} active />

              {/* Action Buttons */}
              <div className="skeleton-actions">
                <Skeleton.Button active />
                <Skeleton.Button active />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CampaignDetailSkeleton;