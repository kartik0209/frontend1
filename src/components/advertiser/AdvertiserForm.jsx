import React from "react";
import { Form, Row, Col, Input, Select, Button, Space, Switch, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Country, State, City } from 'country-state-city';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import currencyList from 'currency-list';
import currencyCodes from "currency-codes";

// Map the data to AntD Select options


const { Option } = Select;
const { TextArea } = Input;

const AdvertiserForm = ({ form, onFinish, onCancel, loading, isEdit = false }) => {
  const [tags, setTags] = React.useState([]);
  const [inputVisible, setInputVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [selectedState, setSelectedState] = React.useState('');
  const [phoneValue, setPhoneValue] = React.useState();

  const allCountries = Country.getAllCountries();


  const currencyOptions = currencyCodes.data.map((currency) => ({
  code: currency.code,
  label: `${currency.code} - ${currency.currency}`,
}));
  
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('');
    setCities([]);
    
    const countryStates = State.getStatesOfCountry(value);
    setStates(countryStates);
    
    form.setFieldsValue({ 
      state: undefined, 
      city: undefined 
    });
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    
    const stateCities = City.getCitiesOfState(selectedCountry, value);
    setCities(stateCities);
    
    form.setFieldsValue({ city: undefined });
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    form.setFieldsValue({ phone: value });
  };

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    form.setFieldsValue({ tags: newTags });
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      form.setFieldsValue({ tags: newTags });
    }
    setInputVisible(false);
    setInputValue('');
  };

  React.useEffect(() => {
    const formTags = form.getFieldValue('tags') || [];
    setTags(formTags);
  }, [form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="advertiser-form"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Company Name"
            name="companyName"
            rules={[{ required: true, message: "Please enter company name" }]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneValue}
              onChange={handlePhoneChange}
              defaultCountry="US"
              international
              countryCallingCodeEditable={false}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
            initialValue="Pending"
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
          <Form.Item
            label="Reference ID"
            name="reference_id"
            rules={[{ required: true, message: "Please enter reference ID" }]}
          >
            <Input placeholder="Enter reference ID" />
          </Form.Item>
        </Col>
      </Row>

      {!isEdit && (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" }
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Managers"
            name="managers"
            rules={[{ required: true, message: "Please enter manager name" }]}
          >
            <Input placeholder="Enter manager name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Website URL"
            name="website_url"
            rules={[
              { type: "url", message: "Please enter valid URL" }
            ]}
          >
            <Input placeholder="Enter website URL" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select country" }]}
          >
            <Select 
              placeholder="Select country"
              showSearch
              optionFilterProp="children"
              onChange={handleCountryChange}
              filterOption={(input, option) =>
                option.children && typeof option.children === 'string' 
                  ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              {allCountries.map((country) => (
                <Option key={country.isoCode} value={country.isoCode}>
                  {country.flag} {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please select state" }]}
          >
            <Select 
              placeholder="Select state"
              showSearch
              optionFilterProp="children"
              onChange={handleStateChange}
              disabled={!selectedCountry}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {states.map((state) => (
                <Option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please select city" }]}
          >
            <Select 
              placeholder="Select city"
              showSearch
              optionFilterProp="children"
              disabled={!selectedState}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {cities.map((city) => (
                <Option key={city.name} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Currency"
            name="currency"
            rules={[{ required: true, message: "Please select currency" }]}
          >
          
            <Select placeholder="Select currency" showSearch optionFilterProp="label">
                {currencyOptions.map((curr) => (
                  <Option key={curr.code} value={curr.code} label={curr.label}>
                    {curr.label}
                  </Option>
                ))}
              </Select>
          
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Entity Type"
            name="entity_type"
            rules={[{ required: true, message: "Please select entity type" }]}
          >
            <Select placeholder="Select entity type">
              <Option value="Agency">Agency</Option>
              <Option value="Direct Advertiser">Direct Advertiser</Option>
              <Option value="Network">Network</Option>
              <Option value="Individual">Individual</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Notifications"
            name="notify"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="On" unCheckedChildren="Off" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            label="Tags"
            name="tags"
          >
            <div>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleClose(tag)}
                  style={{ marginBottom: 8 }}
                >
                  {tag}
                </Tag>
              ))}
              {inputVisible && (
                <Input
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            label="Notes"
            name="notes"
          >
            <TextArea 
              rows={4} 
              placeholder="Enter notes about the advertiser" 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>

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
            {isEdit ? "Update Advertiser" : "Add Advertiser"}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default AdvertiserForm;