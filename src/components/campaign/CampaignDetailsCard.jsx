import React from "react";
import { Card, Descriptions, Tag } from "antd";

const CampaignDetailsCard = ({ campaign }) => {
  const formatArrayValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Not specified";
    }
    return value || "Not specified";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  const formatPayoutRevenue = (value, currency, objective) => {
    if (!value) return "Not specified";
    if (objective?.toLowerCase() === "sale") {
      return `${value}%`;
    }
    return `${value} ${currency}`;
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "green";
      case "inactive":
        return "red";
      case "expired":
        return "orange";
      case "paused":
        return "yellow";
      default:
        return "default";
    }
  };

  return (
    <Card
      title={`Details (ID: ${campaign.id})`}
      bordered={false}
      headStyle={{ backgroundColor: "#fafafa" }}
      className="campaign-card"
    >
      <Descriptions
        column={1}
        bordered
        size="small"
        labelStyle={{ width: "35%" }}
      >
        <Descriptions.Item label="Title">{campaign.title}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {campaign.description || "No description available"}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(campaign.status)}>
            {campaign.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Effective Status">
          <Tag color={getStatusColor(campaign.effectiveStatus)}>
            {campaign.effectiveStatus?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Advertiser">
          <a href="#">
            (ID: {campaign.company_id}) {campaign.company?.name}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {formatArrayValue(campaign.category)}
        </Descriptions.Item>
        <Descriptions.Item label="Visibility">
          {campaign.visibility}
        </Descriptions.Item>
        <Descriptions.Item label="Objective">
          {campaign.objective}
        </Descriptions.Item>
        <Descriptions.Item label="Currency">
          {campaign.currency}
        </Descriptions.Item>
        <Descriptions.Item label="Payout">
          {formatPayoutRevenue(
            campaign.payout,
            campaign.currency,
            campaign.objective
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Revenue">
          {formatPayoutRevenue(
            campaign.revenue,
            campaign.currency,
            campaign.objective
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Revenue Model">
          {campaign.revenueModel || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Conversion Tracking">
          {campaign.conversionTracking || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Devices">
          {formatArrayValue(campaign.devices)}
        </Descriptions.Item>
        <Descriptions.Item label="Operating System">
          {formatArrayValue(campaign.operatingSystem)}
        </Descriptions.Item>
        <Descriptions.Item label="Geo Coverage">
          {formatArrayValue(campaign.geoCoverage)}
        </Descriptions.Item>
        <Descriptions.Item label="Traffic Channels">
          {formatArrayValue(campaign.allowedTrafficChannels)}
        </Descriptions.Item>
        <Descriptions.Item label="Campaign Start">
          {formatDate(campaign.campaignStartDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Campaign End">
          {formatDate(campaign.campaignEndDate)}
        </Descriptions.Item>
        <Descriptions.Item label="Time Zone">
          {campaign.timezone || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Start Hour">
          {campaign.startHour !== undefined
            ? `${campaign.startHour}:00`
            : "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="End Hour">
          {campaign.endHour !== undefined
            ? `${campaign.endHour}:00`
            : "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Created Date">
          {formatDate(campaign.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Preview URL">
          <a
            href={campaign.preview_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {campaign.preview_url}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Tracking URL">
          {campaign.trackingUrl || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Default Campaign URL">
          {campaign.defaultCampaignUrl || "Not specified"}
        </Descriptions.Item>
        <Descriptions.Item label="Note">
          {campaign.note || "No notes"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default CampaignDetailsCard;
