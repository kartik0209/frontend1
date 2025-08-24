import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
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
} from "antd";
import {
  CopyOutlined,
  LinkOutlined,
  SettingOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import apiClient from "../../services/apiServices";
import "../../styles/TrackingLinkCard.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const TrackingLinkCard = ({ campaignId ,issaved}) => {
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

  // Custom button style with the specified color
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
    
  useEffect(() => {
   

    fetchApprovedPublishers();
  }, []);

 // REMOVE the old generateTrackingLink function and REPLACE it with this new function.
// This new function takes the publisherId as an argument.
const fetchAndSetLink = async (publisherId) => {
  if (!publisherId) return;

  setGenerateLoading(true);
  try {
    const requestData = {
      campaignId: String(campaignId),
      publisherIds: [String(publisherId)],
    };

    // Add additional parameters to body if addTrackingParam is checked
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
    setGeneratedLink(""); // Clear link on error
  } finally {
    setGenerateLoading(false);
  }
};

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

 // UPDATE this function
const handlePublisherChange = (value) => {
  setSelectedPublisher(value);
  setGeneratedLink(""); // Clear previous link immediately

  // If a publisher is selected, fetch the new link
  if (value) {
    fetchAndSetLink(value);
  }
};

  const handleLinkOptionChange = (option, checked) => {
    setLinkOptions((prev) => ({
      ...prev,
      [option]: checked,
    }));

    // Clear additional params when addTrackingParam is unchecked
    if (option === "addTrackingParam" && !checked) {
      setAdditionalParams({
        p1: "",
        p2: "",
        p3: "",
        p4: "",
      });
    }

    // Clear generated link when any option changes
    if (generatedLink) {
      setGeneratedLink("");
    }
  };

  return (
    <Card
      className="tracking-link-card"
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
          >
            {publishersList.map((pub) => (
              <Option key={pub.id} value={pub.id}>
                {`(ID: ${pub.id}) ${pub.name}`}
              </Option>
            ))}
          </Select>

          <Text type="secondary" className="helper-text">
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
    className="generated-link-textarea"
  />
  <Space className="link-actions">
    {/* This is the new "Open Link" button */}
    <Button
      type="primary"
      icon={<ExportOutlined />}
      onClick={openLinkInNewTab}
      loading={generateLoading} // Shows loading state while fetching
      disabled={!generatedLink || generateLoading} // Disabled until link is ready
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
              <>
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
                    className="helper-text"
                    style={{ fontSize: 12, marginTop: 4, display: "block" }}
                  >
                    These parameters will be added to the generated tracking
                    link as query parameters.
                  </Text>
                </div>
              </>
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
  );
};

export default TrackingLinkCard;
