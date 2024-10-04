import { useState } from "react";
import { Form, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";

export const CustomSelect = ({ formItem, maxCount, options }) => {
  const [value, setValue] = useState([]);

  const suffix = (
    <>
      <span>
        {value.length} / {maxCount}
      </span>
      <DownOutlined />
    </>
  );

  return (
    <Form.Item
      name={formItem.name}
      label={formItem.label}
      className={formItem.className}
    >
      <Select
        mode="multiple"
        maxCount={maxCount}
        optionFilterProp="label"
        options={options}
        value={value}
        suffixIcon={suffix}
        onChange={setValue}
      ></Select>
    </Form.Item>
  );
};
