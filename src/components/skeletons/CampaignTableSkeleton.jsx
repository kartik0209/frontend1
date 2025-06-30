import React from 'react';
import { Skeleton, Card, Button, Space } from 'antd';
import '../../styles/CampaignTableSkeleton.scss';

const CampaignTableSkeleton = () => {
  // Generate skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="table-row">
      <td className="table-cell">
        <Skeleton.Input active size="small" style={{ width: 16, height: 16 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Input active size="small" style={{ width: 30 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Input active size="default" style={{ width: 120 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Button active size="small" shape="round" style={{ width: 80 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Input active size="small" style={{ width: 20 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Input active size="default" style={{ width: 100 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Button active size="small" shape="round" style={{ width: 70 }} />
      </td>
      <td className="table-cell">
        <Skeleton.Input active size="small" style={{ width: 24, height: 24 }} />
      </td>
    </tr>
  ));

  return (
    <div className="campaign-table-skeleton">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-content">
          <div className="title-section">
            <Skeleton.Input active style={{ width: 200, height: 32, marginBottom: 8 }} />
            <Skeleton.Input active style={{ width: 300, height: 20 }} />
          </div>
          <div className="action-buttons">
            <Skeleton.Button active style={{ width: 140, height: 36 }} />
            <Skeleton.Button active style={{ width: 100, height: 36 }} />
            <Skeleton.Button active style={{ width: 80, height: 36 }} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <div className="table-container">
          <table className="campaign-table">
            {/* Table Header */}
            <thead className="table-header">
              <tr>
                <th className="header-cell">
                  <Skeleton.Input active size="small" style={{ width: 16, height: 16 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 25 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 40 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 50 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 80 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 70 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 60 }} />
                </th>
                <th className="header-cell">
                  <Skeleton.Input active style={{ width: 50 }} />
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="table-body">
              {skeletonRows}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="pagination-section">
          <Skeleton.Input active style={{ width: 100 }} />
          <div className="pagination-controls">
            <Skeleton.Button active size="small" shape="circle" />
            <Skeleton.Button active size="small" shape="circle" />
            <Skeleton.Input active style={{ width: 80 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTableSkeleton;