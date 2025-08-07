import React from "react";
import { Form, Button, Space } from "antd";

const FormActions = ({ loading, form }) => {
  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form.Item className="campaign-form__submit">
      <Space>
        <Button type="primary" htmlType="submit" loading={loading} size="large">
          {loading ? "Creating Campaign..." : "Create Campaign"}
        </Button>
        <Button htmlType="button" size="large" onClick={handleReset}>
          Reset
        </Button>
      </Space>
    </Form.Item>
  );
};

export default FormActions;