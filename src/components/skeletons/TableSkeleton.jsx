// src/components/advertiser/AdvertiserTableSkeleton.jsx
import React from 'react';
import { Skeleton, Dropdown, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import '../../styles/TableSkeleton.scss';

const ROW_COUNT = 5;

const TableSkeleton = () => {
  const rows = Array.from({ length: ROW_COUNT });

  return (
    <div className="table-container skeleton">
      <div className="table-header">
        {['ID', 'Name', 'Email', 'Company Name', 'Phone', 'Status', 'Reference ID', 'Managers', 'Actions']
          .map((col) => (
            <div key={col} className="th">
              <Skeleton.Input style={{ width: 80 }} active size="small" />
            </div>
          ))}
      </div>

      <div className="table-body">
        {rows.map((_, idx) => (
          <div key={idx} className="tr">
            <div className="td"><Skeleton.Avatar active size="small" shape="square" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td"><Skeleton.Input active size="small" /></div>
            <div className="td">
              <Button className="skeleton-action" icon={<MoreOutlined />} disabled />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
