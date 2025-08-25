import React, { useState, useEffect } from "react";
import {
  Card,
  Transfer,
  Select,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  Space,
  message,
  Tooltip,
  Divider,
  Spin,
} from "antd";
import {
  CopyOutlined,
  LinkOutlined,
  SaveOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiServices";

const { Title, Text } = Typography;
const { Option } = Select;

const CombinedPublisherManagement = ({ 
  campaignId, 
  onApprovedPublishersChange,
  setIsSaved 
}) => {
  // Publisher Access States
  const [allPublishers, setAllPublishers] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [issaved, setIsSavedLocal] = useState(false);

  // Tracking Link States
  const [publishersList, setPublishersList] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [generatedLink, setGeneratedLink] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [linkOptions, setLinkOptions] = useState({
    addTrackingParam: false,
    addSourceSubPublisher: false,
    changeTrackingDomain: false,
    addDeepLink: false,
    googleAdsLink: false,
    generateShortLink: false,
  });
  const [additionalParams, setAdditionalParams] = useState({
    p1: "",
    p2: "",
    p3: "",
    p4: "",
  });

  // Custom button style
  const customButtonStyle = {
    backgroundColor: "#0a1a4e",
    borderColor: "#0a1a4e",
    color: "white",
  };

  const customButtonHoverStyle = {
    backgroundColor: "#081540",
    borderColor: "#081540",
    color: "white",
  };

  // Fetch all publishers for transfer component
  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/common/publisher/list', {
        excludeApprovedForCampaign: true,
        campaign_id: campaignId
      });

      if (response.data?.success) {
        const publishersData = response.data.data.map(publisher => ({
          key: publisher.id.toString(),
          title: publisher.name,
          id: publisher.id,
          name: publisher.name
        }));
        
        setAllPublishers(publishersData);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch publishers');
      }
    } catch (error) {
      message.error(error.message || 'Failed to fetch publishers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch approved publishers for tracking link dropdown
  const fetchApprovedPublishers = async () => {
    if (!campaignId) return;

    setListLoading(true);
    setPublishersList([]);
    setSelectedPublisher(null);
    setGeneratedLink("");

    try {
      const response = await apiClient.get(
        `/common/publisher/${campaignId}/approved-publishers`
      );
      if (response.data?.success) {
        setPublishersList(response.data.data || []);
      } else {
        throw new Error(
          response.data?.message || "Failed to load publishers."
        );
      }
    } catch (error) {
      message.error(
        error.message || "An error occurred while fetching publishers."
      );
    } finally {
      setListLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPublishers();
    fetchApprovedPublishers();
  }, [campaignId]);

  // Refresh approved publishers when issaved changes
  useEffect(() => {
    if (issaved) {
      fetchApprovedPublishers();
    }
  }, [issaved]);

  // Generate tracking link
  const fetchAndSetLink = async (publisherId) => {
    if (!publisherId) return;

    setGenerateLoading(true);
    try {
      const requestData = {
        campaignId: String(campaignId),
        publisherIds: [String(publisherId)],
      };

      if (linkOptions.addTrackingParam) {
        requestData.p1 = additionalParams.p1;
        requestData.p2 = additionalParams.p2;
        requestData.p3 = additionalParams.p3;
        requestData.p4 = additionalParams.p4;
      }

      const response = await apiClient.post(
        "/admin/campaign-assignment/assign",
        requestData
      );

      if (response.data?.success && response.data.data.length > 0) {
        const assignmentData = response.data.data[0];
        let finalLink = assignmentData.publisherLink;

        setGeneratedLink(finalLink);
        message.success("Tracking link generated successfully!");
      } else {
        throw new Error(
          response.data?.message || "Failed to generate tracking link"
        );
      }
    } catch (error) {
      message.error(error.message || "Failed to generate tracking link");
      setGeneratedLink("");
    } finally {
      setGenerateLoading(false);
    }
  };

  // Handle publisher selection for tracking link
  const handlePublisherChange = (value) => {
    setSelectedPublisher(value);
    setGeneratedLink("");

    if (value) {
      fetchAndSetLink(value);
    }
  };

  // Handle transfer changes for publisher approval
  const handleTransferChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);

    const currentApproved = allPublishers.filter(pub =>
      newTargetKeys.includes(pub.key)
    );
    onApprovedPublishersChange?.(currentApproved);
  };

  // Save approved publishers
  const handleSave = async () => {
    if (!targetKeys.length) {
      message.warning('Please select at least one publisher to approve');
      return;
    }

    setSaveLoading(true);
    try {
      const response = await apiClient.post('/common/publisher/approve', {
        campaignId: Number(campaignId),
        publisherIds: targetKeys.map(Number),
      });

      if (response.data?.success) {
        message.success('Publishers approved successfully!');
        
        // Immediately update the tracking link dropdown with newly approved publishers
        const newlyApproved = allPublishers.filter(pub => 
          targetKeys.includes(pub.key)
        ).map(pub => ({
          id: pub.id,
          name: pub.name
        }));
        
        // Add newly approved publishers to existing list
        setPublishersList(prev => [...prev, ...newlyApproved]);
        
        setTargetKeys([]);
        onApprovedPublishersChange?.([]);
        
        const newSavedState = !issaved;
        setIsSavedLocal(newSavedState);
        setIsSaved?.(newSavedState);

        // Fetch updated data in background
        fetchPublishers();
        // Don't need to fetch approved publishers since we updated immediately above
      } else {
        throw new Error(response.data?.message || 'Failed to approve publishers');
      }
    } catch (error) {
      message.error(error.message || 'Failed to save publisher approval');
    } finally {
      setSaveLoading(false);
    }
  };

  // Link options change handler
  const handleLinkOptionChange = (option, checked) => {
    setLinkOptions((prev) => ({
      ...prev,
      [option]: checked,
    }));

    if (option === "addTrackingParam" && !checked) {
      setAdditionalParams({
        p1: "",
        p2: "",
        p3: "",
        p4: "",
      });
    }

    if (generatedLink) {
      setGeneratedLink("");
    }
  };

  // Utility functions for tracking link
  const openLinkInNewTab = () => {
    if (generatedLink) {
      const modifiedLink =
        generatedLink +
        (generatedLink.includes("?") ? "&" : "?") +
        "source=tracking_dashboard";
      window.open(modifiedLink, "_blank", "noopener,noreferrer");
      message.success("Link opened in new tab!");
    } else {
      message.warning("Please generate a link first");
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      message.success("Link copied to clipboard!");
    }
  };

  // Filter and render functions for transfer
  const filterPublishers = (inputValue, item) =>
    item.title.toLowerCase().includes(inputValue.toLowerCase());

  const renderItem = (item) => `${item.id} - ${item.name}`;

  if (loading) {
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card 
          title="Publisher Management" 
          bordered={false}
          headStyle={{ backgroundColor: '#fafafa' }}
        >
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading publishers...</div>
          </div>
        </Card>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Tracking Link Card - Moved to top */}
      <Card
        title={
          <Space>
            <LinkOutlined />
            <span>Tracking Link</span>
          </Space>
        }
        bordered={false}
        headStyle={{ backgroundColor: "#fafafa" }}
      >
        <div className="tracking-link-content">
          <div className="publisher-selection">
            <Text strong>Approved Publishers</Text>
            <Select
              placeholder="Choose any publisher to Generate its tracking Link"
              value={selectedPublisher}
              onChange={handlePublisherChange}
              className="publisher-select"
              showSearch
              loading={listLoading}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: '100%', marginTop: 8 }}
            >
              {publishersList.map((pub) => (
                <Option key={pub.id} value={pub.id}>
                  {`(ID: ${pub.id}) ${pub.name}`}
                </Option>
              ))}
            </Select>

            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
              To generate a tracking link, select an affiliate from below.
              Tracking links records click for reporting.
            </Text>
          </div>

          <Divider />

          <div className="link-generation">
            <Title level={5}>Generated Link</Title>
            
            <div className="generated-link-section">
              <Input.TextArea
                value={generatedLink}
                placeholder="Select a publisher to generate a tracking link..."
                rows={3}
                readOnly
                style={{ marginBottom: 8 }}
              />
              <Space className="link-actions">
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={openLinkInNewTab}
                  loading={generateLoading}
                  disabled={!generatedLink || generateLoading}
                  style={customButtonStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.target.style, customButtonHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.target.style, customButtonStyle)
                  }
                >
                  Open Link
                </Button>

                <Tooltip title="Copy Link">
                  <Button
                    icon={<CopyOutlined />}
                    onClick={copyToClipboard}
                    disabled={!generatedLink}
                    style={customButtonStyle}
                    onMouseEnter={(e) =>
                      Object.assign(e.target.style, customButtonHoverStyle)
                    }
                    onMouseLeave={(e) =>
                      Object.assign(e.target.style, customButtonStyle)
                    }
                  />
                </Tooltip>
              </Space>
            </div>
          </div>

          <Divider />

          <div className="link-options">
            <Title level={5}>Link Options</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.addTrackingParam}
                  onChange={(e) =>
                    handleLinkOptionChange("addTrackingParam", e.target.checked)
                  }
                >
                  Add Tracking Param
                </Checkbox>
              </Col>
              {linkOptions.addTrackingParam && (
                <Col span={24}>
                  <div className="additional-params" style={{ marginTop: 16 }}>
                    <Text strong>Additional Parameters</Text>
                    <Row gutter={[16, 8]} style={{ marginTop: 8 }}>
                      <Col span={6}>
                        <Input
                          placeholder="P1 value"
                          value={additionalParams.p1}
                          onChange={(e) =>
                            setAdditionalParams((prev) => ({
                              ...prev,
                              p1: e.target.value,
                            }))
                          }
                          addonBefore="P1"
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          placeholder="P2 value"
                          value={additionalParams.p2}
                          onChange={(e) =>
                            setAdditionalParams((prev) => ({
                              ...prev,
                              p2: e.target.value,
                            }))
                          }
                          addonBefore="P2"
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          placeholder="P3 value"
                          value={additionalParams.p3}
                          onChange={(e) =>
                            setAdditionalParams((prev) => ({
                              ...prev,
                              p3: e.target.value,
                            }))
                          }
                          addonBefore="P3"
                        />
                      </Col>
                      <Col span={6}>
                        <Input
                          placeholder="P4 value"
                          value={additionalParams.p4}
                          onChange={(e) =>
                            setAdditionalParams((prev) => ({
                              ...prev,
                              p4: e.target.value,
                            }))
                          }
                          addonBefore="P4"
                        />
                      </Col>
                    </Row>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, marginTop: 4, display: "block" }}
                    >
                      These parameters will be added to the generated tracking
                      link as query parameters.
                    </Text>
                  </div>
                </Col>
              )}
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.addSourceSubPublisher}
                  onChange={(e) =>
                    handleLinkOptionChange(
                      "addSourceSubPublisher",
                      e.target.checked
                    )
                  }
                >
                  Add Source (Sub Publisher)
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.changeTrackingDomain}
                  onChange={(e) =>
                    handleLinkOptionChange(
                      "changeTrackingDomain",
                      e.target.checked
                    )
                  }
                >
                  Change Tracking Domain
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.addDeepLink}
                  onChange={(e) =>
                    handleLinkOptionChange("addDeepLink", e.target.checked)
                  }
                >
                  Add DeepLink
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.googleAdsLink}
                  onChange={(e) =>
                    handleLinkOptionChange("googleAdsLink", e.target.checked)
                  }
                >
                  Google Ads Link
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  checked={linkOptions.generateShortLink}
                  onChange={(e) =>
                    handleLinkOptionChange("generateShortLink", e.target.checked)
                  }
                >
                  Generate Short Link
                </Checkbox>
              </Col>
            </Row>
          </div>
        </div>
      </Card>

      {/* Publisher Access Card - Moved to bottom */}
      <Card
        title="Approve Publishers"
        bordered={false}
        headStyle={{ backgroundColor: '#fafafa' }}
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saveLoading}
            disabled={!targetKeys.length}
            style={{
              backgroundColor: "transparent",
              color: 'black',
              border: "none"
            }}
          >
            Save ({targetKeys.length})
          </Button>
        }
      >
        <Transfer
          dataSource={allPublishers}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          render={renderItem}
          titles={['Available Publishers', 'Approved Publishers']}
          listStyle={{
            width: '40%',
            height: 300,
            border: '1px solid #d9d9d9',
            borderRadius: '6px'
          }}
          operations={['Approve', 'Remove']}
          showSearch
          filterOption={filterPublishers}
          locale={{
            itemsUnit: 'publishers',
            itemUnit: 'publisher',
            searchPlaceholder: 'Search publishers...'
          }}
          oneWay={false}
        />
      </Card>
    </Space>
  );
};

export default CombinedPublisherManagement;