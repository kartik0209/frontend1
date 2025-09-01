import React, { useState } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Button,
  Space,
  Tabs,
  Divider,
  message,
} from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  SettingOutlined,
  ClearOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ConversionReportFilter = ({
  visible,
  onClose,
  onApply,
  initialValues = {},
}) => {
  const [form] = Form.useForm();
  
  // Report Options State
  const [reportOptions, setReportOptions] = useState({
    uniqueClicks: false,
    approvedConversions: true,
    sampledConversions: false,
    impressions: false,
    payout: true,
    rejectedPayout: false,
    revenue: true,
    cancelledRevenue: false,
    earningPerClick: false,
    extendedSaleAmount: false,
    grossSaleAmount: false,
    netRevenue: false,
    rejectedClicks: false,
    pendingConversions: false,
    extendedConversions: false,
    rejectedImpressions: false,
    pendingPayout: false,
    sampledPayout: false,
    profit: true,
    rejectedRevenue: false,
    clickThroughRate: false,
    cancelledSaleAmount: false,
    netConversions: false,
    netProfit: false,
    clicks: false,
    cancelledConversions: false,
    grossConversions: false,
    campaignPayout: false,
    extendedPayout: false,
    grossPayout: false,
    pendingRevenue: false,
    grossRevenue: false,
    saleAmount: false,
    rejectedSaleAmount: false,
    netSaleAmount: false,
    grossClicks: true,
    rejectedConversions: false,
    conversionRate: false,
    campaignRevenue: false,
    cancelledPayout: false,
    sampledRevenue: false,
    extendedRevenue: false,
    grossProfit: false,
    pendingSaleAmount: false,
    sampledSaleAmount: false,
    netPayout: false,
    ...initialValues.reportOptions,
  });

  // Search Filter State
  const [searchFilters, setSearchFilters] = useState({
    campaign: '',
    publisher: '',
    advertiser: '',
    searchByCampaignIds: false,
    searchByPublisherIds: false,
    searchByAdvertiserIds: false,
    ...initialValues.searchFilters,
  });

  // Additional Filters State
  const [additionalFilters, setAdditionalFilters] = useState({
    campaignGEO: false,
    teamMember: false,
    advertiserTags: false,
    publisherTags: false,
    campaignAppID: false,
    category: false,
    smartLink: false,
    ...initialValues.additionalFilters,
  });

  // Group By State
  const [groupByOptions, setGroupByOptions] = useState({
    campaign: true,
    campaignStatus: false,
    publisher: false,
    publisherManager: false,
    advertiserManager: false,
    referrerCampaignID: false,
    device: false,
    month: false,
    campaignID: false,
    campaignGEO: false,
    advertiser: false,
    goalName: false,
    releaseOrderID: false,
    operatingSystem: false,
    week: false,
    campaignLongID: false,
    campaignAppName: false,
    publisherID: false,
    publisherLongID: false,
    advertiserID: false,
    goalID: false,
    landingPage: false,
    countryGEO: false,
    year: false,
    externalOfferID: false,
    objective: false,
    sourceSubPublisher: false,
    currency: false,
    referrerCampaign: false,
    landingPageID: false,
    date: false,
    category: false,
    ...initialValues.groupByOptions,
  });

  // Other Options State
  const [otherOptions, setOtherOptions] = useState({
    onlyShowRowsHavingConversions: false,
    onlyShowRowsHavingRevenue: false,
    showManagerID: false,
    showInProfileCurrency: false,
    hideDecimalValues: false,
    ...initialValues.otherOptions,
  });

  // Basic Filters State
  const [basicFilters, setBasicFilters] = useState({
    dateRange: null,
    pixelType: null,
    eventType: null,
    conversionStatus: null,
    transactionId: '',
    trackingId: '',
    minAmount: null,
    maxAmount: null,
    ...initialValues.basicFilters,
  });

  // Search states
  const [reportOptionsSearch, setReportOptionsSearch] = useState('');
  const [groupBySearch, setGroupBySearch] = useState('');

  // Handle changes
  const handleReportOptionChange = (option, checked) => {
    setReportOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalFilterChange = (option, checked) => {
    setAdditionalFilters(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleGroupByChange = (option, checked) => {
    setGroupByOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleOtherOptionChange = (option, checked) => {
    setOtherOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleBasicFilterChange = (field, value) => {
    setBasicFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear functions
  const clearReportOptions = () => {
    setReportOptions(Object.keys(reportOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
  };

  const selectAllReportOptions = () => {
    setReportOptions(Object.keys(reportOptions).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  };

  const clearGroupByOptions = () => {
    setGroupByOptions(Object.keys(groupByOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
  };

  const selectAllGroupByOptions = () => {
    setGroupByOptions(Object.keys(groupByOptions).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
  };

  const clearAllFilters = () => {
    setReportOptions(Object.keys(reportOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    setSearchFilters({
      campaign: '',
      publisher: '',
      advertiser: '',
      searchByCampaignIds: false,
      searchByPublisherIds: false,
      searchByAdvertiserIds: false,
    });
    setAdditionalFilters(Object.keys(additionalFilters).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    setGroupByOptions(Object.keys(groupByOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    setOtherOptions(Object.keys(otherOptions).reduce((acc, key) => ({ ...acc, [key]: false }), {}));
    setBasicFilters({
      dateRange: null,
      pixelType: null,
      eventType: null,
      conversionStatus: null,
      transactionId: '',
      trackingId: '',
      minAmount: null,
      maxAmount: null,
    });
    form.resetFields();
    message.success('All filter options reset to default');
  };

  const handleSubmit = () => {
    const allFilters = {
      reportOptions,
      searchFilters,
      additionalFilters,
      groupByOptions,
      otherOptions,
      basicFilters,
    };
    
    onApply(allFilters);
    message.success('Filters applied successfully!');
    onClose();
  };

  // Filter report options based on search
  const filteredReportOptions = Object.keys(reportOptions).filter(key =>
    key.toLowerCase().includes(reportOptionsSearch.toLowerCase())
  );

  // Filter group by options based on search
  const filteredGroupByOptions = Object.keys(groupByOptions).filter(key =>
    key.toLowerCase().includes(groupBySearch.toLowerCase())
  );

  // Helper function to format option names
  const formatOptionName = (key) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <Modal
      title={
        <Space>
          <FilterOutlined />
          <span>Advanced Report Filters</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={1200}
      footer={[
        <Button key="clear" icon={<ClearOutlined />} onClick={clearAllFilters}>
          Clear All
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Apply Filters
        </Button>,
      ]}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
    >
      <Form form={form} layout="vertical">
        <Tabs defaultActiveKey="1" type="card">
          {/* Report Options Tab */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Report Options
              </span>
            }
            key="1"
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Input
                  placeholder="Search Report Options"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={reportOptionsSearch}
                  onChange={(e) => setReportOptionsSearch(e.target.value)}
                />
                <Button onClick={clearReportOptions}>
                  Clear
                </Button>
                <Button onClick={selectAllReportOptions}>
                  Select All
                </Button>
              </Space>
            </div>
            <Row gutter={[16, 8]}>
              {filteredReportOptions.map((option) => (
                <Col span={6} key={option}>
                  <Checkbox
                    checked={reportOptions[option]}
                    onChange={(e) => handleReportOptionChange(option, e.target.checked)}
                  >
                    {formatOptionName(option)}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* Search Filter Tab */}
          <TabPane
            tab={
              <span>
                <SearchOutlined />
                Search Filter
              </span>
            }
            key="2"
          >
            <Row gutter={[24, 16]}>
              <Col span={8}>
                <Form.Item label="Campaign">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Checkbox
                      checked={searchFilters.searchByCampaignIds}
                      onChange={(e) => handleSearchFilterChange('searchByCampaignIds', e.target.checked)}
                    >
                      Search By IDs
                    </Checkbox>
                    <Input
                      placeholder="Start typing to search campaign"
                      value={searchFilters.campaign}
                      onChange={(e) => handleSearchFilterChange('campaign', e.target.value)}
                    />
                  </Space>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Publisher">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Checkbox
                      checked={searchFilters.searchByPublisherIds}
                      onChange={(e) => handleSearchFilterChange('searchByPublisherIds', e.target.checked)}
                    >
                      Search By IDs
                    </Checkbox>
                    <Input
                      placeholder="Choose one or many Publisher"
                      value={searchFilters.publisher}
                      onChange={(e) => handleSearchFilterChange('publisher', e.target.value)}
                    />
                  </Space>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Advertiser">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Checkbox
                      checked={searchFilters.searchByAdvertiserIds}
                      onChange={(e) => handleSearchFilterChange('searchByAdvertiserIds', e.target.checked)}
                    >
                      Search By IDs
                    </Checkbox>
                    <Input
                      placeholder="Choose one or many advertisers"
                      value={searchFilters.advertiser}
                      onChange={(e) => handleSearchFilterChange('advertiser', e.target.value)}
                    />
                  </Space>
                </Form.Item>
              </Col>
            </Row>

            <Divider>Additional Filters</Divider>
            <Row gutter={[16, 8]}>
              {Object.keys(additionalFilters).map((option) => (
                <Col span={4} key={option}>
                  <Checkbox
                    checked={additionalFilters[option]}
                    onChange={(e) => handleAdditionalFilterChange(option, e.target.checked)}
                  >
                    {formatOptionName(option)}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* Group By Tab */}
          <TabPane
            tab={
              <span>
                <FilterOutlined />
                Group By
              </span>
            }
            key="3"
          >
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Input
                  placeholder="Search Group By Options"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  value={groupBySearch}
                  onChange={(e) => setGroupBySearch(e.target.value)}
                />
                <Button onClick={clearGroupByOptions}>
                  Clear
                </Button>
                <Button onClick={selectAllGroupByOptions}>
                  Select All
                </Button>
              </Space>
            </div>
            <Row gutter={[16, 8]}>
              {filteredGroupByOptions.map((option) => (
                <Col span={6} key={option}>
                  <Checkbox
                    checked={groupByOptions[option]}
                    onChange={(e) => handleGroupByChange(option, e.target.checked)}
                  >
                    {formatOptionName(option)}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* Other Options Tab */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Other Options
              </span>
            }
            key="4"
          >
            <Row gutter={[16, 16]}>
              {Object.keys(otherOptions).map((option) => (
                <Col span={12} key={option}>
                  <Checkbox
                    checked={otherOptions[option]}
                    onChange={(e) => handleOtherOptionChange(option, e.target.checked)}
                  >
                    {formatOptionName(option)}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </TabPane>

          {/* Basic Filters Tab */}
          <TabPane
            tab={
              <span>
                <FilterOutlined />
                Basic Filters
              </span>
            }
            key="5"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Date Range">
                  <RangePicker
                    style={{ width: '100%' }}
                    value={basicFilters.dateRange}
                    onChange={(dates) => handleBasicFilterChange('dateRange', dates)}
                    format="DD MMM YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Pixel Type">
                  <Select
                    placeholder="Select Pixel Type"
                    allowClear
                    value={basicFilters.pixelType}
                    onChange={(value) => handleBasicFilterChange('pixelType', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="iframe">IFRAME</Option>
                    <Option value="image">IMAGE</Option>
                    <Option value="sdk">SDK</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Event Type">
                  <Select
                    placeholder="Select Event Type"
                    allowClear
                    value={basicFilters.eventType}
                    onChange={(value) => handleBasicFilterChange('eventType', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="conversion">CONVERSION</Option>
                    <Option value="lead">LEAD</Option>
                    <Option value="signup">SIGNUP</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Conversion Status">
                  <Select
                    placeholder="Select Status"
                    allowClear
                    value={basicFilters.conversionStatus}
                    onChange={(value) => handleBasicFilterChange('conversionStatus', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="pending">PENDING</Option>
                    <Option value="approved">APPROVED</Option>
                    <Option value="rejected">REJECTED</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Transaction ID">
                  <Input
                    placeholder="Search Transaction ID"
                    value={basicFilters.transactionId}
                    onChange={(e) => handleBasicFilterChange('transactionId', e.target.value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Tracking ID">
                  <Input
                    placeholder="Search Tracking ID"
                    value={basicFilters.trackingId}
                    onChange={(e) => handleBasicFilterChange('trackingId', e.target.value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Min Amount">
                  <InputNumber
                    placeholder="Min Amount"
                    value={basicFilters.minAmount}
                    onChange={(value) => handleBasicFilterChange('minAmount', value)}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Max Amount">
                  <InputNumber
                    placeholder="Max Amount"
                    value={basicFilters.maxAmount}
                    onChange={(value) => handleBasicFilterChange('maxAmount', value)}
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default ConversionReportFilter;