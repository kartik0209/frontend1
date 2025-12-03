import React from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Switch,
  Button,
  Space,
  Divider,
} from "antd";
import apiClient from "../../services/apiServices";

const { Option } = Select;
const { TextArea } = Input;

const PublisherForm = ({
  form,
  onFinish,
  onCancel,
  loading,
  isEdit = false,
}) => {
  const [showAdvancedSetup, setShowAdvancedSetup] = React.useState(false);
const [managers, setManagers] = React.useState([]);
  const handleAdvancedSetupToggle = (checked) => {
    setShowAdvancedSetup(checked);
    if (!checked) {
      // Clear advanced setup fields when toggle is off
      form.setFieldsValue({
        password: "",
        managers: undefined,
        phone_secondary: "",
        microsoft_teams: "",
        address: "",
        city_secondary: "",
        state_secondary: "",
        zip_code_secondary: "",
        tags: [],
        tax_id: "",
        country_secondary: "",
        username: "",
        note: "",
      });
    }
  };

  React.useEffect(() => {
  const fetchManagers = async () => {
    try {
      const response = await apiClient.get('/common/publisher/users/publisher-managers');
      if (response.data && response.data.success) {
        setManagers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };
  fetchManagers();
}, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="publisher-form"
    >
      {/* Basic Details Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontWeight: 600, color: "#1890ff" }}>
          Basic Details
        </h3>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Full name of the publisher" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
              ]}
            >
              <Input placeholder="Unique Publisher Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Account Status"
              name="status"
              rules={[{ required: true, message: "Please select status" }]}
              initialValue="Active"
            >
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Suspended">Suspended</Option>
                <Option value="Disabled">Disabled</Option>
                <Option value="Rejected">Rejected</Option>
                <Option value="Banned">Banned</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Country" name="country">
              <Input placeholder="[IN] India" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Company (Optional)" name="companyName">
              <Input placeholder="Company/Organization name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Referred By" name="referred_by">
              <Input placeholder="Referred By" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Signup Questions Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontWeight: 600, color: "#1890ff" }}>
          Signup Questions
        </h3>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Company Name" name="company">
              <Input placeholder="Company Name" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Company Address" name="companyAddress">
              <Input placeholder="Company Address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Entity Type" name="entity_type">
              <Input placeholder="Entity Type" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Country" name="country_secondary">
              <Input placeholder="Country" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="City" name="city">
              <Input placeholder="City" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Region/State" name="state">
              <Input placeholder="Region/State" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Zip Code" name="zip_code">
              <Input placeholder="Zip Code" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="IM Type" name="im_type">
              <Input placeholder="IM Type" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="IM Username" name="im_username">
              <Input placeholder="IM Username" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Promotion Method" name="promotion_method">
              <Input placeholder="Promotion Method" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="notify"
              valuePropName="checked"
              initialValue={false}
              style={{ marginTop: 30 }}
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
              <span style={{ marginLeft: 8 }}>Notify this user by email</span>
            </Form.Item>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Advanced Setup Toggle */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Form.Item>
            <Switch
              checked={showAdvancedSetup}
              onChange={handleAdvancedSetupToggle}
              checkedChildren="Advanced Setup ON"
              unCheckedChildren="Advanced Setup OFF"
              style={{ marginRight: 8 }}
            />
            <span
              style={{
                fontWeight: 600,
                color: showAdvancedSetup ? "#1890ff" : "#666",
              }}
            >
              Advanced Setup
            </span>
          </Form.Item>
        </Col>
      </Row>

      {/* Advanced Setup Fields - Only show when toggle is ON */}
      {showAdvancedSetup && (
        <div
          style={{
            backgroundColor: "#fafafa",
            padding: 16,
            borderRadius: 6,
            marginBottom: 24,
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Password (Optional)" name="password">
                <Input.Password placeholder="Leave empty to Auto Generate" />
              </Form.Item>
            </Col>
          <Col xs={24} sm={12}>
  <Form.Item label="Account Manager (Optional)" name="manager_id">
    <Select 
      placeholder="Select account manager"
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      allowClear
    >
      {managers.map((manager) => (
        <Option key={manager.id} value={manager.id}>
          {manager.name} - {manager.email}
        </Option>
      ))}
    </Select>
  </Form.Item>
</Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Phone (Optional)" name="phone_secondary">
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Skype (Optional)" name="microsoft_teams">
                <Input placeholder="Skype" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Address (Optional)" name="address">
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="City (Optional)" name="city_secondary">
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="State (Optional)" name="state_secondary">
                <Input placeholder="State" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Zipcode (Optional)" name="zip_code_secondary">
                <Input placeholder="Zipcode" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Tags (Optional)" name="tags">
                <Select
                  mode="tags"
                  placeholder="Publisher tags"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Tax ID (Optional)" name="tax_id">
                <Input placeholder="Tax ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Country (Optional)" name="country_secondary">
                <Select placeholder="Select country" showSearch>
                  <Option value="USA">USA</Option>
                  <Option value="Canada">Canada</Option>
                  <Option value="UK">UK</Option>
                  <Option value="India">India</Option>
                  <Option value="Australia">Australia</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Username (Optional)" name="username">
                <Input placeholder="Username of the publisher" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Notes (Optional)" name="note">
                <TextArea
                  rows={4}
                  placeholder="Enter notes"
                  maxLength={500}
                  showCount
                />
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                  The content will not be displayed to advertiser or publisher
                </div>
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}

      <div className="form-actions">
        <Space>
          <Button onClick={onCancel} className="cancel-btn">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-btn"
          >
            {isEdit ? "Update Publisher" : "Add Publisher"}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default PublisherForm;
