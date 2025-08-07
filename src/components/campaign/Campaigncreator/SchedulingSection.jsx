import React from "react";
import {
  Form,
  Switch,
  DatePicker,
  InputNumber,
  Select,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import moment from "moment-timezone";
const { Option } = Select;
const { Text } = Typography;

const timezones = moment.tz.names();

const SchedulingSection = ({ formState, updateFormState }) => {
  

  const handleTimezoneChange = (selectedTimezone) => {
    console.log("Selected timezone:", selectedTimezone);
  
    updateFormState({ timezone: selectedTimezone });
   
  };

  return (
    <>
      <Card title="Time Targeting" className="campaign-form__section">
        <Form.Item label="Enable Time Targeting" name="enableTimeTargeting">
          <Switch
            checked={formState.enableTimeTargeting}
            onChange={(checked) =>
              updateFormState({ enableTimeTargeting: checked })
            }
          />
          <Text type="secondary" style={{ marginLeft: 8 }}>
            Campaign active/pause at specific time of day
          </Text>
        </Form.Item>

        {formState.enableTimeTargeting && (
          <>
            <Form.Item label="Timezone" name="timezone">
              <Select 
                placeholder="Select timezone"
                value={formState.timezone}
                onChange={handleTimezoneChange}
                 showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                 {timezones.map((tz) => {
          const offset = moment.tz(tz).utcOffset();
          const offsetFormatted =
            "GMT" +
            (offset >= 0 ? "+" : "") +
            moment
              .duration(offset, "minutes")
              .asHours()
              .toFixed(2)
              .replace(".00", "");

          return (
            <Option key={tz} value={tz}>
              {`(${offsetFormatted}) ${tz}`}
            </Option>
          );
        })}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Start Hour (24 Hour format)" name="startHour">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    min={0}
                    max={23}
                    value={formState.startHour}
                    onChange={(value) => updateFormState({ startHour: value })}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="End Hour (24 Hour format)" name="endHour">
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="0"
                    min={0}
                    max={23}
                    value={formState.endHour}
                    onChange={(value) => updateFormState({ endHour: value })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Days" name="targetingDays">
              <Select 
                mode="multiple" 
                placeholder="Select days"
                value={formState.targetingDays}
                onChange={(value) => updateFormState({ targetingDays: value })}
              >
                <Option value="monday">Monday</Option>
                <Option value="tuesday">Tuesday</Option>
                <Option value="wednesday">Wednesday</Option>
                <Option value="thursday">Thursday</Option>
                <Option value="friday">Friday</Option>
                <Option value="saturday">Saturday</Option>
                <Option value="sunday">Sunday</Option>
              </Select>
            </Form.Item>
          </>
        )}
      </Card>

      <Card title="Schedule Status Change" className="campaign-form__section">
        <Form.Item label="Schedule Status Change" name="scheduleStatusChange">
          <Switch
            checked={formState.enableScheduleStatus}
            onChange={(checked) =>
              updateFormState({ enableScheduleStatus: checked })
            }
          />
          <Text type="secondary" style={{ marginLeft: 8 }}>
            Update campaign status at specific time and date
          </Text>
        </Form.Item>

        {formState.enableScheduleStatus && (
          <>
            <Form.Item label="Status to be set" name="statusToSet">
              <Select 
                placeholder="Active"
                value={formState.statusToSet}
                onChange={(value) => updateFormState({ statusToSet: value })}
              >
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Schedule Date" name="scheduleDate">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select date and time"
                showTime
                value={formState.scheduleDate}
                onChange={(date) => updateFormState({ scheduleDate: date })}
              />
            </Form.Item>

            <Form.Item
              label="Publisher Email Notify"
              name="publisherNotifyManual"
            >
              <Switch 
                checked={formState.publisherNotifyManual}
                onChange={(checked) => updateFormState({ publisherNotifyManual: checked })}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                Notify publishers about status change
              </Text>
            </Form.Item>

            <Form.Item label="Publisher Notify Time" name="publisherNotifyTime">
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Select notification time"
                showTime
                value={formState.publisherNotifyTime}
                onChange={(date) => updateFormState({ publisherNotifyTime: date })}
              />
            </Form.Item>
          </>
        )}
      </Card>
    </>
  );
};

export default SchedulingSection;