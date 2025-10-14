// src/components/dashboard/PerformanceChart.jsx
import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const PerformanceChart = ({ data }) => {
  // Format data for chart
  const formattedData = data.map(item => ({
    date: dayjs(item.date).format('YYYY-MM-DD'),
    clicks: item.clicks || 0,
    conversions: item.conversions || 0,
    revenue: item.revenue || 0,
    payout: item.payout || 0,
    profit: item.profit || 0,
    impressions: item.impressions || 0,
  }));

  // Calculate totals for legend
  const totals = formattedData.reduce(
    (acc, item) => ({
      clicks: acc.clicks + item.clicks,
      conversions: acc.conversions + item.conversions,
      revenue: acc.revenue + item.revenue,
      payout: acc.payout + item.payout,
      profit: acc.profit + item.profit,
      impressions: acc.impressions + item.impressions,
    }),
    {
      clicks: 0,
      conversions: 0,
      revenue: 0,
      payout: 0,
      profit: 0,
      impressions: 0,
    }
  );

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="custom-legend">
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#1890ff' }}></span>
          <span>Clicks ({formatNumber(totals.clicks)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#722ed1' }}></span>
          <span>Revenue ({formatNumber(totals.revenue)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#52c41a' }}></span>
          <span>Conversions ({formatNumber(totals.conversions)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#ff4d4f' }}></span>
          <span>Impressions ({formatNumber(totals.impressions)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#1a237e' }}></span>
          <span>Payout ({formatNumber(totals.payout)})</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ backgroundColor: '#eb2f96' }}></span>
          <span>Profit ({formatNumber(totals.profit)})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="performance-chart">
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 80, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#8c8c8c"
            style={{ fontSize: '12px' }}
            axisLine={{ stroke: '#f0f0f0' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          
          {/* Left Y-Axis: Conversions and Payout */}
          <YAxis
            yAxisId="left"
            stroke="#8c8c8c"
            style={{ fontSize: '12px' }}
            axisLine={{ stroke: '#f0f0f0' }}
            tickLine={{ stroke: '#f0f0f0' }}
            label={{
              value: 'Conversions and Payouts',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fontSize: '11px', fontWeight: 500, fill: '#8c8c8c' },
            }}
          />
          
          {/* Right Y-Axis: Clicks and Impressions */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#1890ff"
            style={{ fontSize: '12px' }}
            axisLine={{ stroke: '#f0f0f0' }}
            tickLine={{ stroke: '#f0f0f0' }}
            label={{
              value: 'Clicks and Impressions',
              angle: 90,
              position: 'insideRight',
              offset: 10,
              style: { fontSize: '11px', fontWeight: 500, fill: '#1890ff' },
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} wrapperStyle={{ paddingTop: '20px' }} />

          {/* Bars - on Left Axis */}
          <Bar
            yAxisId="left"
            dataKey="conversions"
            fill="#52c41a"
            radius={[4, 4, 0, 0]}
            barSize={35}
            opacity={0.9}
          />
          <Bar
            yAxisId="left"
            dataKey="payout"
            fill="#1a237e"
            radius={[4, 4, 0, 0]}
            barSize={35}
            opacity={0.9}
          />

          {/* Lines - on Right Axis */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="clicks"
            stroke="#1890ff"
            strokeWidth={3}
            dot={{ fill: '#1890ff', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={true}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#722ed1"
            strokeWidth={3}
            dot={{ fill: '#722ed1', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={true}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="profit"
            stroke="#eb2f96"
            strokeWidth={3}
            dot={{ fill: '#eb2f96', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;