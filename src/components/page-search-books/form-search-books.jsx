import { useState } from "react";
import { Form, Row, Switch, Typography } from "antd";
import { BasicSearchBooks } from "./basic-search";
import { AdvancedSearchBooks } from "./advanced-search";

const { Title } = Typography;

export const FormSearchBooks = () => {
  const [form] = Form.useForm();

  const [searchMode, setSearchMode] = useState("basic");

  const handleChangeSearchMode = (isChecked) => {
    setSearchMode(isChecked ? "advanced" : "basic");
  };

  const handleChangeFormValues = (changedValues) => {
    console.log(changedValues);
  };

  return (
    <Form
      form={form}
      name="form-search-books"
      layout="vertical"
      className="section"
      onValuesChange={handleChangeFormValues}
    >
      <Row
        align="middle"
        justify="space-between"
        style={{ marginBottom: "12px" }}
      >
        <Title level={5} style={{ margin: "4px 0 4px" }}>
          Search zone
        </Title>
        <Switch
          size="medium"
          checkedChildren="Advanced"
          unCheckedChildren="Basic"
          defaultChecked={searchMode === "advanced"}
          onChange={handleChangeSearchMode}
        />
      </Row>
      {searchMode === "basic" ? (
        <BasicSearchBooks />
      ) : (
        <AdvancedSearchBooks form={form} />
      )}
    </Form>
  );
};
