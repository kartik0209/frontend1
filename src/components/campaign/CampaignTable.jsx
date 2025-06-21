import React from "react";
import { Table } from "antd";

const CampaignTable = ({ campaigns, columns, loading, rowSelection }) => {
  return (
    <div className="table-container">
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={campaigns}
        loading={loading}
        // scroll={{ x: 1500, y: 600 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          className: "table-pagination",
        }}
        className="campaign-table"
        rowClassName={() => "campaign-row"}
      />
    </div>
  );
};

export default CampaignTable;